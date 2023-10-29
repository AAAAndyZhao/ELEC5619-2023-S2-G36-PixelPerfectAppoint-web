<template>
    <div class="app-appointment-create-participants" v-loading="loading">
        <div class="app-title">
            <h3>Participants</h3>
        </div>
        <div class="app-content">
            <el-card class="app-card app-search-user-card">
                <template #header>
                    <div class="clearfix">
                        <span>Search User</span>
                    </div>
                </template>
                <el-input class="app-search-user-input" v-model="searchText" size="large"
                placeholder="Search by username / email / alias / id" @keyup.native.enter="searchUser">
                    <template #prefix>
                        <el-icon><Search /></el-icon>
                    </template>
                    <template #append>
                        <el-button type="primary" size="large" @click="searchUser">Search</el-button>
                    </template>
                </el-input>
                <div class="app-user-card-wrapper">
                    <UserSearchList :data="userSearchedData" :selected-users="selectedUsers"
                    @add-user="handleAddUserAsParticipant" />
                </div>
                <el-pagination layout="prev, pager, next"
                :total="pageProps.total"
                :current-page="pageProps.page"
                :page-size="pageProps.size"
                @update:current-page="pageProps.handleCurrentPageChange"/>
            </el-card>
            <el-card class="app-card app-selected-user-card">
                <template #header>
                    <div class="clearfix">
                        <span>Selected Participants</span>
                    </div>
                </template>
                <div class="app-user-card-wrapper">
                    <ParticipantList :selected-users="selectedUsers"
                    @remove-user="handleRemoveUserFromParticipant" />
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { Search } from '@element-plus/icons-vue'
import UserSearchList from './user-search-list.vue'
import ParticipantList from './participant-list.vue'
import userApi from '@/services/user-api';
import { ElMessage } from 'element-plus';

const emits = defineEmits(['data-update']);

const props = defineProps({
    data: {
        type: Object,
        required: false,
        default: () => {}
    }
});

const userSearchedData = ref([]);
const selectedUsers = ref([]);
const searchText = ref('');
const loading = ref(false);

const pageProps = {
    total: 0,
    page: 1,
    size: 10,
    handleCurrentPageChange: (page) => {
        pageProps.page = page;
        searchUser();
    }
}

const searchUser = async () => {
    try{
        loading.value = true;
        const res = await userApi.searchUser(searchText.value, pageProps.page, pageProps.size);
        if (res.code === 0 && res.data && res.data.length > 0) {
            userSearchedData.value = res.data;
            pageProps.total = res.totalCount;
        } else {
            userSearchedData.value = [];
        }
    }catch(err){
        ElMessage.error('Failed to search user');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 500);
    }
}

const handleAddUserAsParticipant = (user) => {
    selectedUsers.value.push(user);
    emits('data-update', 'participants', selectedUsers.value);
}
const handleRemoveUserFromParticipant = (user) => {
    const index = selectedUsers.value.map(item => item.id).indexOf(user.id);
    if (index > -1) {
        selectedUsers.value.splice(index, 1);
    }
    emits('data-update', 'participants', selectedUsers.value);
}

const syncDataToParent = () => {
    emits('data-update', 'participants', selectedUsers.value);
}

watchEffect(() => {
    if (!props.data || !props.data.selectedUsers) return;
    // if props.data is not an array, return
    if (!Array.isArray(props.data.selectedUsers)) return;
    // if all properties in props.data has no valid value, return
    if (props.data.selectedUsers.length == 0) return;
    if (props.data.selectedUsers.length === selectedUsers.value.length) return;
    // push all valid values to selectedUsers
    selectedUsers.value = [];
    props.data.selectedUsers.forEach(item => selectedUsers.value.push(item));
});
</script>

<style scoped>
.app-appointment-create-participants{
    width: 100%;
    min-height: calc(100vh - 160px);
    box-sizing: border-box;
    .app-title{
        height: 36px;
        width: 100%;
        box-sizing: border-box;
        padding: 0;
        text-align: left;
    }

    .app-content {
        height: calc(100vh - 196px);
        width: 100%;
        box-sizing: border-box;
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        .app-card {
            height: 100%;
            width: 49%;
            box-sizing: border-box;
        }
    }
}
.app-appointment-create-participants .app-title h3 {
    margin-block-start: 0;
}
.app-user-card-wrapper{
    height: calc(100% - 93px);
    width: 100%;
    margin-top: 20px;
    padding: 0;
    overflow-y: auto;
}
:deep(.app-content>.app-card>.el-card__body) {
    height: calc(100% - 64px);
    width: 100%;
    box-sizing: border-box;
}
.app-search-user-card .el-pagination {
    justify-content: center
}
</style>
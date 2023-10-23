<template>
    <div class="app-participant-add">
        <el-input class="app-search-user-input" v-model="searchText" size="large"
            placeholder="Search by username / email / alias / id" @keyup.native.enter="searchUser">
            <template #prefix>
                <el-icon>
                    <Search />
                </el-icon>
            </template>
            <template #append>
                <el-button type="primary" size="large" @click="searchUser">Search</el-button>
            </template>
        </el-input>
        <div class="app-user-table-wrapper">
            <el-table class="app-user-table" :data="userData" show-overflow-tooltip>
                <el-table-column prop="avatar" width="70">
                    <template #default="{ row }">
                        <user-avatar :user="row" :size="40"></user-avatar>
                    </template>
                </el-table-column>
                <el-table-column prop="alias" label="Alias"></el-table-column>
                <el-table-column prop="userName" label="Username"></el-table-column>
                <el-table-column prop="operation" width="200">
                    <template #default="{ row }">
                        <el-tag v-if="row.isSelf" type="info">You</el-tag>
                        <div v-else-if="row.isParticipant" class="app-participant-operation-container">
                            <transition name="slide-fade">
                                <el-tag class="app-participant-operation" v-if="showParticipantTag"
                                    :type="row.appointmentStatus.tagType"
                                    @mouseenter="handleMouseEnterParticipantTag(row.appointmentStatus.code)">{{
                                        row.appointmentStatus.value }}</el-tag>
                            </transition>
                            <transition name="slide-fade">
                                <el-button class="app-participant-operation"
                                    v-if="showInviteAgainTag && row.appointmentStatus.code !== 1" type="primary"
                                    size="small" @click="handleInviteUserAsParticipant(row)"
                                    @mouseleave="hanldeMouseLeaveInviteAgainButton">
                                    Invite Again
                                </el-button>
                            </transition>
                        </div>
                        <el-button v-else type="primary" size="small"
                            @click="handleInviteUserAsParticipant(row)">Invite</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="pageProps.total" :current-page="pageProps.page"
                :page-size="pageProps.size" @update:current-page="pageProps.handleCurrentPageChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import userApi from '@/services/user-api';
import UserAvatar from '@/components/user/user-avatar.vue';
import { ElMessage } from 'element-plus';
import MenuUtils from '@/utils/menu';

const emits = defineEmits(['invite-user']);
const props = defineProps({
    participants: {
        type: Array,
        required: false,
        default: () => []
    }
});
const statusMenu = $MENU["APPOINTMENT_PARTICIPANT_STATUS"];
const searchText = ref('');
const userData = ref([]);
const pageProps = ref({
    total: 0,
    page: 1,
    size: 10,
    handleCurrentPageChange: (page) => {
        pageProps.value.page = page;
        searchUser();
    }
});
const showParticipantTag = ref(true);
const showInviteAgainTag = ref(false);
const selfUserId = localStorage.getItem('userId');
const searchUser = async () => {
    try {
        const res = await userApi.searchUser(
            searchText.value,
            pageProps.value.page,
            pageProps.value.size
        );
        if (res.code === 0) {
            for (const participant of props.participants) {
                console.log(participant)
                if (res.data.find(user => user.id === participant.user.id)) {
                    res.data.find(user => user.id === participant.user.id).isParticipant = true;
                    res.data.find(user => user.id === participant.user.id).appointmentStatus =
                        MenuUtils.getSingleMenuSelectedValue(statusMenu, participant.status);
                }
                if (res.data.find(user => user.id === selfUserId)) {
                    res.data.find(user => user.id === selfUserId).isSelf = true;
                }
            }
            userData.value = res.data;
            pageProps.value.total = res.totalCount;
        } else {
            ElMessage.error('Failed to search user: ' + res.msg || 'Unknown error');
        }
    } catch (err) {
        console.log(err);
        ElMessage.error('Failed to search user: ' + err.message || 'Unknown error');
    }
}

const handleInviteUserAsParticipant = async (user) => {
    emits('invite-user', user)
}

const handleMouseEnterParticipantTag = (status) => {
    if (status === 1) {
        return;
    }
    showInviteAgainTag.value = true;
    showParticipantTag.value = false;
}
const hanldeMouseLeaveInviteAgainButton = () => {
    showInviteAgainTag.value = false;
    showParticipantTag.value = true;
}
watch(() => props.participants, () => {
    searchUser();
}, { deep: true });
</script>

<style scoped>
.app-participant-add {
    width: 100%;
    height: 50vh;
}

.app-user-table-wrapper {
    width: 100%;
    height: calc(100% - 10px);
    box-sizing: border-box;
    padding: 5px;
}

.app-user-table {
    width: 100%;
    height: calc(100% - 32px);
}

.app-participant-operation-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.app-participant-operation-container>.app-participant-operation {
    /* all elements are in the same position */
    position: absolute;

}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: transform 0.5s, opacity 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.el-pagination {
    justify-content: center
}</style>
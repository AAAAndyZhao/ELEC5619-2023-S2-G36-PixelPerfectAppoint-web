<template>
    <div class="app-user-following" v-loading="loading">
        <el-tabs tab-position="left" class="app-follower-following-tabs">
            <el-tab-pane label="Followers">
                <div class="app-followers-container app-container">
                    <div class="app-container-header">
                        <div class="app-container-header-title">My Followers</div>
                        <el-input class="app-container-header-search-input"
                        :prefix-icon="Search" placeholder="Search followers"
                        v-model="followerProps.searchText"
                        @keyup.enter.native="fetchFollowerData(true)"></el-input>
                    </div>
                    <div class="app-container-content">
                        <UserFollowersList :data="followerData" @follow-user="handleFollowUser" @unfollow-user="handleUnfollowUser"/>
                        <el-pagination layout="prev, pager, next"
                        :total="followerProps.total"
                        :current-page="followerProps.currentPage"
                        :page-size="followerProps.pageSize"
                        @update:current-page="followerProps.handleCurrentPageChange"/>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Followings">
                <div class="app-followings-container app-container">
                    <div class="app-container-header">
                        <div class="app-container-header-title">My Followings</div>
                        <el-input class="app-container-header-search-input"
                        :prefix-icon="Search" placeholder="Search followings"
                        @keyup.enter.native="fetchFollowingData(true)"></el-input>
                    </div>
                    <div class="app-container-content">
                        <UserFollowingsList :data="followingData" @unfollow-user="handleUnfollowUser"/>
                        <el-pagination layout="prev, pager, next"
                        :total="followingProps.total"
                        :current-page="followingProps.currentPage"
                        :page-size="followingProps.pageSize"
                        @update:current-page="followingProps.handleCurrentPageChange"/>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>    
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Search } from '@icon-park/vue-next';
import UserFollowingsList from './user-followings-list.vue';
import UserFollowersList from './user-followers-list.vue';
import userApi from '@/services/user-api';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(false);
const followerData = ref([]);
const followingData = ref([]);
const followerProps = ref({
    searchText: '',
    currentPage: 1,
    pageSize: 30,
    total: 0,
    handleCurrentPageChange: (page) => {
        followerProps.currentPage = page;
        fetchFollowerData();
    }
});
const followingProps = ref({
    searchText: '',
    currentPage: 1,
    pageSize: 30,
    total: 0,    
    handleCurrentPageChange: (page) => {
        followingProps.currentPage = page;
        fetchFollowingData();
    }
});

const fetchFollowerData = async (isReload = false) => {
    loading.value = true;
    const userId = localStorage.getItem('userId');
    if (!userId){
        ElMessage.error('Please login first');
        return;
    }
    if (isReload){
        followerProps.currentPage = 1;
    }
    try{
        const res = await userApi.getUserFollowers(
            userId,
            followerProps.value.currentPage,
            followerProps.value.pageSize,
            followerProps.value.searchText
        );
        if (res.code === 0){
            followerData.value = res.data;
            followerProps.total = res.totalCount;
        }else{
            ElMessage.error('Failed to get follower data');
        }
    }catch(err){
        console.log(err);
        ElMessage.error('Failed to get follower data');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
};

const fetchFollowingData = async (isReload = false) => {
    loading.value = true;
    const userId = localStorage.getItem('userId');
    if (!userId){
        ElMessage.error('Please login first');
        return;
    }
    if (isReload){
        followingProps.currentPage = 1;
    }
    try{
        const res = await userApi.getUserFollowings(
            userId,
            followingProps.value.currentPage,
            followingProps.value.pageSize,
            followingProps.value.searchText
        );
        if (res.code === 0){
            followingData.value = res.data;
            followingProps.total = res.totalCount;
        }else{
            ElMessage.error('Failed to get following data');
        }
    }catch(err){
        console.log(err);
        ElMessage.error('Failed to get following data');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
};

const handleFollowUser = async (targetUser) => {
    loading.value = true;
    try{
        const res = await userApi.followUser(targetUser.id);
        if (res.code === 0){
            ElMessage.success('Follow user successfully');
            fetchFollowingData(true);
            fetchFollowerData(true);
        }else{
            ElMessage.error('Failed to follow user');
        }
    }catch(err){
        ElMessage.error('Failed to follow user');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

const handleUnfollowUser = async (targetUser) => {
    ElMessageBox.confirm(
        `Are you sure to unfollow ${targetUser.alias}?`,
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    ).then(async () => {
        loading.value = true;
        try{
            const res = await userApi.unfollowUser(targetUser.id);
            if (res.code === 0){
                ElMessage.success('You have unfollowed this user');
                fetchFollowingData(true);
                fetchFollowerData(true);
            }else{
                ElMessage.error('Failed to unfollow user');
            }
        }catch(err){
            console.error(err);
            ElMessage.error('Failed to unfollow user');
        }finally{
            setTimeout(() => {
                loading.value = false;
            }, 1000);
        }
    }).catch(() => {
        // do nothing
    });
}

onMounted(() => {
    fetchFollowingData(true);
    fetchFollowerData(true);
});
</script>

<style scoped>
.app-user-following {
    height: 100%;
    min-height: 100%;
}
.app-follower-following-tabs {
    height: 100%;
    width: 100%;
}

:deep(.app-follower-following-tabs>.el-tabs__content) {
    height: 100%;
}
:deep(.app-follower-following-tabs>.el-tabs__content>.el-tab-pane) {
    height: 100%;
    width: 100%;
}
.app-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    text-align: left;
}

.app-container .app-container-header {
    height: 60px;
    margin: 20px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.app-container .app-container-header-title {
    font-size: 30px;
    font-weight: bold;
}
.app-container .app-container-header-search-input {
    width: 300px;
    margin-left: 50px;
}
.app-container .app-container-content {
    height: calc(100% - 100px);
    width: 100%;
    overflow-y: auto;
}
.app-container .el-pagination {
    justify-content: center
}
</style>
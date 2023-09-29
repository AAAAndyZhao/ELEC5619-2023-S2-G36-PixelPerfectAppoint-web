<template>
    <el-container id="app-user-profile-container">
        <el-tabs v-model="activeTab" class="app-user-profile-tabs" @tab-click="handleClick" stretch>
            <el-tab-pane label="Information" name="information">Information</el-tab-pane>
            <el-tab-pane label="Follower/Following" name="follower" lazy>
                <UserFollowingView/>
            </el-tab-pane>
            <el-tab-pane label="Posts" name="posts" lazy>
                <UserPostsView/>
            </el-tab-pane>
            <el-tab-pane label="Portfolio/Photos" name="portfolio" lazy>
                <PortfolioPhoto/>
            </el-tab-pane>
            <el-tab-pane label="Reviews" name="fifth" lazy>Reviews</el-tab-pane>
        </el-tabs>
    </el-container>
</template>

<script setup>
import { ref } from 'vue';
import UserFollowingView from '@/views/user/user-following-follower/index.vue';
import UserPostsView from '@/views/user/user-post/index.vue';

const activeTab = ref('posts');
const handleClick = (tab) => {
    activeTab.value = tab.name;
};

</script>

<style scoped>
#app-user-profile-container {
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.app-user-profile-tabs {
    height: 100%;
    width: 100%;
}

:deep(.app-user-profile-tabs>.el-tabs__content) {
    height: calc(100% - 40px);
    width: 100%;
}
:deep(.app-user-profile-tabs>.el-tabs__content>.el-tab-pane) {
    height: 100%;
    width: 100%;
}
</style>
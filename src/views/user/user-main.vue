<template>
    <el-container id="app-user-profile-container">
        <el-tabs v-model="activeName" class="user-profile-tabs" @tab-click="handleClick" stretch>
            <el-tab-pane label="Information" name="information">Information</el-tab-pane>
            <el-tab-pane label="Follower/Following" name="follower">Follower/Following</el-tab-pane>
            <el-tab-pane label="Posts" name="posts">Posts</el-tab-pane>
            <el-tab-pane label="Portfolio/Photos" name="portfolio">
                <PortfolioPhoto/>
            </el-tab-pane>
            <el-tab-pane label="Reviews" name="fifth">Reviews</el-tab-pane>
        </el-tabs>
    </el-container>
</template>

<script>
import { ref } from 'vue';
import PortfolioPhoto from '@/pages/photo/profile-portfolio-photo.vue';

export default {
    components: {
        PortfolioPhoto,
    },
    setup() {
        const activeTab= ref('information');
        const handleClick = (tab) => {
            activeTab.value = tab.name;
        };
        return {
            activeTab,
            handleClick,
        };

    },
};
</script>

<style scoped>
#app-user-profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
}

.user-profile-tabs {
    width: 100%;
}
</style>
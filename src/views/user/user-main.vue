<template>
    <el-container id="app-user-profile-container">
        <el-tabs v-model="activeTab" class="app-user-profile-tabs" @tab-change="handleTabChange" stretch>
            <el-tab-pane label="Information" name="information">
                <UserInformationView/>
            </el-tab-pane>
            <el-tab-pane label="Follower/Following" name="follower" lazy>
                <UserFollowingView />
            </el-tab-pane>
            <el-tab-pane label="Posts" name="posts" lazy>
                <UserPostsView />
            </el-tab-pane>
            <el-tab-pane label="Portfolio/Photos" name="portfolio" lazy>
                <UserPortfolioPhotoView />
            </el-tab-pane>
            <el-tab-pane label="Appointment" name="appointment" lazy>
                <UserAppointmentView />
            </el-tab-pane>
            <el-tab-pane label="Reviews" name="review" lazy>
                <UserReviewsView />
            </el-tab-pane>
        </el-tabs>
    </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UserInformationView from '@/views/user/user-information/index.vue';
import UserFollowingView from '@/views/user/user-following-follower/index.vue';
import UserPostsView from '@/views/user/user-post/index.vue';
import UserAppointmentView from '@/views/user/user-appointment/index.vue';
import UserPortfolioPhotoView from '@/views/user/user-portfolio-photo/index.vue';
import UserReviewsView from '@/views/user/user-reviews/index.vue';
import router from '@/router.js';


const activeTab = ref('information');
const handleTabChange = (name) => {
    activeTab.value = name;
    // change query string
    router.push({ query: { tab: name } });
};

const changeTabByRoute = () => {
    const tab = router.currentRoute.value.query.tab;
    if (tab === undefined || tab === null || tab === '') {
        activeTab.value = 'information';
    } else {
        activeTab.value = tab;
    }
};

onMounted(async () => {
    changeTabByRoute();
});

</script>

<style scoped>
#app-user-profile-container {
    height: calc(100vh - 100px);
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
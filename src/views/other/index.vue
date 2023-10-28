<template>
    <div class="app-other">
        <div :class="userAvatarBackgroundClass" class="app-other-basic-info">
            <user-avatar :user="userInfo" :size="200"></user-avatar>
            <div class="app-user-follower-count">
                <el-text size="large" type="primary" tag="b">{{ shortenFollowerNumber }}</el-text>
                <el-text>{{ shortenFollowerNumber > 1 ? 'followers' : 'follower' }}</el-text>
            </div>
            <user-follow-operation class="app-user-follow-operation" :user-id="userInfo?.id"
                :is-following="userFollowStatus.following" :is-followed="userFollowStatus.followed"
                :follower-count="userFollowStatus.targetUserFollowerCount" @follow-user="handleFollowUser"
                @unfollow-user="handleUnfollowUser"></user-follow-operation>
        </div>
        <el-divider></el-divider>
        <el-tabs v-model="activeTab" class="app-user-profile-tabs" stretch>
            <el-tab-pane label="Information" name="information"></el-tab-pane>
            <el-tab-pane label="Posts" name="post"></el-tab-pane>
            <el-tab-pane label="Portfolios" name="portfolio"></el-tab-pane>
            <el-tab-pane label="Photos" name="photo"></el-tab-pane>
            <el-tab-pane label="Reviews" name="reviews"></el-tab-pane>
        </el-tabs>
        <div class="app-tab-content">
            <div v-show="activeTab === 'information'" class="app-tab-content-item">
                <other-information :user="userInfo"></other-information>
            </div>
            <div v-show="activeTab === 'post'" class="app-tab-content-item">
                <user-posts-list :data="userPosts.data" class="app-other-posts"></user-posts-list>
                <el-pagination layout="prev, pager, next" :total="userPosts.total" :current-page="userPosts.page"
                    :page-size="userPosts.size" @update:current-page="userPosts.handleCurrentPageChange" />
            </div>
            <div v-show="activeTab === 'portfolio'" class="app-tab-content-item">
                <UserPortfolioList :data="userPortfolio.data" class="app-other-portfolio" :ownerId="userPortfolio.ownerId"></UserPortfolioList>
                <div class="app-profile-portfolio-pagination-bar">
                    <el-pagination layout="prev, pager, next" :total="userPortfolio.total"
                        :current-page="userPortfolio.currentPage" :page-size="userPortfolio.size"
                        @current-change="handleCurrentChange" />
                </div>
            </div>
            <div v-if="activeTab === 'photo'" class="app-tab-content-item">
                <other-photos :data="userPhotos.data"></other-photos>
                <el-pagination layout="prev, pager, next" :total="userPhotos.total" :current-page="userPhotos.currentPage"
                    :page-size="userPhotos.pageSize" @update:current-page="userPhotos.handleCurrentPageChange" />
            </div>
            <div v-if="activeTab === 'reviews'" class="app-tab-content-item">
                <OtherReviews :userId="props.userId"></OtherReviews>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import UserAvatar from '@/components/user/user-avatar.vue';
import UserInfoDetail from '@/components/user/user-info-detail.vue';
import userApi from '@/services/user-api';
import postApi from '@/services/post-api';
import photoApi from '@/services/photo-api'
import OtherInformation from './other-information.vue';
import UserPostsList from '@/views/user/user-post/posts-list.vue';
import OtherPhotos from './other-photos.vue';
import UserFollowOperation from '@/components/user/user-follow-operation.vue';
import UserPortfolioList from '@/views/user/user-portfolio-photo/user-portfolio-list.vue';
import OtherReviews from './other-reviews.vue';
import portfolioApi from '@/services/portfolio-api';

const props = defineProps({
    userId: {
        type: String,
        required: true,
    }
})
const possibleBackgrounds = ['linear-background', 'radial-background', 'checkerboard-background'];
const userAvatarBackgroundClass = ref('app-user-avatar-background');
const randomBackground = () => {
    const index = Math.floor(Math.random() * possibleBackgrounds.length);
    userAvatarBackgroundClass.value = `app-user-avatar-background ${possibleBackgrounds[index]}`;
}
const currentUserId = localStorage.getItem('userId');
const userInfo = ref({});
const userFollowStatus = ref({});
const userPosts = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    data: [],
    handleCurrentPageChange: (page) => {
        userPosts.value.currentPage = page;
        fetchUserPosts();
    }
});
const userPhotos = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    data: [],
    handleCurrentPageChange: (page) => {
        console.log(page)
        userPhotos.value.currentPage = page;
        fetchUserPhotos();
    }
})
const activeTab = ref('information');
const shortenFollowerNumber = computed(() => {
    console.log(userFollowStatus.value.targetUserFollowerCount)
    return $FUNC.shortenNumber(userInfo.value.followerCount);
})
const userPortfolio = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    data: [],
    ownerId: "This Guy",
    handleCurrentPageChange: (page) => {
        userPortfolio.value.currentPage = page;
        fetchUserPortfolio();
    }
})

const fetchUserInfo = async () => {
    try {
        const res = await userApi.getUserInformation(props.userId);
        if (res.code === 0 && res.data.length > 0) {
            userInfo.value = res.data[0];
            // if has current login user
            if (currentUserId) {
                const res = await userApi.getUserFollowStatus(props.userId);
                if (res.code === 0 && res.data.length > 0) {
                    userFollowStatus.value = res.data[0];
                } else {
                    userFollowStatus.value = {
                        isFollowing: false,
                        isFollowed: false,
                        targetUserFollowerCount: 0
                    }
                }
            }
        } else {
            ElMessage.error('Failed to get user information: ' + res.msg || 'Unknown error');
        }
    } catch (err) {
        console.error(err);
        ElMessage.error('Failed to get user information: ' + err.message || 'Unknown error');
    }
}

const fetchUserPosts = async () => {
    try {
        const res = await postApi.getUserPosts(
            userPosts.value.currentPage,
            userPosts.value.pageSize,
            {
                sortedBy: 'latest',
                sortedType: 'desc',
            },
            props.userId
        )
        if (res.code === 0) {
            userPosts.value.data = res.data;
            userPosts.value.total = res.totalCount;
        } else {
            ElMessage.error('Failed to get user posts: ' + res.msg || 'Unknown error');
        }
    } catch (err) {
        console.error(err);
        ElMessage.error('Failed to get user posts: ' + err.message || 'Unknown error');
    }
}

const fetchUserPhotos = async () => {
    try {
        const res = await photoApi.getPublicPhotoByOwnerId({
            ownerId: props.userId,
            page: userPhotos.value.currentPage,
            size: userPhotos.value.pageSize,
            sortedBy: 'latest',
            order: 'desc'
        })
        if (res.code === 0) {
            userPhotos.value.data = res.data;
            userPhotos.value.total = res.totalCount;
        } else {
            ElMessage.error('Failed to get user photos: ' + res.msg || 'Unknown error');
        }
    } catch (err) {
        console.error(err);
        ElMessage.error('Failed to get user photos: ' + err.message || 'Unknown error');
    }
}

const fetchUserPortfolio = async () => {
    try {
        const userId = props.userId;
        const page = userPortfolio.value.currentPage;
        const size = userPortfolio.value.pageSize;
        const res = await portfolioApi.getUserPortfolio(userId, null, page, size)
        if (res.code === 0) {
            userPortfolio.value.data = res.data;
            userPortfolio.value.total = res.totalCount;
            if(res.data.length > 0) {
                userPortfolio.value.ownerId = res.data[0].owner.id;
            } else {
                userPortfolio.value.ownerId = " ";
            }
        } else {
            ElMessage.error('Failed to get user portfolio: ' + res.msg || 'Unknown error');
        }
    } catch (err) {
        console.error(err);
        ElMessage.error('Failed to get user portfolio: ' + err.message || 'Unknown error');
    }
}

const handleFollowUser = async () => {
    if (!localStorage.getItem('token')) {
        ElMessage.error('Please login first');
        return;
    }
    try {
        const res = await userApi.followUser(props.userId);
        if (res.code === 0) {
            ElMessage.success('Follow user successfully');
            fetchUserInfo();
        } else {
            ElMessage.error('Failed to follow user: ' + res.msg || 'Unknown error');
        }

    } catch (err) {
        console.error(err);
        ElMessage.error('Failed to follow user: ' + err.message || 'Unknown error');
    }
}
const handleUnfollowUser = async () => {
    if (!localStorage.getItem('token')) {
        ElMessage.error('Please login first');
        return;
    }
    try {
        const res = await userApi.unfollowUser(props.userId);
        if (res.code === 0) {
            ElMessage.success('Unfollow user successfully');
            fetchUserInfo();
        } else {
            ElMessage.error('Failed to unfollow user: ' + res.msg || 'Unknown error');
        }
    } catch (err) {
        console.error(err);
        ElMessage.error('Failed to unfollow user: ' + err.message || 'Unknown error');
    }
}
const handleCurrentChange = (page) => {
    userPortfolio.value.currentPage = page;
    fetchUserPortfolio();
}
onMounted(() => {
    fetchUserInfo();
    fetchUserPosts();
    fetchUserPhotos();
    fetchUserPortfolio();
    randomBackground();
})
</script>

<style scoped>
.app-other {
    width: 100%;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.app-other-basic-info {
    padding-top: 10px;
    padding-bottom: 10px;
}

.app-user-avatar-background {
    width: 100%;
    height: 20%;
    min-height: 240px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
}

.app-user-avatar-background .app-user-follower-count {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
}

.app-user-follow-operation {
    position: absolute;
    right: 5vw;
}

.app-user-avatar-background.linear-background {
    background: repeating-linear-gradient(45deg,
            #f7f7f7,
            #f7f7f7 10px,
            #e0e0e0 10px,
            #e0e0e0 20px);
}

.app-user-avatar-background.radial-background {
    background: repeating-radial-gradient(circle at 1px 1px,
            #e0e0e0,
            #e0e0e0 1px,
            #f7f7f7 1px,
            #f7f7f7 10px);
}

.app-user-avatar-background.checkerboard-background {
    background:
        linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0),
        linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
}

.app-user-profile-tabs {
    width: 60vw;
    min-width: 600px;
}

.app-tab-content {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
}



.app-other-portfolio,
.app-other-posts {
    min-height: calc(100vh - 300px);
}

.app-tab-content>.app-tab-content-item {
    width: 100%;
    min-height: 800px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.el-pagination {
    margin-top: 20px;
    justify-content: center
}

.app-profile-portfolio-pagination-bar {
    margin: 10px 0;
}
</style>
<template>
    <div class="app-user-info-container">
        <user-avatar :user="user" :size="70"></user-avatar>
        <div class="app-user-info-detail">
            <div class="app-user-alias">
                <el-link :underline="false">{{ user?.alias }}</el-link>
                <el-link v-if="showMessageButton && !isSelf" class="app-message-button" icon="ChatDotSquare" @click="sendMessage">message</el-link>
            </div>
            <div class="app-user-name">
                <el-text>@{{ user?.userName }}</el-text>
            </div>
        </div>
        <user-follow-operation
            v-if="showFollowOption && !isSelf"
            :user-id="user?.id"
            :is-following="userFollowingRelationship.following"
            :is-followed="userFollowingRelationship.followed"
            :follower-count="userFollowingRelationship.targetUserFollowerCount"
            @follow-user="followUser"
            @unfollow-user="unfollowUser" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import PhotoImage from '@/components/photo/photo-image.vue';
import UserFollowOperation from '@/components/user/user-follow-operation.vue';
import userApi from '@/services/user-api';
import UserAvatar from '@/components/user/user-avatar.vue';

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    showMessageButton: {
        type: Boolean,
        required: false,
        default: true
    },
    showFollowOption: {
        type: Boolean,
        required: false,
        default: true
    }
})
const userFollowingRelationship = ref({
    following: false,
    followed: false,
    targetUserFollowerCount: 0
})

const isSelf = computed(() => {
    return localStorage.getItem('userId') === props.user?.id;
})

const getUserFollowingRelationship = async () => {
    if (!props.user?.id){
        return
    }
    if (!localStorage.getItem('token') || !localStorage.getItem('userId')){
        return
    }
    try{
        const res = await userApi.getUserFollowStatus(props.user.id)
        if (res.code === 0 && res.data.length > 0){
            userFollowingRelationship.value = res.data[0]
        }else{
            userFollowingRelationship.value = {
                isFollowing: false,
                isFollowed: false,
                followerCount: 0
            }
        }
    }catch(error){
        console.error(error)
    }finally{
    }
}

const followUser = async (userId) => {
    const loading = ElLoading.service({
        fullscreen: true,
    })
    try{
        const res = await userApi.followUser(userId)
        if (res.code === 0){
            ElMessage.success('Follow successfully!')
        }else{
            ElMessage.error(`Follow failed: ${res.msg}`)
        }
    }catch(error){
        console.error(error)
        ElMessage.error(`Follow failed: ${error.message}`)
    }finally{
        getUserFollowingRelationship()
        setTimeout(() => {
            loading.close()
        }, 1000)
    }
}

const unfollowUser = async (userId) => {
    const loading = ElLoading.service({
        fullscreen: true,
    })
    try{
        const res = await userApi.unfollowUser(userId)
        if (res.code === 0){
            ElMessage.success('Unfollowed!')
        }else{
            ElMessage.error(`Unfollow failed: ${res.msg}`)
        }
    }catch(error){
        console.error(error)
        ElMessage.error(`Unfollow failed: ${error.message}`)
    }finally{
        getUserFollowingRelationship()
        setTimeout(() => {
            loading.close()
        }, 1000)
    }
}

const sendMessage = () => {
    ElMessage.info('Not implemented yet')
}

watch(() => props.user, () => {
    getUserFollowingRelationship()
})

onMounted(() => {
    getUserFollowingRelationship()
})
</script>

<style scoped>
.app-user-info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.app-user-info-detail {
    margin-left: 12px;
    flex: 1;
    overflow: auto;
}

.app-user-alias {
    display: flex;
    align-items: center;
}

.app-message-button{
    margin-left: 10px;
}

.app-user-name {
    text-align: left;
}
</style>
<template>
    <el-card class="app-user-card" body-class="app-user-card-body">
        <div class="app-user-card-avatar" >
            <UserAvatar :user="user" :size="60" />
        </div>
        <div class="app-user-card-info">
            <div v-if="display.includes('alias')" class="app-user-alias" @click="goToOtherProfile(user.id)">{{ user.alias }}</div>
            <div v-if="display.includes('userName')" class="app-user-username">@{{ user.userName }}</div>
        </div>
        <div v-if="display.includes('description')" class="app-user-card-introduction" ref="descRef">
            <div v-if="hasEnoughDescSpace" class="app-user-introduction">{{ user.description ? shortenText(user.description, 200) : 'This user is too lazy to leave a introduction.' }}</div>
        </div>
        <div v-if="display.includes('followerCount')" class="app-user-follower-count">
            <span class="app-user-follower-count-number">{{ shortenFollowerCount(user.followerCount) }}</span>
            <span class="app-user-follower-count-text">Followers</span>
        </div>
        <div class="app-user-card-operation">
            <slot name="default">
                <el-button type="primary" size="small" @click="goToOtherProfile(user.id)">View Profile</el-button>
                <el-button type="primary" size="small" @click="sendMessage(user.id)">Message</el-button>
            </slot>
        </div>
    </el-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import UserAvatar from '@/components/user/user-avatar.vue';
import router from '@/router';
defineProps({
    user: {
        type: Object,
        required: false,
        default: () => {
            return {
                id: 'unknown',
                alias: 'unknown',
                userName: 'unknown',
                description: 'unknown',
                followerCount: 0,
                avatar: '',
                professional: 0
            }
        }
    },
    display: {
        type: Array,
        required: false,
        default: () => {
            return ['alias', 'userName', 'description', 'followerCount'];
        }
    }
})
const descRef = ref(null);

const hasEnoughDescSpace = computed(() => {
    // get the width of the descRef
    if (descRef.value) {
        console.log(descRef.value.offsetWidth);
        return descRef.value.offsetWidth > 100;
    }
    return false;
})

const shortenText = (text, length) => {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

const shortenFollowerCount = (count) => {
    return $FUNC.shortenNumber(count);
}

const goToOtherProfile = (userId) => {
    router.push('/other/' + userId);
}

const sendMessage = (userId) => {
    router.push({ path: '/message', query: { to: userId } })
}
</script>

<style scoped>
.app-user-card {
    width: 100%;
    height: 120px;
    box-sizing: border-box;
    background-color: var(--el-card-background-color, #fff);
    margin-bottom: 20px;
}
:deep(.app-user-card-body) {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
}
.app-user-card-avatar {
    aspect-ratio: 1 / 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.app-user-card-avatar img,
.app-user-card-avatar .el-icon,
.app-user-card-avatar .el-icon svg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.app-user-card-info {
    width: 300px;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px;
}
.app-user-card-introduction {
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    color: #999;
    overflow: hidden;
}
.app-user-follower-count{
    width: 150px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .app-user-follower-count-number{
        font-size: 16px;
        font-weight: bold;
        font-style: italic;
        margin-right: 5px;
    }
    .app-user-follower-count-text{
        font-size: 12px;
        font-style: italic;
    }
}
.app-user-card-operation {
    min-width: 0;
    width: auto;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
}
.app-user-alias {
    font-size: 20px;
    font-weight: bold;
}
.app-use-name {
    font-size: 15px;
    font-weight: bold;
}
.app-user-introduction {
    font-size: 15px;
}

</style>
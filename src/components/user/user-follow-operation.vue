<template>
    <el-dropdown v-if="isFollowing && isFollowed && !isSelf">
        <el-button
        class="app-mutual-followed-button"
        readonly
        size="large"
        :icon="Switch">Mutual followed</el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="handleUnfollowButtonClick(user)"
                class="app-unfollow-dropdown-item">
                    <el-icon><Close /></el-icon>Unfollow
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <el-dropdown v-else-if="isFollowing">
        <el-button
        class="app-followed-button"
        readonly
        size="large">Followed</el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="handleUnfollowButtonClick(userId)"
                class="app-unfollow-dropdown-item">
                    <el-icon><Close /></el-icon>Unfollow
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <el-button v-else v-if="!isSelf" type="primary" @click="handleFollowButtonClick(userId)" size="large">Follow</el-button>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Switch } from '@element-plus/icons-vue';

const emits = defineEmits(['follow-user', 'unfollow-user']);

const props = defineProps({
    userId: {
        type: String,
        required: false,
        default: ''
    },
    isFollowing: {
        type: Boolean,
        required: false,
        default: false
    },
    isFollowed: {
        type: Boolean,
        required: false,
        default: false
    },
    followerCount: {
        type: Number,
        required: false,
        default: 0
    },
})

const isSelf = computed(() => {
    return localStorage.getItem('userId') === props.userId;
})

const handleUnfollowButtonClick = (userId) => {
    emits('unfollow-user', userId);
}

const handleFollowButtonClick = (userId) => {
    emits('follow-user', userId);
}

</script>

<style scoped>
.app-mutual-followed-button,
.app-followed-button,
:deep(.app-unfollow-dropdown-item){
    box-sizing: border-box;
    width: 150px;
}
</style>
<template>
    <div class="app-user-followings-list">
        <UserCard v-for="user in data" :key="user.id" :user="user" v-if="hasData">
            <el-dropdown v-if="user.following && user.followed">
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
            <el-button v-else @click="handleUnfollowButtonClick(user)" size="large">Unfollow</el-button>
        </UserCard>
        <div v-else class="app-no-data-text">
            No followings found
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Empty, Switch, Close } from '@icon-park/vue-next';
import UserCard from '@/components/user/user-card.vue';
const props = defineProps({
    data: {
        type: Array,
        required: false,
        default: () => []
    }
})
const emits = defineEmits(['followUser', 'unfollowUser']);
const hasData = computed(() => {
    return props.data && props.data.length > 0;
})
const handleUnfollowButtonClick = (user) => {
    emits('unfollowUser', user);
}
const handleFollowButtonClick = (user) => {
    emits('followUser', user);
}
</script>

<style scoped>
.app-user-followings-list {
    min-height: calc(100% - 60px);
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px 0 0;
    text-align: left;
}
.app-no-data-text{
    font-size: 16px;
    color: #999;
    text-align: center;
    margin-top: 20px;
}
</style>
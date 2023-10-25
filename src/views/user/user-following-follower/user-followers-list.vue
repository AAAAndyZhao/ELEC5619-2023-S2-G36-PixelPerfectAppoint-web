<template>
    <div class="app-user-followers-list">
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
            <el-button v-else type="primary" @click="handleFollowButtonClick(user)" size="large">Follow Back</el-button>
        </UserCard>
        <div v-else class="app-no-data-text">
            No followers found
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Empty, Switch, Close } from '@icon-park/vue-next';
import UserCard from '@/components/user/user-card.vue';
import { ElMessage } from 'element-plus';
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
const handleFollowButtonClick = (user) => {
    emits('followUser', user);
}

const handleUnfollowButtonClick = (user) => {
    emits('unfollowUser', user);
}
</script>

<style scoped>
.app-user-followers-list {
    /* min-height: calc(100% - 60px); */
    min-height: 600px;
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
.app-mutual-followed-button,
:deep(.app-unfollow-dropdown-item) {
    width: 160px;
}
:deep(.app-unfollow-dropdown-item) {
    width: 160px;
    justify-content: center;
    padding: 7px 19px;
    box-sizing: border-box;
    height: 30px;
}
</style>
<template>
    <div class="app-user-followers-list">
        <UserCard v-for="user in data" :key="user.id" :user="user" v-if="hasData">
            <el-button @click="handleUnfollowButtonClick(user.id)" size="large">Unfollow</el-button>
        </UserCard>
        <div v-else class="app-no-data-text">
            No followers found
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Empty } from '@icon-park/vue-next';
import UserCard from '@/components/user/user-card.vue';
const props = defineProps({
    data: {
        type: Array,
        required: false,
        default: () => []
    }
})
const hasData = computed(() => {
    return props.data && props.data.length > 0;
})
const handleUnfollowButtonClick = (userId) => {
    console.log(userId);
}
</script>

<style scoped>
.app-user-followers-list {
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
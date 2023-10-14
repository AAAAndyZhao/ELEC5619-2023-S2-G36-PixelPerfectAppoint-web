<template>
    <div class="app-user-search-list">
        <UserCard v-for="user in data" :key="user.id" :user="user" v-if="hasData">
        </UserCard>
        <div v-else class="app-no-data-text">
            No user found
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

const hasData = computed(() => {
    return props.data && props.data.length > 0;
})
</script>

<style scoped>
.app-user-search-list {
    min-height: calc(100vh - 340px);
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
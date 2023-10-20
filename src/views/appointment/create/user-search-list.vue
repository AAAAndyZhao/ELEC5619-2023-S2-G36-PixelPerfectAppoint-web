<template>
    <div class="app-user-search-list">
        <UserCard v-for="user in data" :key="user.id" :user="user" v-if="hasData">
            <el-button v-if="selectedUsers.map(item => item.id).indexOf(user.id) > -1" disabled>Selected</el-button>
            <el-button v-else type="primary" @click="handleAddButtonClick(user)" size="large">Add</el-button>
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
    },
    selectedUsers: {
        type: Array,
        required: false,
        default: () => []
    }
})
const emits = defineEmits(['addUser']);

const hasData = computed(() => {
    return props.data && props.data.length > 0;
})
const handleAddButtonClick = (user) => {
    emits('addUser', user);
}
</script>

<style scoped>
.app-user-search-list {
    min-height: calc(100% - 60px);
    width: 100%;
    box-sizing: border-box;
    padding: 0 0 0 0;
    text-align: left;
}
.app-no-data-text{
    font-size: 16px;
    color: #999;
    text-align: center;
    margin-top: 20px;
}
</style>
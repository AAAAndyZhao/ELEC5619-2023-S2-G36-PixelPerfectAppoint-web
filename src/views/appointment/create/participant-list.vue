<template>
    <div class="app-user-search-list">
        <UserCard v-for="user in selectedUsers" :key="user.id" :user="user" v-if="hasData">
            <el-button type="primary" @click="handleAddButtonClick(user)" size="large">Remove</el-button>
        </UserCard>
        <div v-else class="app-no-data-text">
            No Participants
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Empty, Switch, Close } from '@icon-park/vue-next';
import UserCard from '@/components/user/user-card.vue';
import { ElMessage } from 'element-plus';
const props = defineProps({
    selectedUsers: {
        type: Array,
        required: false,
        default: () => []
    }
})
const emits = defineEmits(['removeUser']);

const hasData = computed(() => {
    return props.selectedUsers && props.selectedUsers.length > 0;
})
const handleAddButtonClick = (user) => {
    emits('removeUser', user);
}
</script>

<style scoped>
.app-user-search-list {
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
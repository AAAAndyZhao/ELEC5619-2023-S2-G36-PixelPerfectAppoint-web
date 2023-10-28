<template>
    <el-avatar class="app-user-avatar" :size="size" :src="user.avatarUrl" @click="goToOtherProfile(user.id)">
        <el-avatar :size="size" :style="{fontSize: `${size / 3}px`}">{{ nameAbbreviation }}</el-avatar>
    </el-avatar>
</template>

<script setup>
import { ref, computed } from 'vue';
import router from '@/router';
const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    size: {
        type: Number,
        default: 40
    }
})
const nameAbbreviation = computed(() => {
    if (props.user && props.user.alias) {
        // Uppercase the first letter of the alias
        return props.user.alias.charAt(0).toUpperCase();
    }
    return '';
})

const goToOtherProfile = (userId) => {
    router.push('/other/' + userId);
}
</script>

<style scoped>
.app-user-avatar {
    cursor: pointer;
}
</style>
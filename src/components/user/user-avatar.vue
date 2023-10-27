<template>
    <el-avatar class="app-user-avatar" :size="size" :src="user.avatarUrl">
        <el-avatar :size="size" :style="{fontSize: `${size / 3}px`}">{{ nameAbbreviation }}</el-avatar>
    </el-avatar>
</template>

<script setup>
import { ref, computed } from 'vue';
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
</script>

<style scoped>
</style>
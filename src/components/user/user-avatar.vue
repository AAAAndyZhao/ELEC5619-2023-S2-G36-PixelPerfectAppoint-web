<template>
    <el-avatar :size="size" :src="user.avatarUrl">
        <el-avatar :size="size">{{ nameAbbreviation }}</el-avatar>
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
    if (props.user && props.user.firstName && props.user.lastName) {
        return props.user.firstName[0] + props.user.lastName[0];
    }
    return '';
})
</script>
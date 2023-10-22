<template>
    <div class="app-posts-list">
        <PostCard v-for="post in data" :key="post.id" :post="post" v-if="hasData"
        :display="['title', 'text', 'updateDatetime', 'likes', 'operation']">
            <el-button size="small" @click="handleEdit(post)">
                Edit
            </el-button>
            <el-button type="danger" size="small" @click="handleRemove(post)">
                Remove
            </el-button>
        </PostCard>
        <div v-else class="app-no-data-text">
            No posts found
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Empty } from '@icon-park/vue-next';
import PostCard from '@/components/post/post-card.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const emits = defineEmits(['remove', 'edit']);

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

const handleRemove = (post) => {
    ElMessageBox.confirm(
        `Are you sure to delete this post?`,
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    ).then(() => {
        emits('remove', post.id);
    }).catch(() => {
        // do nothing
    });
}
const handleEdit = (post) => {
    emits('edit', post.id);
}
</script>

<style scoped>
.app-posts-list {
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
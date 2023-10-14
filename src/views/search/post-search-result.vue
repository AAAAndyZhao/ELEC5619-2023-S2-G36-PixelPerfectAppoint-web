<template>
    <div class="app-post-search-list">
        <PostCard v-for="post in data" :key="post.id" :post="post" v-if="hasData"
        :display="['title', 'text', 'updateDatetime', 'author', 'likes']">
        </PostCard>
        <div v-else class="app-no-data-text">
            No post found
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import PostCard from '@/components/post/post-card.vue';
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
.app-post-search-list {
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
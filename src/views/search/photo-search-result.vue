<template>
    <div class="app-photo-search-list">
        <PhotoCard v-for="photo in data" :key="photo.id" :photo="photo" v-if="hasData"
        :display="['title', 'text', 'updateDatetime', 'author', 'likes']">
        </PhotoCard>
        <div v-else class="app-no-data-text">
            No photo found
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import PhotoCard from '@/components/photo/photo-card.vue';
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
.app-photo-search-list {
    min-height: calc(100vh - 340px);
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px 0 0;
    text-align: left;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 5px;
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
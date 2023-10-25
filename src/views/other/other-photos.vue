<template>
    <div ref="containerRef" class="app-photos-container">
        <PhotoCard v-for="photo in data" :key="photo.id" :photo="photo" v-if="hasData"
            :display="['title', 'text', 'updateDatetime', 'author', 'likes']">
        </PhotoCard>
        <div v-else class="app-no-data-text">
            No photo found
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick, watchEffect } from 'vue';
import PhotoCard from '@/components/photo/photo-card.vue';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

const props = defineProps({
    data: {
        type: Array,
        required: false,
        default: () => []
    }
})
const containerRef = ref(null);
let msnry;
const hasData = computed(() => {
    return props.data && props.data.length > 0;
})
const doMasonryLayout = () => {
    if (msnry) {
        msnry.reloadItems();
        msnry.layout();
        console.log('layout reloaded')
        return;
    }
    msnry = new Masonry(containerRef.value, {
        itemSelector: '.app-photo-card',
        columnWidth: '.app-photo-card',
        horizontalOrder: true,
        gutter: 20,
    });
    console.log('layout created')
}
watch(() => props.data, () => {
    if (containerRef.value) {
        imagesLoaded(containerRef.value, doMasonryLayout);
    }
})
watchEffect(() => {
    nextTick(() => {
        if (containerRef.value) {
            imagesLoaded(containerRef.value, doMasonryLayout);
        }
    })
})
</script>

<style scoped>
.app-photos-container {
    min-height: 770px;
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
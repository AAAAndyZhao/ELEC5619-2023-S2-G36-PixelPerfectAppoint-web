<template>
    <div class="app-scroll-container" @scroll="handleScroll" ref="scrollbarRef">
        <div id="app-home" ref="photoContainerRef">
            <photo-card v-for="photo in photos"
            :key="photo.id" :photo="photo" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ElMessage } from 'element-plus';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import photoApi from '@/services/photo-api';
import PhotoCard from '@/components/photo/photo-card.vue';

const scrollbarRef = ref(null);
const photoContainerRef = ref(null);
const photos = ref([]);
const allPhotosLoaded = ref(false);
const isLoadingMore = ref(false);
const pageProps = ref({
    page: 1,
    size: 20
});
let msnry;

const doMasonryLayout = () => {
    if (msnry) {
        msnry.reloadItems();
        msnry.layout();
        console.log('layout reloaded')
    }else {
        msnry = new Masonry(photoContainerRef.value, {
            itemSelector: '.app-photo-card',
            columnWidth: '.app-photo-card',
            horizontalOrder: true,
            gutter: 20,
        });
    }
    setTimeout(() => {
        isLoadingMore.value = false;
    }, 1000);
}

const fetchPhotos = async () => {
    const res = await photoApi.searchPhotos(
        null,
        pageProps.value.page,
        pageProps.value.size,
        $PUBLIC.INF_INT,
        'latest',
        'desc',
    );
    if (res.code === 0) {
        photos.value.push(...res.data);
        if (res.data.length < pageProps.value.size) {
            allPhotosLoaded.value = true;
            ElMessage.info('All photos loaded');
        }
    } else {
        ElMessage.error(res.msg)
    }
};
const isScrolledToBottom = () => {
    const scrollTop = scrollbarRef.value.scrollTop;
    const clientHeight = scrollbarRef.value.clientHeight;
    const scrollHeight = scrollbarRef.value.scrollHeight;
    return scrollTop + clientHeight >= scrollHeight - 5;  // Allowing a 5-pixel margin for error
}
const loadMore = async () => {
    if (allPhotosLoaded.value || isLoadingMore.value) return;
    isLoadingMore.value = true;
    pageProps.value.page++;
    await fetchPhotos();
    imagesLoaded(photoContainerRef.value, doMasonryLayout);
}
watch(() => photos.value, () => {
    nextTick(() => {
        if (photoContainerRef.value) {
            imagesLoaded(photoContainerRef.value, doMasonryLayout);
        }
    })
})
const handleScroll = () => {
    if (isScrolledToBottom(scrollbarRef.value)) {
        loadMore();
    }
}
onMounted(async () => {
    await fetchPhotos();
    imagesLoaded(photoContainerRef.value, doMasonryLayout);
});
onBeforeUnmount(() => {
    msnry && msnry.destroy();
})
</script>

<style scoped>
.app-scroll-container {
    height: calc(100vh - 100px);
    overflow-y: auto;
}
#app-home {
    min-height: calc(100vh - 100px);
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    font-size: 20px;
    position: relative;
}
</style>
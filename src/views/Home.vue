<template>
    <div id="app-home" ref="photoContainerRef" v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="disabledInfiniteScroll">
        <photo-card v-for="photo in photos"
        :key="photo.id" :photo="photo" />
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ElMessage } from 'element-plus';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import photoApi from '@/services/photo-api';
import PhotoCard from '@/components/photo/photo-card.vue';

const photoContainerRef = ref(null);
const photos = ref([]);
const allPhotosLoaded = ref(false);
const disabledInfiniteScroll = ref(true);
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
        return;
    }
    msnry = new Masonry(photoContainerRef.value, {
        itemSelector: '.app-photo-card',
        columnWidth: '.app-photo-card',
        horizontalOrder: true,
        gutter: 20,
    });
    console.log('layout created')
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
const loadMore = async () => {
    if (allPhotosLoaded.value) return;
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
onMounted(async () => {
    await fetchPhotos();
    imagesLoaded(photoContainerRef.value, doMasonryLayout);
    setTimeout(() => {
        disabledInfiniteScroll.value = false;
    }, 2000);
});
onBeforeUnmount(() => {
    msnry && msnry.destroy();
})
</script>

<style scoped>
#app-home {
    min-height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    font-size: 20px;
    position: relative;
}
</style>
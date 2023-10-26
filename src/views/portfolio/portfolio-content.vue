<template>
    <div class="app-user-photos-in-portfolio" v-loading="loading">
        <div>
            <el-page-header :icon="ArrowLeft" @click="backToLast">
                <template #content class="photos-in-portfolio-header">
                    <span class="text-large font-600 mr-3"> {{ portfolioData.title }} </span>
                </template>
            </el-page-header>
            <el-divider></el-divider>
            <el-button id="app-user-portfolio-detail-edit-btn" type="primary" @click="goToEditPage">Edit</el-button>
        </div>
        <div class="photos-in-portfolio" ref="photoContainerRef">
            <PhotoImage class="photo-container" v-for="photo in photoList" :src="photo.thumbnailUrl" :key="photo.id"
                :photo="photo" fit="cover" @click="callThePhotoViewer(photo.url, photo.name, ownerInfo, photo.photoParam, photo.id)"
                @load-complete="countImageLoadComplete" />
        </div>
        <PhotoViewer :url="displayedPhotoUrl"
        :visible="photoViewerVisible"
        :photoName="displayedPhotoName"
        :creator="displayedPhotoCreator"
        :displayedPhotoParam="displayedPhotoParam"
        :photoId="displayedPhotoId"
        v-if="photoViewerVisible"
        @closeClick="closePhotoViewer" class="app-profile-portfolio-viewer"/>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick, watchEffect } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import portfolioApi from '@/services/portfolio-api';
import PhotoViewer from "@/components/photo/photo-viewer.vue";
import router from '@/router';
import PhotoImage from '@/components/photo/photo-image.vue';
import photoApi from '@/services/photo-api';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

let msnry;

const photoList = ref([]);
const portfolioData = ref({});
const loading = ref(false);  // <-- Define loading property
const photoViewerVisible = ref(false);
const displayedPhotoUrl = ref('');
const displayedPhotoName = ref('');
const displayedPhotoCreator = ref({});
const ownerInfo = ref({});
const displayedPhotoParam = ref({});
const photoContainerRef = ref(null);
let imageLoadCompleteCount = 0;
const countImageLoadComplete = () => {
    imageLoadCompleteCount++;
    console.log('imageLoadCompleteCount: ' + imageLoadCompleteCount)
    if (imageLoadCompleteCount === photoList.value.length) {
        setTimeout(() => {
            doMasonryLayout();
        }, 500);
    }
}
const fetchPortfolioPhotosByPortfolioId = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    loading.value = true;
    try {
        const response = await portfolioApi.getUserPortfolio(userId, token, 1, 100);
        if (response.code === 0) {
            const fullPath = router.currentRoute.value.path;
            const portfolioIdFromUrl = fullPath.split('/').pop();
            const matchingPortfolio = response.data.find(portfolio => portfolio.id === portfolioIdFromUrl);
            if (matchingPortfolio) {
                photoList.value = matchingPortfolio.photos;
                ownerInfo.value = matchingPortfolio.owner;
                portfolioData.value = matchingPortfolio;
            } else {
                ElMessage.error('Portfolio not found.');
            }
        } else {
            ElMessage.error(response.msg);
        }
    } catch (error) {
        ElMessage.error('Error fetching photos of portfolio.');
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const backToLast = () => {
    router.back();
}

const goToEditPage = () => {
    const portfolioId = router.currentRoute.value.path.split('/').pop();
    router.push({
        path: '../update/' + portfolioId
    });
}

const callThePhotoViewer = (photoUrl, photoName, photoOwner, photoParam, photoId) => {
    displayedPhotoUrl.value = photoUrl;
    displayedPhotoName.value = photoName;
    displayedPhotoCreator.value = photoOwner;
    displayedPhotoParam.value = photoParam;
    displayedPhotoId.value = photoId;
    photoViewerVisible.value = true;
}

const closePhotoViewer = () => {
    photoViewerVisible.value = false;
}

const doMasonryLayout = () => {
    if (msnry) {
        msnry.reloadItems();
        msnry.layout();
        console.log('layout reloaded')
        return;
    }
    msnry = new Masonry(photoContainerRef.value, {
        itemSelector: '.photo-container',
        columnWidth: '.photo-container',
        horizontalOrder: true,
        gutter: 10,
    });
    console.log('layout created')
}

onMounted(() => {
    fetchPortfolioPhotosByPortfolioId();
})

</script>
<style scoped>
.app-user-photos-in-portfolio {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: flex-start;
    align-content: flex-start;
}

.photos-in-portfolio {
    height: 100%;
    width: 100%;
    display: flex;
    gap: 10px;
    flex-direction: row;
    flex-wrap: wrap;
}

.photo-container {
    width: 200px;
}

#app-user-portfolio-detail-edit-btn {
    float: right;
    margin-right: 20px;
}

.app-portfolio-cover-img {
    height: 100%;
    width: 100%;
    object-position: center;
}
:deep(.app-profile-portfolio-viewer .el-image__inner) {
    height: 100vh;
}
</style>
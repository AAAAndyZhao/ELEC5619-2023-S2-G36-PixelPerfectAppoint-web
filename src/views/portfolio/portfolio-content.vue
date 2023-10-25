<template>
    <div class="app-user-photos-in-portfolio" v-loading="loading">
        <div>
            <el-page-header :icon="ArrowLeft" @click="backToLast">
                <template #content class="photos-in-portfolio-header">
                    <span class="text-large font-600 mr-3"> Title </span>
                </template>
            </el-page-header>
            <el-divider></el-divider>
            <el-button id="app-user-portfolio-detail-edit-btn" type="primary" @click="goToEditPage">Edit</el-button>
        </div>
        <div class="photos-in-portfolio">
            <PhotoImage class="photo-container" v-for="photo in portfolioData" :src="photo.thumbnailUrl" :key="photo.id"
                :photo="photo" fit="cover" @click="callThePhotoViewer(photo.url, photo.name, ownerInfo, photo.photoParam)" />
        </div>
        <PhotoViewer :url="displayedPhotoUrl"
        :visible="photoViewerVisible"
        :photoName="displayedPhotoName"
        :creator="displayedPhotoCreator"
        :displayedPhotoParam="displayedPhotoParam"
        v-if="photoViewerVisible"
        @closeClick="closePhotoViewer" class="app-profile-portfolio-viewer"/>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import portfolioApi from '@/services/portfolio-api';
import PhotoViewer from "@/components/photo/photo-viewer.vue";
import router from '@/router';
import PhotoImage from '@/components/photo/photo-image.vue';
import photoApi from '@/services/photo-api';

const portfolioData = ref({
    photos: []
});
const loading = ref(false);  // <-- Define loading property
const photoViewerVisible = ref(false);
const displayedPhotoUrl = ref('');
const displayedPhotoName = ref('');
const displayedPhotoCreator = ref({});
const ownerInfo = ref({});
const ArrowLeft = 'arrow-left';
const displayedPhotoParam = ref({});



const fetchPortfolioPhotosByPortfolioId = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    loading.value = true;
    try {
        const response = await portfolioApi.getUserPortfolio(userId, token, 1, 100); // 假设每页最多100个 portfolio
        console.log('API Response:', response);
        if (response.code === 0) {
            const fullPath = router.currentRoute.value.path;
            const portfolioIdFromUrl = fullPath.split('/').pop();
            const matchingPortfolio = response.data.find(portfolio => portfolio.id === portfolioIdFromUrl);
            console.log('Matching portfolio:', matchingPortfolio);
            if (matchingPortfolio) {
                portfolioData.value = matchingPortfolio.photos; // <-- Set portfolioData
                ownerInfo.value = matchingPortfolio.owner;
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

const callThePhotoViewer = (photoUrl, photoName, photoOwner, photoParam) => {
    displayedPhotoUrl.value = photoUrl;
    displayedPhotoName.value = photoName;
    displayedPhotoCreator.value = photoOwner;
    displayedPhotoParam.value = photoParam;
    // console.log('Photo viewer called.' + photoOwner);
    // await nextTick();
    photoViewerVisible.value = true;
}

const closePhotoViewer = () => {
    photoViewerVisible.value = false;
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
    height: 200px;
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
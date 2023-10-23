<template>
    <div class="app-user-photos-in-portfolio" v-loading="loading">
        <div class="photos-in-portfolio-back-button">
            <el-button class="photos-back-to-portfolio-button" type="text" >
                <el-icon size="medium">
                    <ArrowLeftBold />back to portfolio
                </el-icon>
            </el-button>
        </div>
        <div class="photos-edit-button">
            
        </div>
        <div class="photos-in-portfolio">
            <PhotoImage class="photo-container" v-for="photo in portfolioData" 
                :src="photo.thumbnailUrl" 
                :key="photo.id"
                :photo="photo" fit="cover"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import portfolioApi from '@/services/portfolio-api';
import PhotoView from "@/components/photo/photo-viewer.vue";
import router from '@/router';
import PhotoImage from '@/components/photo/photo-image.vue';

const portfolioData = ref({
    photos: []
});
const loading = ref(false);  // <-- Define loading property


const fetchPortfolioPhotosByPortfolioId = async (userId, token) => {
    loading.value = true;
    try {
        const response = await portfolioApi.getUserPortfolio(userId, token, 1, 100); // 假设每页最多100个 portfolio
        console.log('API Response:', response);
        if (response.code === 0) {
            const fullPath = router.currentRoute.value.path;
            console.log('Full path:', fullPath);
            const portfolioIdFromUrl = fullPath.split('/').pop();
            console.log('Portfolio ID from URL:', portfolioIdFromUrl);
            const matchingPortfolio = response.data.find(portfolio => portfolio.id === portfolioIdFromUrl);
            console.log('Matching portfolio:', matchingPortfolio);
            if (matchingPortfolio) {
                portfolioData.value = matchingPortfolio.photos; // <-- Set portfolioData

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


onMounted(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId) {
        ElMessage.error('Please login first');
        return;
    }
    if (!token) {
        ElMessage.error('Please login first');
        return;
    }
    fetchPortfolioPhotosByPortfolioId(userId, token);

})

</script>
<style scoped>
.app-user-photos-in-portfolio {
    height: 100%;
    width: 100%;
}

.photos-in-portfolio-back-button {
    display: flex;
    box-sizing: border-box;
    background-color: aqua;
}

.photos-in-portfolio {
    height: 100%;
    width: 100%;
    display: flex;
    margin: 5% 0;
    gap: 2%;
    flex-direction: row;
    flex-wrap: wrap;

}

.photo-container {
    height: 200px;
    width: 200px;
}

.app-portfolio-cover-img {
    height: 100%;
    width: 100%;
    object-position: center;
}
</style>
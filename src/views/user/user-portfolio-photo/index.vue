<template>
    <div class="app-user-portfolio-photo" v-loading="loading">
        <el-tabs tab-position="left" class="app-portfolio-photo-tabs">
            <el-tab-pane label="Portfolios">
                <div class="app-followers-container app-container">
                    <div class="app-container-header">
                        <div class="app-container-header-title">My Portfolios</div>
                    </div>
                    <UserPortfolioList :data="portfolioData"  @customClickFromB="updatePortfolioVisibility" @delectPortfolio="delectPortfolio"/>
                    <div>
                        <div class="app-container-content">

                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Photos">
                <div class="app-followings-container app-container">
                    <div class="app-container-header">
                        <div class="app-container-header-title">My Photos</div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Search } from '@icon-park/vue-next';
import { ElMessage, ElMessageBox } from 'element-plus';
import PortfolioCard from '@/components/photo/portfolio-card.vue';
import UserPortfolioList from './user-portfolio-list.vue';
import portfolioApi from '@/services/portfolio-api';
import router from '@/router';

const loading = ref(false);
const portfolioData = ref([]);
const portfolioPageProps = ref({
    currentPage: 1,
    pageSize: 30,
    total: 0,
    handleCurrentPageChange: (page) => {
        portfolioPageProps.currentPage = page;
        fetchPortfolioData();
    }
});
const handleFinalClick = () => {
    emits('customClickFromB');
    router.push({
        path: '../portfolio/photos-in-portfolio'
    });
}
const fetchPortfolioData = async (isReload = false) => {
    loading.value = true;
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
    if (isReload) {
        portfolioPageProps.currentPage = 1;
        portfolioPageProps.pageSize = 30;
    }
    try {
        const res = await portfolioApi.getUserPortfolio(
            userId,
            token,
            portfolioPageProps.value.currentPage,
            portfolioPageProps.value.pageSize,
        );
        if (res.code === 0) {
            portfolioData.value = res.data;
            portfolioPageProps.total = res.totalCount;
        } else {
            ElMessage.error('Failed to get portfolio data');
        }
        console.log(res);
    } catch (err) {
        console.log(err);
        ElMessage.error('Failed to get portfolio data');
    } finally {
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}
const updatePortfolioVisibility = async (portfolioData) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
        ElMessage.error('Please login first');
        return;
    }
    try {
        const response = await portfolioApi.changePortfolioVisibility(
            userId,
            token,
            portfolioData.id,
            portfolioData.hidden,
            true 
        );

        if (response.code === 0) { 
            ElMessage.success('Visibility updated successfully!');
        } else {
            ElMessage.error('Failed to update visibility');
        }
    } catch (err) {
        console.log(err);
        ElMessage.error('Failed to update portfolio visibility');
    }
}

const delectPortfolio = async (portfolioData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        ElMessage.error('Please login first');
        return;
    }
    try {
        const response = await portfolioApi.deletePortfolio(
            portfolioData.id,
            token,
        );
        if (response.code === 0) { 
            ElMessage.success('Portfolio deleted successfully!');
            fetchPortfolioData(true);
        } else {
            ElMessage.error('Failed to delete portfolio');
        }
    } catch (err) {
        console.log(err);
        ElMessage.error('Failed to delete portfolio');
    }
}

onMounted(() => {
    fetchPortfolioData(true);
    const path = router.currentRoute.value.path;
});
</script>

<style scoped>
.app-user-portfolio-photo {
    height: 100%;
    width: 100%;
}

.profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1%;
}

.user-portfolio-photo-switch-tab {
    width: 100%;
}

.app-portfolio-photo-tabs {
    height: 100%;
    width: 100%;
}

:deep(.app-portfolio-photo-tabs>.el-tabs__content) {
    height: 100%;
}

:deep(.app-portfolio-photo-tabs>.el-tabs__content>.el-tab-pane) {
    height: 100%;
    width: 100%;
}

.app-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    text-align: left;
}

.app-container .app-container-header {
    height: 60px;
    margin: 20px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.app-container .app-container-header-title {
    font-size: 30px;
    font-weight: bold;
}

.app-container .app-container-header-search-input {
    width: 300px;
    margin-left: 50px;
}

.app-container .app-container-content {
    height: calc(100% - 100px);
    width: 100%;
    overflow-y: auto;
}

.app-container .el-pagination {
    justify-content: center
}</style>
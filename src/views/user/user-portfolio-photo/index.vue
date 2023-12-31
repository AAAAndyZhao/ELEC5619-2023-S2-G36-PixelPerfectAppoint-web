<template>
    <div class="app-user-portfolio-photo" v-loading="loading">
        <el-tabs tab-position="left" class="app-portfolio-photo-tabs">
            <el-tab-pane label="Portfolios">
                <div class="app-container">
                    <div class="app-container-header">
                        <div class="app-container-header-title">My Portfolios</div>
                        <div class="app-container-header-create-button">
                            <el-button type="primary" @click="handleClickCreate">Create</el-button>
                        </div>
                    </div>
                    <UserPortfolioList :data="portfolioData" @update-portfolio-visibility="updatePortfolioVisibility"
                        @delectPortfolio="delectPortfolio" class="app-portfolio-list" />
                    <el-empty v-if="noAvailablePortfolio" description="No Portfolio Available" :image-size="600"/>
                    <div class="app-profile-portfolio-pagination-bar">
                        <el-pagination layout="prev, pager, next" :total="portfolioPageProps.total"
                            v-model:current-page="portfolioPageProps.currentPage" v-model:page-size="pageSize"
                            @current-change="handleCurrentChange" />
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Photos" lazy>
                <div class="app-container">
                    <div class="app-container-header">
                        <div class="app-container-header-title">My Photos</div>
                        <div class="app-operations">
                            <el-switch v-model="selectMode" active-color="#13ce66"
                                active-text="Select" />
                            <el-button v-if="selectMode" :icon="Delete" type="danger" :disabled="!currentSelectedNum"
                            @click="deletePhotos">
                                Delete{{ currentSelectedNum ? `(${currentSelectedNum})` : ''  }}
                            </el-button>
                            <el-button v-if="selectMode" :icon="Hide" :disabled="!currentSelectedUnhiddenNum"
                            @click="hidePhotos">
                                Hide{{ currentSelectedUnhiddenNum ? `(${currentSelectedUnhiddenNum})` : ''  }}
                            </el-button>
                            <el-button v-if="selectMode" :icon="View" :disabled="!currentSelectedHiddenNum"
                            @click="unhidePhotos">
                                Unhide{{ currentSelectedHiddenNum ? `(${currentSelectedHiddenNum})` : ''  }}
                            </el-button>
                        </div>
                        <div>
                            <el-button type="primary" @click="goToUploadPhoto">Upload
                                <el-icon class="el-icon--right">
                                    <Upload />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>
                    <div class="app-user-photos-display" ref="photoContainerRef">
                        <PhotoImage class="photo-container" v-for="photo in photosData" :src="photo.thumbnailUrl"
                            :key="photo.id" :photo="photo" fit="cover" :select-mode="selectMode" :selected.sync="photo.selected"
                            show-hidden :hidden="photo.hidden"
                            @click="callThePhotoViewer(photo.url, photo.name, ownerInfo, photo.photoParam, photo.id)" @load-complete="countImageLoadComplete" />
                    </div>
                    <el-empty v-if="noAvailablePhoto" description="No Photo Available" :image-size="600"/>
                </div>
                <PhotoViewer :url="displayedPhotoUrl" :visible="photoViewerVisible" :photoName="displayedPhotoName"
                    :creator="displayedPhotoCreator" :displayedPhotoParam="displayedPhotoParam" :photoId="displayedPhotoId"
                    v-if="photoViewerVisible" @closeClick="closePhotoViewer" class="app-profile-portfolio-viewer"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Search } from '@icon-park/vue-next';
import { Delete, Hide, View } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox, ElPagination } from 'element-plus';
import PortfolioCard from '@/components/photo/portfolio-card.vue';
import UserPortfolioList from './user-portfolio-list.vue';
import portfolioApi from '@/services/portfolio-api';
import PhotoImage from '@/components/photo/photo-image.vue';
import PhotoViewer from '@/components/photo/photo-viewer.vue';
import router from '@/router';
import { reactive } from 'vue';
import photoApi from '@/services/photo-api';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

let msnry;

const pageSize = ref(10);
const loading = ref(false);
const portfolioData = ref([]);
const portfolioPageProps = ref({
    currentPage: 1,
    pageSize: 10,
    total: 2,
});
const photosData = ref([]);
const photoViewerVisible = ref(false);
const displayedPhotoUrl = ref('');
const displayedPhotoName = ref('');
const displayedPhotoCreator = ref({});
const displayedPhotoParam = ref({});
const ownerInfo = ref({});
const displayedPhotoId = ref('');
const photoContainerRef = ref(null);
const noAvailablePhoto = ref(false);
const noAvailablePortfolio = ref(false);
let imageLoadCompleteCount = 0;
const selectMode = ref(false);

const currentSelectedNum = computed(() => {
    return photosData.value.filter((photo) => photo.selected).length;
});
const currentSelectedHiddenNum = computed(() => {
    return photosData.value.filter((photo) => photo.selected && photo.hidden).length;
});
const currentSelectedUnhiddenNum = computed(() => {
    return photosData.value.filter((photo) => photo.selected && !photo.hidden).length;
});

const countImageLoadComplete = () => {
    imageLoadCompleteCount++;
    console.log('imageLoadCompleteCount: ' + imageLoadCompleteCount)
    if (imageLoadCompleteCount === photosData.value.length) {
        setTimeout(() => {
            doMasonryLayout();
        }, 500);
    }
}

const handleFinalClick = () => {
    emits('customClickFromB');
    router.push({
        path: '../portfolio/photos-in-portfolio'
    });
}
const goToUploadPhoto = () => {
    router.push({
        path: '/photo/upload'
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
    try {
        const res = await portfolioApi.getUserPortfolio(
            userId,
            token,
            portfolioPageProps.value.currentPage,
            portfolioPageProps.value.pageSize,
        );
        if (res.code === 0) {
            portfolioData.value = res.data;
            portfolioPageProps.value.total = res.totalCount;
            if (res.data.length === 0) {
                noAvailablePortfolio.value = true;
            } else {
                noAvailablePortfolio.value = false;
            }
        } else {
            ElMessage.error('Failed to get portfolio data');
        }
    } catch (err) {
        console.error(err);
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
            portfolioData.sync,
        );
        if (response.code === 0) {
            ElMessage.success('PortVisibility updated successfully!');
            fetchPortfolioData();
        } else {
            ElMessage.error('Failed to update visibility');
        }
    } catch (err) {
        console.error(err);
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

const handleCurrentChange = (page) => {
    portfolioPageProps.value.currentPage = page;
    fetchPortfolioData();
}

const handleClickCreate = () => {
    router.push({
        path: '../portfolio/create'
    });
}

const closePhotoViewer = () => {
    photoViewerVisible.value = false;
}

const callThePhotoViewer = (photoUrl, photoName, photoOwner, photoParam, photoId) => {
    if (selectMode.value) {
        const photo = photosData.value.find((photo) => photo.id === photoId);
        if (!photo) {
            return;
        }
        if (photo.selected) {
            photo.selected = false;
        } else {
            photo.selected = true;
        }
        return;
    }
    displayedPhotoUrl.value = photoUrl;
    displayedPhotoName.value = photoName;
    displayedPhotoCreator.value = photoOwner;
    displayedPhotoParam.value = photoParam;
    displayedPhotoId.value = photoId;
    photoViewerVisible.value = true;
}

const fetchOwnerPhotoData = async (isReload = false) => {
    loading.value = true;
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
        ElMessage.error('Please login first');
        return;
    }
    try {
        const response = await photoApi.getPhotoByOwnerId();
        if (response.code === 0) {
            photosData.value = response.data;
            if(response.totalCount === 0) {
                noAvailablePhoto.value = true;
            } else {
                noAvailablePhoto.value = false;
                ownerInfo.value = response.data[0].owner;
            }
        } else {
            ElMessage.error('Failed to get photo data');
        }
    } catch (err) {
        console.error(err);
        // ElMessage.warning('No Photo Available');
    } finally {
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

const doMasonryLayout = () => {
    if(msnry) {
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
    })
    console.log('layout created')
}
const deletePhotos = () => {
    if (!currentSelectedNum) {
        ElMessage.info('No photo selected');
        return;
    }
    ElMessageBox.confirm(`Are you sure to delete the selected ${currentSelectedNum.value} photos?`, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
    }).then(() => {
        Promise.all(photosData.value.filter((photo) => photo.selected).map((photo) => {
            return photoApi.deletePhoto(photo.id);
        })).then((res) => {
            if (res.some((res) => res.code !== 0)) {
                ElMessage.error('Failed to delete some photos');
                return;
            }
            ElMessage.success('Photos deleted successfully');
            fetchOwnerPhotoData(true);
        }).catch((err) => {
            console.error(err);
            ElMessage.error('Failed to delete photos');
        })
    }).catch(() => {
        // do nothing
    })
}

const hidePhotos = () => {
    if (!currentSelectedNum) {
        ElMessage.info('No photo selected');
        return;
    }
    ElMessageBox.confirm(`Are you sure to hide the selected ${currentSelectedNum.value} photos?`, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
    }).then(() => {
        Promise.all(photosData.value.filter((photo) => photo.selected).map((photo) => {
            return photoApi.changePhotoHiddenStatus(photo.id, true);
        })).then((res) => {
            if (res.some((res) => res.code !== 0)) {
                ElMessage.error('Failed to hide some photos');
                return;
            }
            ElMessage.success('Photos hide successfully');
            fetchOwnerPhotoData(true);
        }).catch((err) => {
            console.error(err);
            ElMessage.error('Failed to hide photos');
        })
    }).catch(() => {
        // do nothing
    })
}

const unhidePhotos = () => {
    if (!currentSelectedNum) {
        ElMessage.info('No photo selected');
        return;
    }
    Promise.all(photosData.value.filter((photo) => photo.selected).map((photo) => {
        return photoApi.changePhotoHiddenStatus(photo.id, false);
    })).then((res) => {
        if (res.some((res) => res.code !== 0)) {
            ElMessage.error('Failed to unhide some photos');
            return;
        }
        ElMessage.success('Photos unhide successfully');
        fetchOwnerPhotoData(true);
    }).catch((err) => {
        console.error(err);
        ElMessage.error('Failed to unhide photos');
    })
}

onMounted(() => {
    fetchPortfolioData(true);
    fetchOwnerPhotoData(true);
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
    overflow-y: auto;
}

.app-container .app-container-header {
    height: 60px;
    margin: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.app-container .app-container-header-title {
    font-size: 30px;
    font-weight: bold;
}
.app-container-header .app-operations {
    flex: 1;
    box-sizing: border-box;
    gap: 20px;
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}

.app-container .app-container-header-search-input {
    width: 300px;
    margin-left: 50px;
}

.app-container .el-pagination {
    justify-content: center;
    height: 50px;
    width: 100%;
}

.app-profile-portfolio-pagination-bar {
    margin: 10px 0;
}

.app-user-photos-display {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    gap: 10px;
    overflow: auto;
}

.photo-container {
    width: 200px;
    cursor: pointer;
}

:deep(.app-profile-portfolio-viewer .el-image__inner) {
    height: 100vh;
}
</style>
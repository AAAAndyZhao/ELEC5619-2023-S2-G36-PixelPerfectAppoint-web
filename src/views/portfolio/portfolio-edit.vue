<template>
    <div class="app-portfolio-update-container">
        <el-page-header @back="goBack" id="app-portfolio-update-header">
            <template #content>
                <span class="text-large font-600 mr-3">
                    Update Portfolio
                </span>
            </template>
        </el-page-header>
        <el-form :model="form" label-width="95px" style="margin: 20px;">
            <el-form-item label="Title">
                <el-input v-model="form.title" placeholder="Please input your title..."
                    style="margin-right: 30px;"></el-input>
            </el-form-item>
            <el-form-item label="Description">
                <el-input v-model="form.description" type="textarea" show-word-limit
                    placeholder="Please input your description..." style="margin-right: 30px;" />
            </el-form-item>
            <el-form-item label="Category">
                <el-select v-model="form.category" placeholder="Please select" style="margin-right: 30px;">
                    <el-option v-for="category in photoCategories" :key="category.code" :label="category.value"
                        :value="category.code"></el-option>
                </el-select>
            </el-form-item>
            <div id="app-portfolio-update-photo-select-area-container">
                <div class="app-portfolio-update-photo-select-area-table">
                    <el-table :data="photos" ref="photoSourceTable">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="Photo" width="180" align="center">
                            <template #default="{ row }">
                                <PhotoImage :key="row.thumbnailUrl" :src="row.thumbnailUrl" :alt="row.name" fit="contain" />
                            </template>
                        </el-table-column>
                        <el-table-column label="Name" align="center">
                            <template #default="{ row }">
                                <span>{{ row.name }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="app-portfolio-update-photo-select-control-area">
                    <!-- add and remove button -->
                    <el-button type="primary" @click="handleAdd">
                        <el-icon>
                            <DArrowRight size="20px" />
                        </el-icon>
                    </el-button>
                    <el-button type="danger" @click="handleRemove" style="margin-left: 0px;">
                        <el-icon>
                            <DArrowLeft size="20px" />
                        </el-icon>
                    </el-button>
                    <PhotoImage class="app-portfolio-cover-photo" :src="coverPhoto.thumbnailUrl" :alt="coverPhoto.name"
                        fit="contain" v-if="coverPhoto" />
                    <el-text v-if="coverPhoto">{{ coverPhoto.name }}</el-text>
                    <el-switch id="app-portfolio-private-select-btn" v-model="form.isPublic" active-color="#13ce66"
                        active-text="Public" inactive-text="Private" />
                    <el-button type="primary" @click="handleUpdate">Update</el-button>
                </div>
                <div class="app-portfolio-update-photo-select-ready-area">
                    <el-table :data="selectedPhotos" ref="photoTargetTable">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="Photo" width="180" align="center">
                            <template #default="{ row }">
                                <PhotoImage class="app-photo-display" :src="row.thumbnailUrl" :alt="row.name"
                                    fit="contain" />
                            </template>
                        </el-table-column>
                        <el-table-column label="Name" align="center">
                            <template #default="{ row }">
                                <span>{{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Cover Set" align="center">
                            <!-- provide button to choose the coverPhoto -->
                            <template #default="{ row }">
                                <el-button class="app-portfolio-update-photo-select-cover-button" type="primary"
                                    @click="handleCoverSelect(row)">Set</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElForm, ElInput, ElMessage, ElMessageBox, ElSelect, ElText } from 'element-plus';
import { useStore } from 'vuex'
import { reactive } from 'vue'
import axios from '@/utils/axios.js'
import router from '@/router.js'
// import PortfolioPhotoCard from '@/components/portfolio/portfolio-photo-card.vue'
import photoApi from '@/services/photo-api.js'
import portfolioApi from '@/services/portfolio-api.js'
import PhotoImage from '@/components/photo/photo-image.vue'
import { Windows } from '@icon-park/vue-next';

const photos = ref([])
const selectedPhotos = ref([])
const coverPhoto = ref({})
const photoSourceTable = ref(null)
const photoTargetTable = ref(null)


const fetchPhotos = async () => {
    try {
        let userId = localStorage.getItem('userId')
        const response = await photoApi.getPhotoByOwnerId(userId)
        if (response.code === 0) {
            photos.value = response.data
        } else {
            console.log(response.msg)
        }
    } catch (error) {
        console.log(error)
    }
}

const form = reactive({
    title: '',
    description: '',
    category: '',
    isPublic: false
})

const photoCategories = ref($MENU['PHOTO_CATEGORY'])

const goBack = () => {
    router.go(-1)
}

const handleAdd = () => {
    const selection = photoSourceTable.value.getSelectionRows()
    if (selectedPhotos.value.length === 0) {
        selectedPhotos.value = [...selection]
    } else {
        const selectedPhotoIds = selectedPhotos.value.map(photo => photo.id)
        const newPhotos = selection.filter(photo => !selectedPhotoIds.includes(photo.id))
        selectedPhotos.value = [...selectedPhotos.value, ...newPhotos]
    }
    photoSourceTable.value.clearSelection()
}

const handleRemove = () => {
    const selection = photoTargetTable.value.getSelectionRows()
    selectedPhotos.value = selectedPhotos.value.filter(photo => !selection.includes(photo))
}

const handleCoverSelect = (row) => {
    // return the value which is the photo's object to a new array
    coverPhoto.value = row
}

const handleUpdate = async () => {
    try {
        const portfolioData = {
            title: form.title,
            description: form.description,
            categoryCode: form.category,
            isPublic: form.isPublic,
            photoIds: selectedPhotos.value.map(photo => photo.id),
            coverPhotoId: coverPhoto.value.id
        }
        const portfolioId = router.currentRoute.value.params.id
        const response = await portfolioApi.updatePortfolio(portfolioData, portfolioId);
        // TODO: this should change the api to update portfolio
        if (response.code === 0) {
            ElMessage.success('Update portfolio successfully!')
            openSuccessMessage()
            console.log(response)
        } else {
            console.log(response.msg)
            if (response.msg == "user not found") {
                ElMessage.error(`Failed to update portfolio: ${response.msg}, please login first`)
                router.push('/sign-in')
            } else if (response.msg == "fail to find user") {
                ElMessage.error(`Failed to update portfolio: ${response.msg}, please login first`)
                router.push('/sign-in')
            } else if (response.msg == "invalid category code") {
                ElMessage.error(`Failed to update portfolio: ${response.msg}`)
            } else if (response.msg == "some photo not found or not belong to the user") {
                ElMessage.error(`Failed to update portfolio: ${response.msg}`)
            } else if (response.msg == "fail to add portfolio") {
                ElMessage.error(`Failed to update portfolio: ${response.msg}`)
                Windows.location.reload()
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const fetchTargetPhotos = async () => {
    try {
        const portfolioId = router.currentRoute.value.params.id
        const response = await portfolioApi.getPortfolioById(portfolioId)
        if (response.code === 0) {
            const portfolio = response.data[0]
            form.title = portfolio.title
            form.description = portfolio.description
            form.category = portfolio.categoryCode
            form.isPublic = portfolio.isPublic
            selectedPhotos.value = portfolio.photos
            coverPhoto.value = portfolio.coverPhoto
        } else {
            console.log(response.msg)
        }
    } catch (error) {
        console.log(error)
    }
}

const openSuccessMessage = () => {
    ElMessageBox.confirm(
        'Successfully update the Portfolio!',
        'Congrats!',
        {
            confirmButtonText: 'To Check',
            cancelButtonText: 'Cancel',
            type: 'success'
        }
    ).then(() => {
        router.push({ path: '/user/profile', query: { tab: 'portfolio' } }).then(() => {
            window.location.reload()
        })
    }).catch(() => {
        // do nothing
        router.push( '/' ).then(() => {
            window.location.reload()
        })
    })
}

onMounted(() => {
    fetchPhotos()
    fetchTargetPhotos()
})

</script>

<style scoped>
.app-portfolio-update-container {
    display: flex;
    flex-direction: column;
    min-width: calc(100vh - 300px);
    min-height: calc(100vh - 60px);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#app-portfolio-update-header {
    margin: 20px;
}

#app-portfolio-update-photo-select-area-container {
    display: flex;
    flex-direction: row;
    justify-content: left;
    flex-wrap: wrap;
    gap: 10px;
}

.app-portfolio-update-photo-select-area-table,
.app-portfolio-update-photo-select-ready-area {
    min-width: 600px;
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: left;
    flex-wrap: wrap;
    gap: 10px;
    border: 1px solid #ebeef5;
    margin: 20px;
}

.app-portfolio-update-photo-select-control-area {
    width: 8%;
    margin: 20px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 10px;
}

.app-portfolio-update-photo-select-cover-button {
    width: 80px;
}

.app-portfolio-cover-photo {
    border: 1px solid #ebeef5;
    margin: 20px -10px 0px -10px;
}

#app-portfolio-private-select-btn,
.el-switch {
    width: 80px;
    margin: 20px auto;
    text-align: center;
    justify-content: center;
}

.el-image {
    height: 180px;
}
</style>

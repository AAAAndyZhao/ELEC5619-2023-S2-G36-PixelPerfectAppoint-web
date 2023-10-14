<template>
    <div class="app-post-upload" v-loading="loading">
        <div class="app-post-upload-title">
            <h2>Upload Post</h2>
        </div>
        <div class="app-post-photo-upload-content">
            <el-card class="app-photos-container">
                <template #header>
                    <div class="app-container-header">
                        Photos{{ fileList.length > 0 ? ` (${fileList.length})` : '' }}
                    </div>
                </template>
                <el-upload
                class="app-upload"
                method="post"
                :accept="acceptFileTypes"
                v-model:file-list="fileList"
                :action="uploadActionUrl"
                :headers="uploadRequestHeaders"
                name="file"
                list-type="picture-card"
                :on-remove="handleRemove"
                :on-error="uploadImageErrorHandler"
                :on-success="uploadImageSuccessHandler"
                :on-progress="hanldeUploadProgress"
                :before-upload="beforeUpload">
                    <el-icon><Plus /></el-icon>
                </el-upload>
            </el-card>
            <div class="app-info-container">
                <el-card class="app-post-info-form-container">
                    <template #header>
                        <div class="app-container-header">
                            Post Information {{ displayedPhotoInfo === null ? '(please add photos first)' : `` }}
                        </div>
                    </template>
                    <PostInfoForm :photo="displayedPhotoInfo" :title="title" :description="description" @update:photo="handlePhotoFormUpdate"/>
                </el-card>
                <div class="app-upload-buttons-container">
                    <el-button type="primary" size="large" @click="handleSubmitPhotoUploads"
                    :disabled="photoList.length === 0">Submit</el-button>
                    <el-button size="large" @click="handleReset">Reset</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from '@/utils/axios.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import PostInfoForm from '../post/post-info-form.vue'
import photoApi from '@/services/photo-api'


const loading = ref(false)
const fileList = ref([])
const photoList = ref([])
const uploadRequestHeaders = ref({
    'authorization': localStorage.getItem('token')
});
const displayedPhotoInfo = ref(null);
const title = ref('');
const description = ref('');
const acceptFileTypes = ref('.jpeg, .png, .jpg, .jfif')
const uploadActionUrl = ref(`${axios.defaults.baseURL}/image/upload?uid=${localStorage.getItem('userId')}`)
const handlePictureCardPreview = (file) => {
    console.log(file)
}
const handleRemove = (file, fileList) => {
    // remove the file from photoList
    for (const photo of photoList.value) {
        if (photo.url === file.url) {
            photoList.value.splice(photoList.value.indexOf(photo), 1);
            break;
        }
    }
    displayedPhotoInfo.value = null;
}
//上传成功后，返回response，file，fileList
const uploadImageSuccessHandler = (response, file, fileList) => {
    if (response.code === 0) {
        ElMessage.success('Upload successfully!');
        const newItme = {
            url: file.url, // used for click event finding the selected photo
            imageId: response.data[0].id,
        }
     
        photoList.value.push(newItme);
        selectPhoto(newItme);
    } else {
        ElMessage.error('Upload failed!');
        // remove the file from fileList
        fileList.splice(fileList.indexOf(file), 1);
    }
}
const uploadImageErrorHandler = (err, file, fileList) => {
    console.err(err, file, fileList)
    ElMessage.error('Upload failed! ' + err.message || 'Unknown error');
}
const hanldeUploadProgress = (event, file, fileList) => {
    
}
const beforeUpload = (file) => {
    // file size limit
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
        ElMessage.error('Image size cannot exceed 100MB!');
        return false;
    }
    ElMessage.success('Uploading...');
}
const extractCameraParamByRegex = (regex, str) => {
    const match = str.match(regex);
    if (match) {
        return match[1];
    } else {
        return str;
    }
}
const selectPhoto = (photoItem, showError = false) => {
    //将传入子组件的displayedPhotoInfo的值改为photoItem
    displayedPhotoInfo.value = photoItem;
    // unset all `.el-upload-list__item-thumbnail`'s parentElement border
    const doms = document.querySelectorAll('.el-upload-list__item-thumbnail');
    for (const dom of doms) {
        dom.parentElement.style.border = 'none';
    }
    // find `.el-upload-list__item-thumbnail[src="${photoItem.url}"]`'s parentElement and set border
    nextTick(() => {
        const dom = document.querySelector(`.el-upload-list__item-thumbnail[src="${photoItem.url}"]`).parentElement;
        if (dom) {
            if (showError) {
                dom.style.border = '3px solid #F56C6C';
            } else {
                dom.style.border = '3px solid #409EFF';
            }
        }
    })
}
const handleClickPhotoItem = (event) => {
    if (event.target && event.target.classList.contains('el-upload-list__item-actions')) {
        const parent = event.target.parentElement;
        const image = parent.children[0];
        const src = image.src;
        for (const photo of photoList.value) {
            if (photo.url === src) {
                console.log(photo)
                selectPhoto(photo);
            }
        }
    }
}
const handlePhotoFormUpdate = (photo) => {
    // update the photo in photoList
    for (const item of photoList.value) {
        if (item.url === photo.url) {
            Object.assign(item, photo);
            break;
        }
    }
}
const isFormValid = (title,description) => {
    if (!title || title.length === 0
    || title.length > 50) {
        console.error('title', title.value)
        return false;
    }
    if (!description|| description.length === 0) {
        console.error('description', description.value)
        return false;
    }
    return true;
}
const handleSubmitPhotoUploads = async () => {
    let allValid = true;
    
        if (!isFormValid(title.value,description.value)) {
                    allValid = false;
        }
    
    if (!allValid) {
        ElMessage.error('Please fill in all the required fields');
        return;
    }
    // submit photoList to backend
    try{
        loading.value = true;
        const resList = await photoApi.uploadPhotoList(photoList.value);
        let failureCount = 0;
        for (const res of resList) {
            if (res.code !== 0) {
                failureCount++;
            }
        }
        if (failureCount === 0) {
            ElMessage.success('Submit successfully');
            // clear photoList and fileList
            photoList.value = [];
            fileList.value = [];
            displayedPhotoInfo.value = null;
        } else {
            ElMessage.error(`Submit failed, ${failureCount} photos failed to upload`);
        }
    }catch(err){
        ElMessage.error('Submit failed');
        return;
    }finally{
        loading.value = false;
    }
}

const handleReset = () => {
    ElMessageBox.confirm(
        `Are you sure to reset the whole work?`,
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    ).then(async () => {
        loading.value = true;
        photoList.value = [];
        fileList.value = [];
        displayedPhotoInfo.value = null;
        setTimeout(() => {
            loading.value = false;
            ElMessage.success('Reset successfully');
        }, 1000);
    }).catch(() => {
        // do nothing
    });
}

onMounted(() => {
    document.addEventListener('click', handleClickPhotoItem);
})
</script>

<style scoped>
.app-post-upload {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
}
.app-post-upload-title {
    height: 36px;
}
.app-post-upload-title h2 {
    text-align: left;
    margin-block-start: 0;
}
.app-post-photo-upload-content {
    height: calc(100% - 36px);
    width: 100%;
    box-sizing: border-box;
    padding: 30px 0;
}
.app-post-photo-upload-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
}
.app-post-photo-upload-content>.app-photos-container {
    height: 100%;
    width: 64%;
    box-sizing: border-box;
    padding: 10px;
    text-align: left;
}
.app-post-photo-upload-content>.app-info-container{
    height: 100%;
    width: 34%;
    box-sizing: border-box;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}
.app-post-photo-upload-content>.app-info-container>.app-photos-info-form-container {
    height: calc(100% - 100px);
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
}
.app-post-photo-upload-content>.app-info-container>.app-upload-buttons-container {
    height: 100px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-direction: row;
}
.app-post-photo-upload-content .app-container-header{
    font-weight: bold;
    font-size: 18px;
    text-align: left;
}
:deep(.app-post-photo-upload-content .el-card__body) {
    height: calc(100% - 64px);
    width: 100%;
    box-sizing: border-box;
}
:deep(.app-post-info-form-container .el-form-item){
    margin-bottom: 30px;
}
.app-upload-buttons-container .el-button {
    width: 200px;
}
</style>
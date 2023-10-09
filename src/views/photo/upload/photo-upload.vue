<template>
    <div class="app-photo-upload" v-loading="loading">
        <div class="app-photo-upload-title">
            <h2>Upload Photo</h2>
        </div>
        <div class="app-photo-upload-content">
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
                <el-card class="app-photos-info-form-container">
                    <template #header>
                        <div class="app-container-header">
                            Photo Information {{ displayedPhotoInfo === null ? '(None selected)' : `${displayedPhotoInfo.originalFileName}` }}
                        </div>
                    </template>
                    <PhotoInfoForm :photo="displayedPhotoInfo" @update:photo="handlePhotoFormUpdate"/>
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
import PhotoInfoForm from './photo-info-form.vue'
import photoApi from '@/services/photo-api'

const loading = ref(false)
const fileList = ref([])
const photoList = ref([])
const uploadRequestHeaders = ref({
    'authorization': localStorage.getItem('token')
});
const displayedPhotoInfo = ref(null);
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
const uploadImageSuccessHandler = (response, file, fileList) => {
    if (response.code === 0) {
        ElMessage.success('Upload successfully!');
        const newItme = {
            url: file.url, // used for click event finding the selected photo
            name: file.name,
            imageId: response.data[0].id,
            description: '',
            categoryCode: 0
        }
        if (response.data.length > 0 && response.data[0].metadata) {
            const metadata = response.data[0].metadata;
            newItme.camMaker = metadata.cam_maker;
            newItme.camModel = metadata.cam_model;
            newItme.lens = metadata.lens;
            newItme.focalLength = extractCameraParamByRegex(/(.*)\s+mm/, metadata.focal_length);
            // could be s, sec, secs, second, seconds, regex should consider all these cases
            newItme.exposureTime = extractCameraParamByRegex(/(.*)\s+s/, metadata.exposure_time);
            // could be f/1.4, f/2.8, f/4, f/5.6, f/8, f/11, f/16, f/22, or without 'f/', regex should consider all these cases
            newItme.fNumber = extractCameraParamByRegex(/f\/(.*)/, metadata.f_number);
            newItme.iso = metadata.iso;
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
    console.log(err, file, fileList)
}
const hanldeUploadProgress = (event, file, fileList) => {
    console.log(event, file, fileList)
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
const isFormValid = (photoItem) => {
    if (!photoItem.name || photoItem.name.length === 0
    || photoItem.name.length > 50) {
        console.error('name', photoItem.name)
        return false;
    }
    if (!photoItem.description || photoItem.description.length === 0) {
        console.error('description', photoItem.description)
        return false;
    }
    if (photoItem.categoryCode === null || photoItem.categoryCode === undefined || photoItem.categoryCode < 0) {
        console.error('categoryCode', photoItem.categoryCode)
        return false;
    }
    if (!photoItem.camMaker || photoItem.camMaker.length > 64) {
        console.error('camMaker', photoItem.camMaker)
        return false;
    }
    if (!photoItem.camModel || photoItem.camModel.length > 64) {
        console.error('camModel', photoItem.camModel)
        return false;
    }
    if (!photoItem.lens || photoItem.lens.length > 64) {
        console.error('lens', photoItem.lens)
        return false;
    }
    const focalLengthRegex = /^\d{1,4}$/;
    const exposureTimeRegex = /^1\/\d{1,4}$|^1$|^\d{1,5}$/;
    const fNumberRegex = /^\d{1,2}\.?\d{0,2}$/;
    const isoRegex = /^\d{1,4}$/;
    if (!photoItem.focalLength || !focalLengthRegex.test(photoItem.focalLength)) {
        console.error('focalLength', photoItem.focalLength)
        return false;
    }
    if (!photoItem.exposureTime || !exposureTimeRegex.test(photoItem.exposureTime)) {
        console.error('exposureTime', photoItem.exposureTime)
        return false;
    }
    if (!photoItem.fNumber || !fNumberRegex.test(photoItem.fNumber)) {
        console.error('fNumber', photoItem.fNumber)
        return false;
    }
    if (!photoItem.iso || !isoRegex.test(photoItem.iso)) {
        console.error('iso', photoItem.iso)
        return false;
    }
    return true;
}
const handleSubmitPhotoUploads = async () => {
    let allValid = true;
    for (const photoItem of photoList.value) {
        if (!isFormValid(photoItem)) {
            const url = photoItem.url;
            for (const file of fileList.value) {
                if (file.url === url) {
                    allValid = false;
                    selectPhoto(photoItem, true);
                }
            }
        }
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
.app-photo-upload {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
}
.app-photo-upload-title {
    height: 36px;
}
.app-photo-upload-title h2 {
    text-align: left;
    margin-block-start: 0;
}
.app-photo-upload-content {
    height: calc(100% - 36px);
    width: 100%;
    box-sizing: border-box;
    padding: 30px 0;
}
.app-photo-upload-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
}
.app-photo-upload-content>.app-photos-container {
    height: 100%;
    width: 64%;
    box-sizing: border-box;
    padding: 10px;
    text-align: left;
}
.app-photo-upload-content>.app-info-container{
    height: 100%;
    width: 34%;
    box-sizing: border-box;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}
.app-photo-upload-content>.app-info-container>.app-photos-info-form-container {
    height: calc(100% - 100px);
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
}
.app-photo-upload-content>.app-info-container>.app-upload-buttons-container {
    height: 100px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-direction: row;
}
.app-photo-upload-content .app-container-header{
    font-weight: bold;
    font-size: 18px;
    text-align: left;
}
:deep(.app-photo-upload-content .el-card__body) {
    height: calc(100% - 64px);
    width: 100%;
    box-sizing: border-box;
}
:deep(.app-photos-info-form-container .el-form-item){
    margin-bottom: 30px;
}
.app-upload-buttons-container .el-button {
    width: 200px;
}
</style>
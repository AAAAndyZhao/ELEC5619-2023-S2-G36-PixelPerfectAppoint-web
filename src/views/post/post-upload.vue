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
                <el-upload class="app-upload" method="post" :accept="acceptFileTypes" v-model:file-list="fileList"
                    :action="uploadActionUrl" :headers="uploadRequestHeaders" name="file" list-type="picture-card"
                    :on-remove="handleRemove" :on-error="uploadImageErrorHandler" :on-success="uploadImageSuccessHandler"
                    :on-progress="hanldeUploadProgress" :before-upload="beforeUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-card>
            <div class="app-info-container">
                <el-card class="app-post-info-form-container">
                    <template #header>
                        <div class="app-container-header">
                            Post Information {{ displayedPhotoInfo === null ? '(please add photos first)' : `` }}{{ title }}
                        </div>
                    </template>
                    <PostInfoForm :photo="displayedPhotoInfo" @update:postInfo="receiveData" />
                    <div class="app-container-footer">
                        Cover Image: 
                        <el-image style="width: 100px; height: 100px" :src="cover_image_url" fit="fill" />
                    </div>



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
import postApi from '@/services/post-api'
import { OneThirdRotation } from '@icon-park/vue-next'


const loading = ref(false)
const fileList = ref([])
const photoList = ref([])
const uploadRequestHeaders = ref({
    'authorization': localStorage.getItem('token')
});
const displayedPhotoInfo = ref(null);
const postInfo = {
    uid: localStorage.getItem('userId'),
    title: '',
    text: '',
    image_ids: [],
    cover_image_id: ''
}
const cover_image_url = ref('')
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
        console.log("测试", file.url,file.imageId)
        cover_image_url.value = file.url
        postInfo.cover_image_id = newItme.imageId
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
                cover_image_url.value = photo.url
                postInfo.cover_image_id = photo.imageId
                selectPhoto(photo);
            }
        }
    }
}
const receiveData = (updatedPhotoForm) => {
    // 在这里处理子组件传递过来的数据
    postInfo.title = updatedPhotoForm.title;
    postInfo.text = updatedPhotoForm.description;
};


const isFormValid = (title, description) => {
    if (!title || title.length === 0
        || title.length > 50) {
        console.error('title', title.value)
        return false;
    }
    if (!description || description.length === 0) {
        console.error('description', description.value)
        return false;
    }
    return true;
}
const handleSubmitPhotoUploads = async () => {
    let allValid = true;
    for (const photo of photoList.value) {
        postInfo.image_ids.push(photo.imageId);
    }
    console.log("postInfo", postInfo);


    if (!isFormValid(postInfo.title, postInfo.text)) {
        allValid = false;
    }

    if (!allValid) {
        ElMessage.error('Please fill in all the required fields');
        return;
    }
    // submit photoList to backend
    try {
        loading.value = true;
        const res = await postApi.uploadPost(postInfo);
        
        if (res.code === 0) {
            ElMessage.success('Submit successfully');
            // clear photoList and fileList 
            photoList.value = [];
            fileList.value = [];
            displayedPhotoInfo.value = null;
            cover_image_url.value = ''
            displayedPhotoInfo.value = null;
        } else {
            ElMessage.error(`Submit failed, ${failureCount} photos failed to upload`);
            postInfo.image_ids = [];
            photoList.value = [];
            fileList.value = [];
            cover_image_url.value = ''
            displayedPhotoInfo.value = null;
        }
    } catch (error) {
        ElMessage.error('Submit failed');
        postInfo.image_ids = [];
        photoList.value = [];
        fileList.value = [];
        cover_image_url.value = ''
        displayedPhotoInfo.value = null;
        return;
    } finally {
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

.app-post-photo-upload-content>.app-info-container {
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
    height: calc(100% - 50px);
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

.app-post-photo-upload-content .app-container-header {
    font-weight: bold;
    font-size: 18px;
    text-align: left;
}

.app-post-photo-upload-content .app-container-footer {
    font-size: 18px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-content: space-around;
    justify-content: space-evenly;
    align-items: center;
}

:deep(.app-post-photo-upload-content .el-card__body) {

    width: 100%;
    box-sizing: border-box;
}

:deep(.app-post-info-form-container .el-form-item) {
    margin-bottom: 30px;
}

.app-upload-buttons-container .el-button {
    width: 200px;
}
</style>
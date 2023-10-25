<template>
    <div class="app-post-update" v-loading="loading">
        <div class="app-post-update-title">
            <h2>Edit Post</h2>
        </div>
        <div class="app-post-photo-update-content">
            <el-card class="app-photos-container">
                <template #header>
                    <div class="app-container-header">
                        Photos{{ fileList.length > 0 ? ` (${fileList.length})` : ' ' }}
                    </div>
                    <div class="app-container-tips">
                        (By default the latest uploaded photo will be used as the cover, if you want to change the cover,
                        please click on the uploaded photo)
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
                            Post Information {{ photoUploaded === null ? '(please add photos first)' : `` }}
                        </div>
                    </template>
                    <PostInfoForm :photo="photoUploaded" @update:postInfo="receiveData" :postData="importPostInfo" />
                    <div class="app-container-footer">
                        Cover Image:
                        <el-image style="width: 100px; height: 100px" :src="cover_image_url" fit="fill" size="" />
                    </div>



                </el-card>
                <div class="app-update-buttons-container">
                    <el-button type="primary" size="large" @click="handleSubmitPostUpdate"
                        :disabled="photoList.length === 0">update</el-button>
                    <el-button size="large" @click="handleCancel">cancel</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from '@/utils/axios.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import PostInfoForm from '../../components/post/edit-post-info-form.vue'
import postApi from '@/services/post-api'
import { OneThirdRotation } from '@icon-park/vue-next'
import router from '../../router'



const loading = ref(false)
const fileList = ref([])
const photoList = ref([])
const uploadRequestHeaders = ref({
    'authorization': localStorage.getItem('token')
});
const photoUploaded = ref(null);
const postInfo = {
    uid: localStorage.getItem('userId'),
    title: '',
    text: '',
    image_ids: [],
    cover_image_id: ''
}
const cover_image_url = ref('')
const acceptFileTypes = ref('.jpeg, .png, .jpg')
const uploadActionUrl = ref(`${axios.defaults.baseURL}/image/upload?uid=${localStorage.getItem('userId')}`)
const handlePictureCardPreview = (file) => {
    console.log(file)
}
const handleRemove = (file, fileList) => {
    console.log('filelist info', fileList)
    // remove the file from photoList
    for (const photo of photoList.value) {
        if (photo.url === file.url) {
            photoList.value.splice(photoList.value.indexOf(photo), 1);
            break;
        }
    }
    if (fileList.length === 0) {
        postInfo.cover_image_id = ''
        cover_image_url.value = null
    }else{
        if(fileList[0].id){
            // existing photo
            postInfo.cover_image_id = fileList[0].id
        }else{
            const res = fileList[0].response;
            // new added image, id is in response
            if (res.code === 0 && res.data.length > 0){
                postInfo.cover_image_id = res.data[0].id
            }
        }
        cover_image_url.value = fileList[0].url
    }
}
const uploadImageSuccessHandler = (response, file, fileList) => {
    if (response.code === 0) {
        ElMessage.success('Upload successfully!');
        const newItme = {
            url: file.url, // used for click event finding the selected photo
            imageId: response.data[0].id,
        }
        cover_image_url.value = file.url
        postInfo.cover_image_id = newItme.imageId
        ElMessage.success('cover image changed');
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

    photoUploaded.value = photoItem;
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
                ElMessage.success('cover image changed');
                postInfo.cover_image_id = photo.imageId
                selectPhoto(photo);
            }
        }
    }
}
const receiveData = (updatedPhotoForm) => {

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
const handleSubmitPostUpdate = async () => {
    let allValid = true;
    for (const photo of photoList.value) {
        postInfo.image_ids.push(photo.imageId);
    }

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
        const res = await postApi.updatePostDetail(postId, postInfo);
        console.log('postInfo', postInfo)

        if (res.code === 0) {
            ElMessage.success('Submit successfully');
            // clear photoList and fileList 
            photoList.value = [];
            fileList.value = [];
            photoUploaded.value = null;
            cover_image_url.value = ''
            photoUploaded.value = null;
            router.push('/user/profile?tab=posts')
        } else {
            ElMessage.error(`Submit failed, ${failureCount} photos failed to upload`);
            postInfo.image_ids = [];
            photoList.value = [];
            fileList.value = [];
            cover_image_url.value = ''
            photoUploaded.value = null;
            router.push('/user/profile?tab=posts')
        }
    } catch (error) {
        ElMessage.error('Submit failed');
        postInfo.image_ids = [];
        photoList.value = [];
        fileList.value = [];
        cover_image_url.value = ''
        photoUploaded.value = null;
        router.push('/user/profile?tab=posts')
        return;
    } finally {
        loading.value = false;
    }
}

const handleCancel = () => {
    ElMessageBox.confirm(
        `Are you sure to cancel update?`,
        'Warning',
        {
            confirmButtonText: 'Yes',
            cancelButtonText: 'no',
            type: 'warning',
        }
    ).then(async () => {
        router.push('/user/profile?tab=posts')
    }).catch(() => {
        // do nothing
    });
}
let path = window.location.pathname;
let parts = path.split('/');
let postId = parts[parts.length - 1];
const importPostInfo = ref({

    title: '',
    text: '',

})


const fetchData = async () => {
    try {
        const res = await postApi.getPostDetail(postId);

        if (res.code === 0) {
            console.log(res.data[0])

            for (const photo of res.data[0].photos) {

                const newItme = {
                    url: photo.url, // used for click event finding the selected photo
                    imageId: photo.id
                }
                console.log('zheshixinsiphoto)', photo)
                fileList.value.push(photo)
                photoList.value.push(newItme)
                console.log('fileList', fileList.value)
                selectPhoto(photo);
            }
            postInfo.cover_image_id = res.data[0].coverPhoto.id
            cover_image_url.value = res.data[0].coverPhoto.url
            importPostInfo.value.text = res.data[0].text
            importPostInfo.value.title = res.data[0].title
        } else {
            ElMessage.error('获取数据失败。');
        }
    } catch (error) {
        ElMessage.error('获取数据时出错。');
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickPhotoItem);
    fetchData()
})
</script>

<style scoped>
.app-post-update {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
}

.app-post-update-title {
    height: 36px;
}

.app-post-update-title h2 {
    text-align: left;
    margin-block-start: 0;
}

.app-post-photo-update-content {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 30px 0;
}

.app-post-photo-update-content {

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}


.app-post-photo-update-content>.app-photos-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    text-align: left;
}

.app-container-tips {
    font-size: 15px;
    color: #909399;
    margin-top: 6px;
}

.app-post-photo-update-content>.app-info-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 10px;
}

.app-post-photo-update-content>.app-info-container>.app-post-info-form-container {
    height: calc(100% - 50px);
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
}

.app-post-photo-update-content>.app-info-container>.app-update-buttons-container {
    height: 100px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-direction: row;
}

.app-post-photo-update-content .app-container-header {
    font-weight: bold;
    font-size: 18px;
    text-align: left;
}

.app-post-photo-update-content .app-container-footer {

    text-align: left;
    display: flex;
    flex-direction: row;
    align-content: space-around;
    justify-content: space-evenly;
    align-items: center;
}

:deep(.app-post-photo-update-content .el-card__body) {

    width: 100%;
    box-sizing: border-box;
}

:deep(.app-post-info-form-container .el-form-item) {
    margin-bottom: 30px;
}

.app-update-buttons-container .el-button {
    width: 200px;
}
</style>
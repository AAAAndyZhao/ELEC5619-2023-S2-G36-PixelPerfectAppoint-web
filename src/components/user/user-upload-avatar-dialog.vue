<template>
    <el-dialog :model-value="show">
        <template #header>
            <h3>Upload Avatar</h3>
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
        :on-error="uploadImageErrorHandler"
        :on-success="uploadImageSuccessHandler"
        :on-progress="hanldeUploadProgress"
        :before-upload="beforeUpload">
            <el-icon><Plus /></el-icon>
        </el-upload>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/utils/axios';
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});

const acceptFileTypes = ref('.jpeg, .png, .jpg, ')
const fileList = ref([]);
const uploadRequestHeaders = ref({
    'authorization': localStorage.getItem('token')
});
const uploadActionUrl = ref(`${axios.defaults.baseURL}/image/upload?uid=${localStorage.getItem('userId')}`)
const emits = defineEmits(['upload-success']);

const uploadImageSuccessHandler = (res) => {
    console.log(res)
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
</script>

<style scoped>
</style>
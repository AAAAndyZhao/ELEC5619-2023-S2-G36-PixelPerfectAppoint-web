<template>
    <el-dialog :model-value="show" class="app-upload-avatar-dialog"
    width="30%">
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
        :before-upload="beforeUpload"
        :disabled="disabledUpload">
            <el-icon><Plus /></el-icon>
        </el-upload>
    </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from '@/utils/axios';
import { ElMessage } from 'element-plus';
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});
const disabledUpload = computed(() => {
    return fileList.value.length >= 1
})
const acceptFileTypes = ref('.jpeg, .png, .jpg, ')
const fileList = ref([]);
const uploadRequestHeaders = ref({
    'authorization': localStorage.getItem('token')
});
const uploadActionUrl = ref(`${axios.defaults.baseURL}/image/upload?uid=${localStorage.getItem('userId')}&simple=true`)
const emits = defineEmits(['upload-success']);

const uploadImageSuccessHandler = (res) => {
    console.log(res)
    emits('upload-success', res)
}

const uploadImageErrorHandler = (err, file, fileList) => {
    console.err(err, file, fileList)
    ElMessage.error('Upload failed! ' + err.message || 'Unknown error');
}
const hanldeUploadProgress = (event, file, fileList) => {
    
}
const beforeUpload = (file) => {
    console.log(file)
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
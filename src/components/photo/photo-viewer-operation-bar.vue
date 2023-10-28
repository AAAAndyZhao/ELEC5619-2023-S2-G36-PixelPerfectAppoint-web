
<template>
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <div class="operation-bar">
        <div class="user-avatar">
            <userAvatar :user="creator" :size="40" />
            <el-text>{{ creator.alias }}</el-text>
        </div>
        <div class="photo-info">
            <span>{{ photoName }}</span>
        </div>
        <div class="like-button">
            <span class="material-symbols-outlined photo-with-no-like" @click="likePhoto" v-if="!alreadyLiked">
                thumb_up
            </span>
            <span class="material-symbols-outlined photo-with-like" @click="unlikePhoto" v-if="alreadyLiked">
                thumb_up
            </span>
            <el-icon color="#c6e2ff" size="40" class="comment-btn" @click="commentPhoto(props.photoId)">
                <ChatLineRound />
            </el-icon>
            <el-icon class="info-btn" size="40" color="#c6e2ff" @click="showTheParam">
                <InfoFilled />
            </el-icon>
        </div>
        <el-dialog v-model="dialogVisible" title="Picture Detail" class="dialogPhotoParam" width="400px">
            <el-table :data="tableData" class="dialog-photo-param-table">
                <el-table-column property="parameter" label="Parameter" width="180"></el-table-column>
                <el-table-column property="value" label="Value" width="180"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup>

import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import userAvatar from "../user/user-avatar.vue";
import userApi from "@/services/user-api.js";
import photoApi from "@/services/photo-api.js";
import router from "@/router";

const alreadyLiked = ref(false);

const props = defineProps({
    photoName: {
        type: String,
        required: true,
    },
    creator: {
        type: Object,
        required: true,
    },
    displayedPhotoParam: {
        type: Object,
        default: () => ({}),
    },
    photoId: {
        type: String,
        required: true,
    },
})

const tableData = ref([
    { parameter: 'Camera Maker', value: props.displayedPhotoParam.camMaker || 'Unknown' },
    { parameter: 'Camera Model', value: props.displayedPhotoParam.camModel || 'Unknown' },
    { parameter: 'Exposure Time', value: props.displayedPhotoParam.exposureTime || 'Unknown' },
    { parameter: 'Aperture', value: props.displayedPhotoParam.fNumber || 'Unknown' },
    { parameter: 'ISO', value: props.displayedPhotoParam.iso || 'Unknown' },
    { parameter: 'Focal Length', value: props.displayedPhotoParam.focalLength || 'Unknown' },
    { parameter: 'Lens', value: props.displayedPhotoParam.lens || 'Unknown' },
]);

const dialogVisible = ref(false);

const components = {
    UserAvatar: userAvatar,
}

const likePhoto = async () => {
    const response = await photoApi.photoLike(props.photoId);
    if (response.code === 0) {
        ElMessage({
            message: 'Like photo successfully',
            type: 'success'
        })
        alreadyLiked.value = true;
    } else {
        console.error("Like photo failed");
        ElMessage({
            message: 'Like photo failed',
            type: 'error'
        })
    }
}

const unlikePhoto = async () => {
    const response = await photoApi.photoUnlike(props.photoId);
    if (response.code === 0) {
        ElMessage({
            message: 'Unlike photo successfully',
            type: 'info'
        })
        alreadyLiked.value = false;
    } else {
        console.error("Unlike photo failed");
        ElMessage({
            message: 'Unlike photo failed',
            type: 'error'
        })
    }
}

const checkPhotoLike = async () => {
    const response = await photoApi.photoCheckLike(props.photoId);
    if (response.code === 0) {
        alreadyLiked.value = true;
    } else if (response.code === 1 && response.msg === "photo not found or hidden") {
        ElMessage({
            message: "Secret or Not Avaliable Photo",
            type: 'warning',
        })
    } else {
        console.error(response.msg);
        alreadyLiked.value = false;
    }
}

const commentPhoto = (photoId) => {
    router.push({
        path: '/photo/detail/' + photoId
    })
}

const showTheParam = () => {
    dialogVisible.value = true;
    console.log("showTheParam");
};

onMounted(async () => {
    checkPhotoLike();
})
</script>

<style scoped>
.operation-bar {
    position: fixed;
    z-index: 103;
    bottom: 0;
    left: 0;
    height: 60px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
}

.user-avatar {
    display: flex;
    flex-direction: row;
    margin-left: 20px;
}

.user-avatar .el-text {
    margin-left: 20px;
    color: #c6e2ff;
    font-size: large;
}

.like-button {
    margin-right: 30px;
}

.photo-info {
    display: flex;
    align-items: center;
    margin-left: 30px;
}

.photo-info span {
    margin-right: 10px;
    font-size: large;
    color: #c6e2ff;
}

.material-symbols-outlined {
    margin-left: 20px;
    margin-right: 20px;
    color: #c6e2ff;
    font-size: 40px;
    font-variation-settings:
        'FILL' 0,
        'wght' 300,
        'GRAD' 0,
        'opsz' 24;
    transition: all 0.7s ease-in-out;
}

.info-btn {
    margin-left: 20px;
}

.dialogPhotoParam {
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
}

.material-symbols-outlined:hover,
.like-button el-icon:hover {
    color: #ffffff;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
}

.info-btn:hover {
    color: #ffffff;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
}

.comment-btn:hover {
    color: #ffffff;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
}

.like-button .photo-with-like {
    color: var(--el-color-primary);
    font-variation-settings:
        'FILL' 1,
        'wght' 300,
        'GRAD' 0,
        'opsz' 24
}

.like-button .photo-with-no-like {
    font-variation-settings:
        'FILL' 1,
        'wght' 300,
        'GRAD' 0,
        'opsz' 24
}
</style>
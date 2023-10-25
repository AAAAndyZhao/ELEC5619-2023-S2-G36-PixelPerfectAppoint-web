
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
            <span class="material-symbols-outlined" @click="likePhoto">
                thumb_up
            </span>
            <el-icon color="#409eff" size="40">
                <ChatLineRound />
            </el-icon>
            <el-icon class="info-btn" size="40" color="#409eff" @click="showTheParam">
                <InfoFilled />
            </el-icon>
        </div>
        <el-dialog v-model="dialogVisible" title="Picture Detail" class="dialogPhotoParam">
            <el-text>Camera Maker: {{ displayedPhotoParam.camMaker == '' ? "Unkown" : displayedPhotoParam.camMaker }}</el-text>
            <el-divider></el-divider>
            <el-text>Camera Model: {{ displayedPhotoParam.camModel == '' ? "Unkown" : displayedPhotoParam.camModel }}</el-text>
            <el-divider></el-divider>
            <el-text>Exposure Time: {{ displayedPhotoParam.exposureTime == '' ? "Unkown" : displayedPhotoParam.exposureTime }}</el-text>
            <el-divider></el-divider>
            <el-text>Aperture: {{ displayedPhotoParam.fNumber == '' ? "Unkown" : displayedPhotoParam.fNumber }}</el-text>
            <el-divider></el-divider>
            <el-text>ISO: {{ displayedPhotoParam.iso == '' ? "Unkown" : displayedPhotoParam.iso }}</el-text>
            <el-divider></el-divider>
            <el-text>Focal Length: {{ displayedPhotoParam.focalLength == '' ? "Unkown" : displayedPhotoParam.focalLength }}</el-text>
            <el-divider></el-divider>
            <el-text>Len: {{ displayedPhotoParam.lens == '' ? "Unkown" : displayedPhotoParam.lens }}</el-text>
        </el-dialog>
    </div>
</template>

<script setup>

import { ref, computed, onMounted } from "vue";
import userAvatar from "../user/user-avatar.vue";
import userApi from "@/services/user-api.js";

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
})

const dialogVisible = ref(false);

const components = {
    UserAvatar: userAvatar,
}

const likePhoto = () => {
    console.log("Like photo");
}

const commentPhoto = () => {
    console.log("Comment photo");
}

const showTheParam = () => {
    dialogVisible.value = true;
    console.log("showTheParam");
};

onMounted(async () => {
})
</script>

<style scoped>
.operation-bar {
    position: fixed;
    z-index: 3;
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
    color: var(--el-color-primary);
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
    color: var(--el-color-primary);
}

.material-symbols-outlined {
    margin-left: 20px;
    margin-right: 20px;
    color: var(--el-color-primary);
    font-size: 40px;
    font-variation-settings:
        'FILL' 0,
        'wght' 300,
        'GRAD' 0,
        'opsz' 24
}

.info-btn {
    margin-left: 20px;
}

.dialogPhotoParam {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
}
</style>
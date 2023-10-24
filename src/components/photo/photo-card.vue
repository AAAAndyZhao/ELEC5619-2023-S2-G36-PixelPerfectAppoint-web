<template>
    <div class="app-photo-card">
        <el-image :src="photo.thumbnailUrl" @load="handleImageLoad">
            <template #error>
                <div class="image-slot">
                    <el-icon><Picture /></el-icon>
                </div>
            </template>
        </el-image>
        <div class="app-info-bar" v-if="showInfoBar">
            <el-avatar class="app-owner-avatar" :src="photo.owner?.avatarUrl">
                <template #error>
                    <div class="image-slot">
                        <el-icon color="white"><Avatar /></el-icon>
                    </div>
                </template>
            </el-avatar>
            <div class="app-owner-info">
                <div class="app-owner-alias">{{ photo.owner.alias }}</div>
                <div class="app-owner-name">@{{ photo.owner.userName }}</div>
            </div>
            <el-icon class="app-to-detail-icon"><ArrowRightBold /></el-icon>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Picture, Avatar, ArrowRightBold } from '@element-plus/icons-vue';

const emits = defineEmits(["click"]);
// if image is not loaded, do not show info bar
const showInfoBar = ref(false);
const handleImageLoad = () => {
    showInfoBar.value = true;
}
const props = defineProps({
    photo: {
        type: Object,
        required: true,
    },
});


</script>

<style scoped>
.app-photo-card{
    width: 500px;
    margin: 0;
    float: left;
    overflow: hidden;
    &:hover {
        cursor: pointer;
        width: 502px;
    }
}

.el-image{
    width: 100%;
}
.app-info-bar{
    position: absolute;
    box-sizing: border-box;
    padding: 0 20px;
    bottom: -20%;
    left: 0;
    right: 0;
    min-height: 70px;
    height: 20%;
    background-color: rgba(0, 0, 0, 0);
    z-index: 1;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: nowrap;

    .app-owner-avatar{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #fff;
        margin-right: 10px;

        .el-icon{
            font-size: 40px;
        }
    }

    .app-owner-alias{
        font-size: 16px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
    }
    .app-owner-name{
        font-size: 14px;
    }
    .app-to-detail-icon{
        font-size: 20px;
        margin-left: auto;

        &:hover{
            color: rgba(255, 255, 255, 0.8);
        }
    }
}
/* when hover, .app-info-bar show from bottom with animation */
.app-photo-card:hover .app-info-bar{
    animation: show-info-bar 0.3s ease-in-out;
    animation-fill-mode: forwards;
    background-color: rgba(0, 0, 0, 0.5);
}
@keyframes show-info-bar {
    0% {
        bottom: -20%;
    }
    100% {
        bottom: 0;
    }
}


</style>
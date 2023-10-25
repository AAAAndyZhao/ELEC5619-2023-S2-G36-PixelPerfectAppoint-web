<template>
    <div v-show="visible" class="show-photo">
        <div class="app-photo-mask-layer">
            <el-icon class="close-btn" size="30" color="#ecf5ff" @click="closeClick">
                <CircleCloseFilled />
            </el-icon>
        </div>
        <PhotoImage class="img" :src="url" alt="Image failed to load!" />
        <PhotoViewerOperationBar class="app-photo-operation-bar" :photoName="photoName" :creator="creator" :displayedPhotoParam="displayedPhotoParam"/>
    </div>
</template>
  
<script >

import { ref, onMounted, watchEffect, watch } from "vue";
import PhotoImage from "@/components/photo/photo-image.vue";
import PhotoViewerOperationBar from "@/components/photo/photo-viewer-operation-bar.vue";

export default {
    props: {
        url: {
            type: String,
            default: "",
        },
        visible: {
            type: Boolean,
            default: false,
        },
        photoName: {
            type: String,
            default: "",
        },
        creator: {
            type: Object,
            default: () => ({}),
        },
        displayedPhotoParam: {
            type: Object,
            default: () => ({}),
        },
    },
    methods: {
        closeClick() {
            this.$emit("closeClick");
        },
    },
    components: {
        PhotoImage,
        PhotoViewerOperationBar,
    }
};
</script>


<style scoped>
.show-photo {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.show-photo .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgba(0, 0, 0, 0.6);
}

.show-photo .info-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    border-radius: 5px;
}

.show-photo .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    border-radius: 5px;
}

.show-photo .img {
    display: block;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    z-index: 2;
}</style>
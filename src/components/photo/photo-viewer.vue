<template>
    <div v-show="visible" class="show-photo">
        <div class="app-photo-mask-layer"></div>
        <ZoomablePhotoImage class="img" :src="url" alt="Image failed to load!" @keydown.esc="closeClick"/>
        <PhotoViewerOperationBar class="app-photo-operation-bar" :photoName="photoName" :creator="creator"
            :displayedPhotoParam="displayedPhotoParam" />
        <el-icon class="close-btn" size="30" color="#ecf5ff" @click="closeClick">
            <CircleCloseFilled />
        </el-icon>
    </div>
</template>
  
<script >

import { ref, onMounted, watchEffect, watch, onBeforeUnmount } from "vue";
// import PhotoImage from "@/components/photo/photo-image.vue";
import ZoomablePhotoImage from "./zoomable-photo-image.vue";
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
        handleKeydown(event) {
            if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
                this.closeClick();
            }
        },
    },
    components: {
        ZoomablePhotoImage,
        PhotoViewerOperationBar,
    },
    mounted() {
        document.addEventListener("keydown", this.handleKeydown);
    },
    beforeUnmount() {
        document.removeEventListener("keydown", this.handleKeydown);
    },
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
    position: fixed;  /* Changed from absolute to fixed */
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    z-index: 3;  /* Updated z-index to match operation bar layer */
}

.show-photo .img {
    display: block;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    z-index: 2;
}

/* provide transition for hover on close-btn with changing color*/
.show-photo .close-btn:hover {
    color: #fff;
    transition: all 0.5s ease-in-out;
}
</style>
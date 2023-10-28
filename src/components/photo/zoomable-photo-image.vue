<template>
    <div @wheel="handleWheel" @mousedown="handleMouseDown" @mouseup="handleMouseUp" class="zoomable-photo-image">
        <PhotoImage
            :style="{ transform: `scale(${scale}) translate(${x}px, ${y}px)`, cursor: dragging ? 'grabbing' : 'grab' }"
            :src="src" />
    </div>
</template>

<script>
import { ref, onMounted, watchEffect, watch } from "vue";
import PhotoImage from "@/components/photo/photo-image.vue";

export default {
    data() {
        return {
            scale: 1,
            x: 0,
            y: 0,
            dragging: false,
            startX: 0,
            startY: 0,
        }
    },
    props: {
        src: {
            type: String,
            default: "",
        },
    },
    methods: {
        handleWheel(evenet) {
            const delta = event.deltaY * -0.005;
            this.scale = Math.min(Math.max(this.scale + delta, 0.2), 7);
        },
        handleMouseMove(event) {
            if (!this.dragging) return;
            const dx = (event.clientX - this.startX) / this.scale;
            const dy = (event.clientY - this.startY) / this.scale;
            this.x = this.initialX + dx;
            this.y = this.initialY + dy;
        },
        handleMouseUp() {
            this.dragging = false;
            window.removeEventListener('mousemove', this.handleMouseMove);
            window.removeEventListener('mouseup', this.handleMouseUp);
        },
        handleMouseDown(event) {
            this.dragging = true;
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.initialX = this.x;
            this.initialY = this.y;
            window.addEventListener('mousemove', this.handleMouseMove);
        },
    },
    components: {
        PhotoImage,
    },
};
</script>
<style scoped>
:deep(.el-image__inner) {
    height: 100vh;
}
</style>
<template>
    <div @wheel="handleWheel" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
        <PhotoImage :style="{ transform: `scale(${scale}) translate(${x}px, ${y}px)`, cursor: dragging ?  'grabbing' : 'grab' }" :src="src" />
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
            this.x = event.clientX - this.startX;
            this.y = event.clientY - this.startY;
        },
        handleMouseUp() {
            this.dragging = false;
            window.removeEventListener('mousemove', this.handleMouseMove);
            window.removeEventListener('mouseup', this.handleMouseUp);
        },
        handleMouseDown(event) {
            this.dragging = true;
            this.startX = event.clientX - this.x;
            this.startY = event.clientY - this.y;
            window.addEventListener('mousemove', this.handleMouseMove);
        },
    },
    components: {
        PhotoImage,
    },
};
</script>
<template>
    <div class="app-photo-card">
        <img :src="photo.thumbnailUrl" width="100" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const emits = defineEmits(["click"]);
const props = defineProps({
    photo: {
        type: Object,
        required: true,
    },
    height: {
        type: Number,
        default: 300,
    },
    width: {
        type: Number,
        default: 300,
    },
});

const cardStyle = computed(() => {
    return {
        height: `${props.height}px`,
        width: `${props.width}px`,
    };
});

</script>

<style scoped>
.app-photo-card{
    height: auto;
    width: 30%;
    background-color: red;
    border-width: 2px;
    border-style: solid;
    border-color: black;
    box-sizing: border-box;
}
img{
    width: 100%;
    height: auto;
}
</style>
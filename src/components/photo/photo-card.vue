<template>
    <div class="app-photo-card">
        <img :src="photo.thumbnail" :height="height" :width="width" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

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


</script>

<style scoped>

</style>
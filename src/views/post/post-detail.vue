<template>
    <el-carousel indicator-position="outside" class="carousel">
        <el-carousel-item v-for="photo in postInfo?.photos" :key="photo.id">
            <img :src="photo.url" class="photo" @click.self="showBigImage($event)" />
        </el-carousel-item>
    </el-carousel>
    <BigImg :visible="photoVisible" :url="bigImgUrl" @click="closeBigImage"></BigImg>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BigImg from '../../components/photo/photo-viewer.vue';

const photoVisible = ref(false);
const bigImgUrl = ref('');
const photos = ref([]);
const props = defineProps({
    postInfo: {
        type: Object,
        required: false
    },
   
});


const showBigImage = (e) => {
    photoVisible.value = true;
    bigImgUrl.value = e.target.src;
};

const closeBigImage = () => {
    photoVisible.value = false;
};

</script>

<script>
import BigImg from '../../components/photo/photo-viewer.vue';
export default {
    components: {
        BigImg,
    },
};
</script>


<style scoped>
.photo {
    max-width: 100%;

    max-height: 100%;

    width: auto;

    height: auto;

}
</style>

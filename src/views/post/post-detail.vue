<template>
    <el-carousel indicator-position="outside" class="carousel">
        <el-carousel-item v-for="photo in photos" :key="photo.id">
            <img :src="photo.url" class="photo" @click.self="showBigImage($event)" />
        </el-carousel-item>
    </el-carousel>
    <BigImg :visible="photoVisible" :url="bigImgUrl" @click="closeBigImage"></BigImg>
</template>

<script>
import { ref, onMounted } from 'vue';
import BigImg from '../../components/photo/photo-viewer.vue';

export default {
    setup() {
        const photoVisible = ref(false);
        const bigImgUrl = ref('');
        const photos = ref([]);
        const showBigImage = (e) => {
            photoVisible.value = true;
            bigImgUrl.value = e.target.src;

        };
        const closeBigImage = () => {
            photoVisible.value = false;
        };
        onMounted(() => {
            const photosData = [
                { id: 1, url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg' },
                { id: 2, url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg' },
            ];
            photos.value = photosData;
        });

        return {
            photoVisible,
            bigImgUrl,
            photos,
            showBigImage,
            closeBigImage,
        };
    },
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

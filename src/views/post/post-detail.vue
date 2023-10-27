<template>
    <el-carousel indicator-position="outside" class="carousel">
        <el-carousel-item v-for="photo in postInfo?.photos" :key="photo.id">
            <img :src="photo.thumbnailUrl" :photo-id="photo.id" class="photo" @click.self="showBigImage($event)" />
        </el-carousel-item>
    </el-carousel>
    <PhotoViewer :url="displayedPhoto.url"
        :visible="photoVisible"
        :photoName="displayedPhoto.name"
        :creator="postInfo.author"
        :photoId="displayedPhoto.id"
        v-if="photoVisible"
        @closeClick="closeBigImage" class="app-profile-portfolio-viewer"/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PhotoViewer from '../../components/photo/photo-viewer.vue';

const photoVisible = ref(false);
const props = defineProps({
    postInfo: {
        type: Object,
        required: false
    }
});

const displayedPhoto = ref(null);

const showBigImage = (e) => {
    const photoId = e.target.getAttribute('photo-id');
    console.log(e.target)
    console.log(e.target.getAttribute('photo-id'))
    const photo = props.postInfo?.photos.find((photo) => photo.id === photoId);
    displayedPhoto.value = photo;
    photoVisible.value = true;
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
    height: 100%;
}
</style>

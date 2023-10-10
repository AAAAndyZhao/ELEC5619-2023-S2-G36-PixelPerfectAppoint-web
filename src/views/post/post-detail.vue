<template>
    <el-carousel indicator-position="outside" class = "carousel">
        <el-carousel-item v-for="photo in photos" :key="photo.id">
            <img :src="photo.url" class="photo" @click.self="showBigImage($event)" />
        </el-carousel-item>
    </el-carousel>
    <BigImg
      :visible="photoVisible"
      :url="bigImgUrl"
      @click="closeBigImage"
    ></BigImg>
</template>

<script>
import { ref, onMounted } from 'vue';
import BigImg from '../../components/photo/photo-viewer.vue';

export default {
  setup() {
    // 在 setup 函数中设置数据和方法

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
      // 在 onMounted 钩子中初始化照片数据
        const photosData = [
            { id: 1, url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg' },
            { id: 2, url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg' },
            // 添加更多照片...
        ];
        photos.value = photosData;
    });

    // 在 setup 函数中返回数据和方法
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
  max-width: 100%; /* 图片最大宽度为走马灯容器的宽度 */
  max-height: 100%; /* 图片最大高度为走马灯容器的高度 */
  width: auto; /* 自动调整宽度 */
  height: auto; /* 自动调整高度 */
}


</style>

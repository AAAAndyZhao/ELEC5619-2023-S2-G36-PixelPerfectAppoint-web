<template>
    <div class="post-info">
        <h1 class="post-title"> {{ postInfo.title }} </h1>
        <p class="post-date"> {{ postInfo.createdate }} </p>
    </div>
</template>

<script setup lang = 'ts'>
import{ref} from 'vue'
interface PostInfo{
    title: string;
    createdate: string;
}
const postInfo = ref<PostInfo>({
    title: '不会有人不看吧',
    createdate: '2021-07-01 12:00:00',
});
</script>


<style scoped>
.post-title{
    font-size: 20px;
    font-weight: 500;
    text-align: left;
}
.post-date{
    font-size: 12px;
    color: #999;
    text-align: left;
}
</style>
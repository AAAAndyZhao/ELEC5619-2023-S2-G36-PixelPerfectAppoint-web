<template>
    <el-contrainer class="app-container">
        <el-header class="app-header">
            <router-view name="header" />
        </el-header>
        <el-main class="app-main">
            <div class="tools">
                <el-button type="info" class="back" @click="backTo" icon="DArrowLeft" round></el-button>
            </div>
            <el-card class="app-main-post-title">
                <router-view name="title" :postInfo="postInfo" />
            </el-card>
            <el-card class="app-main-post-photo">
                <router-view name="content" :postInfo="postInfo"/>
            </el-card>
            <el-card>
                <like theme="filled" size="30" :fill="isLiked ? '#ff0000' : '#333'" @click="toggleLike" />
            </el-card>

            <el-card class="app-main-user-info">
                <div>
                    <router-view name="info" :user="userInfo" />
                </div>
            </el-card>
            <el-card class="app-main-post-description">
                <router-view name="description" :postInfo="postInfo"/>
            </el-card>
            <el-card>
                <router-view name="comment" />
            </el-card>

        </el-main>
    </el-contrainer>
</template>

<script setup>

import { ElCard } from 'element-plus';
import router from '../router'
import { Like } from '@icon-park/vue-next'
import { ref, onMounted } from 'vue';
import userApi from '../services/user-api';
import postApi from '../services/post-api';

const userInfo = ref([])
const postInfo = ref([])
const isLiked = ref(false);
const userId = localStorage.getItem('userId');


const getPostDetail = async () => {
    let path = window.location.pathname;
    let parts = path.split('/');
    let postId = parts[parts.length - 1];
    try {
        const res = await postApi.getPostDetail(postId);
        
        if (res.code === 0) {
            userInfo.value=res.data[0].author;
            postInfo.value = res.data[0];
            console.log('userInfo',userInfo.value)
            console.log('postInfo',res.data[0])
        }

    }
    catch (e) {
        console.log(e);
    }

}
const toggleLike = () => {
    isLiked.value = !isLiked.value;
};

const backTo = () => {
    router.back();
};

onMounted(() => {
    
    getPostDetail();
});








</script>
<style scoped>
.app-container {
    display: block;
    height: 100%;
}

.app-main-post-title {
    border: none !important;
    box-shadow: none !important;
}

.tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.post-comment {
    margin-top: 20px;
}

.app-main-user-info {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    margin-top: 10px;
    margin-bottom: 10px;
    box-shadow: none !important;

}

.post-info-detail {
    display: flex;
    margin-top: 1px;
    border: none !important;
    margin-top: 10px;

}

.post-like {
    display: flex;
    border: none !important;
    box-shadow: none !important;

}

.post-info {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    box-shadow: none !important;
}

.app-main-post-photo {
    border: none !important;
}

.app-main-post-description {
    border: none !important;
    box-shadow: none !important;
}
</style>
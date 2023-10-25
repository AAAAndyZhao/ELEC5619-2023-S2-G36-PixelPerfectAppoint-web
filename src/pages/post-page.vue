<template>
    <el-contrainer class="app-container">
        <el-header class="app-header">
            <router-view name="header" />
        </el-header>
        <el-main class="app-main">

            <el-card class="app-main-post-title">
                <router-view name="title" :postInfo="postInfo" />
            </el-card>
            <el-card class="app-main-post-photo">
                <router-view name="content" :postInfo="postInfo" />
            </el-card>
            <el-card class="app-main-post-tools">
                <el-button type="text" @click="toggleLike">
                    <like class="tool-icon" theme="outline" size="30" fill="#333" v-if="isLiked" />
                    <like class="tool-icon" theme="filled" size="30" fill="#d60000" v-if="!isLiked" />
                </el-button>
                <el-button type="text" @click="focusOnNestedChildInput">
                    <comment class="tool-icon" theme="outline" size="30" fill="#333" />
                </el-button>
                <el-button type="text" @click="getCurrentUrl"> <share-three class="tool-icon" theme="outline" size="30"
                        fill="#333" /></el-button>
            </el-card>

            <el-card class="app-main-user-info">
                <div>
                    <router-view name="info" :user="userInfo" />
                </div>
            </el-card>
            <el-card class="app-main-post-description">
                <router-view name="description" :postInfo="postInfo" />
            </el-card>
            <el-card class="app-main-post-review">
                <router-view name="comment" :parentData="data" />
            </el-card>

        </el-main>
    </el-contrainer>
</template>

<script setup>

import { ElCard } from 'element-plus';
import router from '../router'
import { Like, Comment, ThumbsUp, ShareThree } from '@icon-park/vue-next'
import { ref, onMounted, watch } from 'vue';
import userApi from '../services/user-api';
import postApi from '../services/post-api';

const userInfo = ref([])
const postInfo = ref([])
const isLiked = ref(false);
const userId = localStorage.getItem('userId');
const data = ref(false)
const commentDate = ref([])
const focusOnNestedChildInput = () => {
    data.value = !data.value;
};
watch(data, (newValue, oldValue) => {

});
const getPostDetail = async () => {
    let path = window.location.pathname;
    let parts = path.split('/');
    let postId = parts[parts.length - 1];
    try {
        const res = await postApi.getPostDetail(postId);

        if (res.code === 0) {
            userInfo.value = res.data[0].author;
            postInfo.value = res.data[0];
            console.log('userInfo', userInfo.value)
            console.log('postInfo', res.data[0])
        }

    }
    catch (e) {
        console.log(e);
    }

}
const toggleLike = () => {
    isLiked.value = !isLiked.value;
};
const getCurrentUrl = () => {
    let url = window.location.href;
    console.log(url);
    navigator.clipboard.writeText(url).then(() => {
        alert('url copied, you can share it now');
    })
        .catch(err => {
            console.log('Something went wrong', err);
        });
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


.post-info {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    box-shadow: none !important;
}

.app-main-post-photo {
    border: none !important;
}

.app-main-post-tools {

    border-left: none !important;
    border-right: none !important;
    box-shadow: none !important;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-top: 20px;
}

.tool-icon {
    margin-left: 20px;

}

.app-main-post-description {
    margin-top: 20px;

}

.app-main-post-review {
    margin-top: 20px;

}
</style>
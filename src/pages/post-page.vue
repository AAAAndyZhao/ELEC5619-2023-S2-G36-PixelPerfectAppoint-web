<template>
    <el-container class="app-container">
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
                <el-button link @click="toggleLike">
                    <like class="tool-icon" theme="outline" size="30" fill="#333" v-if="!isLiked" />
                    <like class="tool-icon" theme="filled" size="30" fill="#d60000" v-if="isLiked" />
                    <el-text>{{ postInfo.likeCount }}</el-text>
                </el-button>
                <el-button link @click="focusOnNestedChildInput">
                    <comment class="tool-icon" theme="outline" size="30" fill="#333" />
                </el-button>
                <el-button link @click="getCurrentUrl"> <share-three class="tool-icon" theme="outline" size="30"
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
    </el-container>
</template>

<script setup>

import { ElCard, ElMessage, ElNotification } from 'element-plus';
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
let path = window.location.pathname;
let parts = path.split('/');
let postId = parts[parts.length - 1];
const likeData = {
    post_id: postId,
    uid: userId
};
const focusOnNestedChildInput = () => {
    data.value = !data.value;
};
watch(data, (newValue, oldValue) => {

});
const getPostDetail = async () => {
    try {
        const res = await postApi.getPostDetail(postId);
        if (res.code === 0) {
            userInfo.value = res.data[0].author;
            postInfo.value = res.data[0];
        }

    }
    catch (e) {
        console.log(e);
    }

}

const checkLiked = async () => {
    if (!userId) {
        return;
    }
    try {
        const res = await postApi.checkLikePost(likeData);
        if (res.code === 0) {
            isLiked.value = true;
        } else {
            isLiked.value = false;
        }
    } catch (e) {
        console.log('Error checking like:', e);

    }
};

const toggleLike = async () => {
    if (isLiked.value) {
        try {
            const res = await postApi.unlikePost(likeData);
            if (res.code === 0) {
                isLiked.value = false;
                postInfo.value.likeCount--;
                ElMessage.success('Unliked');
            } else {
                console.log('Error unliking post:', res.message);
            }
        } catch (e) {
            console.log('Error unliking post:', e);
        }
    } else {
        try {
            const res = await postApi.likePost(likeData);
            if (res.code === 0) {
                isLiked.value = true;
                postInfo.value.likeCount++;
                ElMessage.success('Liked');
            } else {
                console.log('Error liking post:', res.message);
            }
        } catch (e) {
            console.log('Error liking post:', e);
        }
    }
};
const getCurrentUrl = () => {
    let url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        ElNotification({
            title: 'Success',
            message: 'Copied to clipboard',
            type: 'success'
        });
    }).catch(err => {
        console.log('Something went wrong', err);
    });
};


onMounted(() => {
    checkLiked();

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
<template>
    <div class="app-photo-detail">
        <div class="app-title">
            <el-tag>{{ photoDetail?.photoCategory?.name }}</el-tag>
            <h2>{{ photoDetail?.name }}</h2>
        </div>
        <div class="app-publish-time">
            <el-text type="info">
                Published at {{ dayjs(photoDetail?.uploadDatetime).format('YYYY-MM-DD HH:mm:ss') }}
            </el-text>
        </div>
        <div class="app-photo-image-container">
            <el-image :src="photoDetail?.url" fit="cover" @click="photoViewerVisible = true" />
        </div>
        <operation-bar :likeCount="photoDetail?.likeCount" :is-user-liked="isUserLiked" @like="handleLike"
            @unlike="handleUnlike" @focus-input="focusCommentBox = true" />
        <el-card shadow="never" class="app-user-card">
            <user-info-detail v-if="photoDetail" :user="photoDetail?.owner" :showMessageButton="true"
                :showFollowOption="true" />
        </el-card>
        <photo-viewer v-if="photoViewerVisible" :visible="photoViewerVisible" :url="photoDetail?.url"
            :photo-name="photoDetail?.name" :creator="photoDetail?.owner" :displayed-photo-param="photoDetail?.photoParam"
            :photo-id="photoDetail?.id" @closeClick="photoViewerVisible = false" />

        <el-card shadow="never" class="app-comment-card">
            <comment-box v-if="photoDetail" :photo-id="photoDetail?.id" :focus-input="focusCommentBox"
                @add-review="handleAddRootReview" />
            <div class="comment-list" v-for="comment in comments" :key="comment.id">
                <div class="comment-list-root">
                    <comment-item :comment="comment" @add-sub-review="addSubReview"></comment-item>
                </div>
                <div v-if="comment.children" class="sub-comment-list-root" v-for="subcomment in comment.children"
                    :key="subcomment.id">
                    <comment-item :comment="subcomment" @add-sub-review="addSubReview"></comment-item>
                </div>
                <div class="load-more-subComments">
                    <el-button v-if="comment.hasMoreSubComments" @click="loadMoreSubComments(comment.reviewNo)"
                        class="load-more-subComments" link type="primary">Load more</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import photoApi from '@/services/photo-api';
import reviewApi from '@/services/review-api';
import router from '@/router';
import PhotoViewer from '@/components/photo/photo-viewer.vue';
import UserInfoDetail from '@/components/user/user-info-detail.vue';
import CommentBox from '@/components/comment/photo/comment-box.vue';
import OperationBar from '@/components/comment/photo/operation-bar.vue';
import CommentItem from '@/components/comment/photo/comment-item.vue';

const props = defineProps({
    photoId: {
        type: String,
        required: false
    }
})
const currentUserId = localStorage.getItem('userId');
const photoViewerVisible = ref(false);
const photoDetail = ref(null)
const focusCommentBox = ref(false);
const isUserLiked = ref(false);

const comments = ref([]);

const fetchPhotoDetail = async () => {
    try {
        const res = await photoApi.getPhotoById(props.photoId);
        console.log(res)
        if (res.code === 0 && res.data.length > 0) {
            photoDetail.value = res.data[0];
        } else {
            // 404
            router.push('/404')
        }
    } catch (error) {
        console.error(error)
        router.push('/404')
    }
}

const fetchPhotoReviews = async (parentReviewNo, page = 1, size = 5) => {
    try {
        const res = await reviewApi.getPhotoReviewList({
            photoId: props.photoId,
            parentReviewNo,
            page,
            size
        });
        console.log(res)
        if (res.code === 0) {
            if (!comments.value || comments.value.length === 0) {
                comments.value = res.data;
                return;
            }
            // for (const comment of comments.value) {
            //     const foundComment = res.data.find((item) => item.reviewNo === comment.reviewNo);
            //     if (foundComment) {
            //         comment.subComments = foundComment.subComments;
            //         comment.hasMoreSubComments = foundComment.hasMoreSubComments;
            //         comment.subCommentsLoaded = true;
            //     }
            // }
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        console.error(error)
    }
}

const handleAddRootReview = async (reviewData) => {
    try {
        const res = await reviewApi.addPhotoReview(reviewData);
        if (res.code === 0) {
            ElMessage.success('Commented');
            fetchPhotoReviews()
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        console.error(error)
    }
}

const addSubReview = async ({ content, replyTo }) => {
    console.log(content, replyTo)
    try {
        const res = await reviewApi.addPhotoReview({
            content,
            reply_to: replyTo,
            photo_id: props.photoId,
            uid: currentUserId
        });
        if (res.code === 0) {
            ElMessage.success('Commented');
            fetchPhotoReviews()
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        console.error(error)
    }
}

const handleLike = async () => {
    try {
        const res = await photoApi.photoLike(props.photoId);
        if (res.code === 0) {
            ElMessage.success('Liked');
            photoDetail.value.likeCount++;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        console.error(error)
        ElMessage.error(error.message);
    }
}

const handleUnlike = async () => {
    try {
        const res = await photoApi.photoUnlike(props.photoId);
        if (res.code === 0) {
            ElMessage.success('Unliked');
            photoDetail.value.likeCount--;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        console.error(error)
        ElMessage.error(error.message);
    }
}
const checkUserLikeStatus = async () => {
    try {
        const res = await photoApi.photoCheckLike(props.photoId);
        console.log(res)
        if (res.code === 0) {
            isUserLiked.value = true;
        } else {
            isUserLiked.value = false;
        }
    } catch (error) {
        console.error(error)
    }
}
onMounted(async () => {
    if (props.photoId) {
        await fetchPhotoDetail();
        await fetchPhotoReviews(0);
        await checkUserLikeStatus();
    } else {
        // 404
        router.push('/404')
    }
})
</script>

<style scoped>
.app-photo-detail {
    margin: 0 auto;
    padding-bottom: 50px;
    width: 70%;
    box-sizing: border-box;
}

.app-photo-detail .app-title {
    margin-left: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    gap: 20px;
}

.app-publish-time {
    text-align: left;
    margin-left: 20px;
}

.app-photo-image-container {
    margin-top: 20px;
    width: 100%;
}

.app-photo-image-container .el-image {
    width: 80%;
    height: auto;
    cursor: pointer;
}

.app-user-card {
    width: 100%;
    margin-top: 20px;
}

.app-comment-card {
    width: 100%;
    margin: 20px 0;
}
.sub-comment-list-root {
    margin-left: 50px;
}
</style>
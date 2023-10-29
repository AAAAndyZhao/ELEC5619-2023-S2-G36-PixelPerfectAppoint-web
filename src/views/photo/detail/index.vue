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
        <el-card shadow="never" class="app-photo-description">
            <el-text type="info" class="app-photo-description-text">
                {{ photoDetail?.description }}
            </el-text>
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
                    link type="primary">Load more</el-button>
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

const fetchPhotoReviews = async (parentReviewNo, page = 1, size = 10) => {
    try {
        const res = await reviewApi.getPhotoReviewList({
            photoId: props.photoId,
            parentReviewNo,
            page,
            size
        });
        if (res.code === 0) {
            if (!comments.value || comments.value.length === 0) {
                // first time, load all root comments with at most 3 sub comments
                comments.value = res.data;
                comments.value.forEach((comment) => {
                    if (comment.children.length >= 3) {
                        comment.hasMoreSubComments = true;
                    } else {
                        comment.hasMoreSubComments = false;
                    }
                });
                return;
            }
            // not the first time, reload root comments and merge sub comments (not delete the loaded ones)
            const newComments = res.data;
            if (parentReviewNo === 0) {
                // root comments
                for (const newComment of newComments) {
                    // in a specific photo, reviewNo is unique and large no. is newer
                    const foundRootComment = comments.value.find((item) => item.reviewNo === newComment.reviewNo);
                    if (foundRootComment) {
                        // merge children, not replace
                        for (const subComment of newComment.children) {
                            const foundSubComment = foundRootComment.children.find((item) => item.reviewNo === subComment.reviewNo);
                            if (!foundSubComment) {
                                foundRootComment.children.push(subComment);
                            }
                        }
                    } else {
                        // new root comment
                        comments.value.push(newComment);
                    }
                }

            } else {
                // return sub comments
                const foundComment = comments.value.find((item) => item.reviewNo === parentReviewNo);
                if (foundComment) {
                    if (newComments.length < size) {
                        foundComment.hasMoreSubComments = false;
                    } else {
                        foundComment.hasMoreSubComments = true;
                    }
                    // merge children, not replace
                    for (const subComment of newComments) {
                        const foundSubComment = foundComment.children.find((item) => item.reviewNo === subComment.reviewNo);
                        if (!foundSubComment) {
                            foundComment.children.push(subComment);
                        }
                    }
                } else {
                    // an unexpected condition which should not happen
                    console.error('Unexpected condition: cannot find parent comment');
                }
            }
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
            // calculate the page and size
            const page = Math.floor(comments.value.length / 10) + 1;
            const size = 10;
            fetchPhotoReviews(0, page, size)
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        console.error(error)
    }
}

const addSubReview = async ({ content, replyTo, parentReviewNo }) => {
    try {
        const res = await reviewApi.addPhotoReview({
            content,
            reply_to: replyTo,
            photo_id: props.photoId,
            uid: currentUserId
        });
        if (res.code === 0) {
            ElMessage.success('Commented');
            // calculate the page and size
            const rootComment = comments.value.find((item) => item.reviewNo === parentReviewNo);
            if (!rootComment.children) {
                rootComment.children = [];
            }
            const page = Math.floor(rootComment.children.length / 10) + 1;
            const size = 10;
            fetchPhotoReviews(parentReviewNo, page, size)
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
    if (!currentUserId) {
        return;
    }
    try {
        const res = await photoApi.photoCheckLike(props.photoId);
        if (res.code === 0) {
            isUserLiked.value = true;
        } else {
            isUserLiked.value = false;
        }
    } catch (error) {
        console.error(error)
    }
}
const loadMoreSubComments = (parentReviewNo) => {
    // calculate the page and size
    const rootComment = comments.value.find((item) => item.reviewNo === parentReviewNo);
    const page = Math.floor(rootComment.children.length / 10) + 1;
    const size = 10;
    fetchPhotoReviews(parentReviewNo, page, size);
}
onMounted(async () => {
    if (props.photoId) {
        await fetchPhotoDetail();
        await fetchPhotoReviews(0, 1, 10);
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
.app-photo-description {
    margin-top: 20px;
    padding: 10px;
    box-sizing: border-box;
    text-align: left;
}
.app-photo-description-text {
    white-space: pre-wrap;
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
.load-more-subComments{
    text-align: left;
    box-sizing: border-box;
    padding-left: 50px;
}
</style>
<template>
    <CommentBox :middleValue="parentData" @data-uploaded="refreshCommentList"></CommentBox>
    <div class="comment-list" v-for="comment in comments" :key="comment.id">
        <div class="comment-list-root">
            <CommentList :comment="comment" @data-uploaded="refreshCommentList"></CommentList>
        </div>
        <div v-if="comment.subComments" class="sub-comment-list-root" v-for="subcomment in comment.subComments"
            :key="subcomment.id">
            <CommentList :comment="subcomment" @data-uploaded="refreshCommentList"></CommentList>
        </div>
        <div class="load-more-subComments">
            <el-button v-if="comment.hasMoreSubComments" @click="loadMoreSubComments(comment.reviewNo)"
                class="load-more-subComments" text type="primary">Load more</el-button>
        </div>
    </div>
    <el-button v-if="hasMoreComments" @click="loadMoreComments" text type="primary">load more review</el-button>
    <p v-else>All reviews have been loaded.</p>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import CommentBox from '../../components/comment/comment-box.vue';
import CommentList from '../../components/comment/comment-item.vue';
import reviewApi from '../../services/review-api';

const props = defineProps(['parentData']);
const comments = ref([]);
const page = ref(1);
const hasMoreComments = ref(true);

const getCommentList = async (loadMore = false) => {
    let path = window.location.pathname;
    let parts = path.split('/');
    let postId = parts[parts.length - 1];
    const reviewData = {
        post_id: postId,
        parent_review_no: 0,
        page: page.value,
        size: 4
    };

    try {
        const mainCommentsRes = await reviewApi.getReviewList(reviewData);
        if (mainCommentsRes.code === 0) {
            if (loadMore) {
                comments.value = [...comments.value, ...mainCommentsRes.data];
            } else {
                comments.value = mainCommentsRes.data;
            }

            if (mainCommentsRes.data.length < reviewData.size) {
                hasMoreComments.value = false;
            } else {
                hasMoreComments.value = true;
            }

            const subCommentsPromises = comments.value.map(async (comment) => {
                const subCommentsRes = await reviewApi.getReviewList({
                    post_id: postId,
                    parent_review_no: comment.reviewNo,
                    page: 1,
                    size: 3
                });

                if (subCommentsRes.code === 0) {
                    comment.subComments = subCommentsRes.data;
                    comment.hasMoreSubComments = subCommentsRes.data.length >= 3;
                }
            });

            await Promise.all(subCommentsPromises);
        }
    } catch (e) {
        console.log(e);
    }
};
const subCommentsPages = ref({});

const loadMoreSubComments = async (parentReviewNo) => {
    if (!subCommentsPages.value[parentReviewNo]) {
        subCommentsPages.value[parentReviewNo] = 1; 
    }

    let path = window.location.pathname;
    let parts = path.split('/');
    let postId = parts[parts.length - 1];

    const subCommentsRes = await reviewApi.getReviewList({
        post_id: postId,
        parent_review_no: parentReviewNo,
        page: subCommentsPages.value[parentReviewNo] + 1, 
        size: 3
    });

    if (subCommentsRes.code === 0) {
        const mainComment = comments.value.find(comment => comment.reviewNo === parentReviewNo);
        if (mainComment) {
            mainComment.subComments = [...mainComment.subComments, ...subCommentsRes.data];

            if (subCommentsRes.data.length < 10) {
                mainComment.hasMoreSubComments = false;
            } else {
                mainComment.hasMoreSubComments = true;
                subCommentsPages.value[parentReviewNo]++;
            }
        }
    }
}

const refreshCommentList = () => {
    comments.value = [];
    page.value = 1; 
    getCommentList();
}

const loadMoreComments = () => {
    page.value++;
    getCommentList(true);
}

onMounted(() => {
    getCommentList();
});
</script>

<style scoped>
.comment-list {
    margin-top: 20px;
}

.sub-comment-list-root {
    padding-left: 72px;
    margin-top: 10px;
}

.load-more-subComments {
    text-align: left;
    margin-left: 10px;
}
</style>

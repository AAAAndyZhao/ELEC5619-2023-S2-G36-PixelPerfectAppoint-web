<template>
    <CommentBox :middleValue="parentData" @data-uploaded="refreshCommentList"></CommentBox>
    <div class="comment-list" v-for="comment in displayedComments" :key="comment.id">
        <div class="comment-list-root">
            <CommentList :comment="comment" @data-uploaded="refreshCommentList" ></CommentList>
        </div>
        <div v-if="comment.subComments" class="sub-comment-list-root" v-for="subcomment in comment.displayedSubComments"
            :key="subcomment.id" >
            <CommentList :comment="subcomment" @data-uploaded="refreshCommentList" ></CommentList>
        </div>
        <div class="load-more-subComments">
            <el-button v-if="comment.canLoadMoreSubComments" @click="loadMoreSubComments(comment)" text>load more
                replies</el-button>
        </div>

    </div>
    <div>
        <el-button v-if="canLoadMoreComment" @click="loadMoreComment">load more comments</el-button>
    </div>
</template>
<script setup >
import { ref,defineProps,watch,onMounted } from 'vue'
import CommentBox from '../../components/comment/comment-box.vue'
import CommentList from '../../components/comment/comment-item.vue'
import reviewApi from '../../services/review-api'
const props = defineProps(['parentData']);
watch(() => props.parentData, (newValue, oldValue) => {
  
});
const initializeSubComments = (comment) => {
    if (comment.subComments) {
        comment.displayedSubComments = comment.subComments.splice(0, subCommentsPerPage);
        comment.canLoadMoreSubComments = comment.subComments.length > 0;
    }
};



const comments = ref([
])



const displayedComments = ref([]);
const commentsPerPage = 5;
const canLoadMoreComment = ref(comments.value.length > 0);
const loadMoreComment = () => {
    const moreComments = comments.value.splice(0, commentsPerPage);
    moreComments.forEach(comment => {
        initializeSubComments(comment);
    });
    displayedComments.value = [...displayedComments.value, ...moreComments];
    canLoadMoreComment.value = comments.value.length > 0;
}

const subCommentsPerPage = 5;
const loadMoreSubComments = (comment) => {
    if (comment.subComments) {
        const moreSubComments = comment.subComments.splice(0, subCommentsPerPage);
        if (comment.displayedSubComments) {
            comment.displayedSubComments = [...comment.displayedSubComments, ...moreSubComments];
        }
        comment.canLoadMoreSubComments = comment.subComments.length > 0;
    }
}
const getCommentList = async () => {
    let path = window.location.pathname;
    let parts = path.split('/');
    let postId = parts[parts.length - 1];
    const reviewData = {
        post_id: postId,
        reply_to: 0,
        page: 1,
        size: 10
    };
    try {
        const mainCommentsRes = await reviewApi.getReviewList(reviewData);
        if (mainCommentsRes.code === 0) {
            comments.value = mainCommentsRes.data;

            // 使用Promise.all获取所有主评论的子评论
            const subCommentsPromises = comments.value.map(async (comment) => {
                const subCommentsRes = await reviewApi.getReviewList({
                    post_id: postId,
                    reply_to: comment.reviewNo,  // 使用正确的评论标识符
                    page: 1,
                    size: 10
                });
                if (subCommentsRes.code === 0) {
                    comment.subComments = subCommentsRes.data;
                }
            });
            
            // 等待所有子评论的获取操作完成
            await Promise.all(subCommentsPromises);

            loadMoreComment();
        }
    } catch (e) {
        console.log(e);
    }
};


loadMoreComment();
const refreshCommentList = () => {
    displayedComments.value = [];
    getCommentList();
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
    margin-left: 60px;

}</style>
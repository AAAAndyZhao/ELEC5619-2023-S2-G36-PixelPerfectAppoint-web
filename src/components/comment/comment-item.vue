<template>
    <div class="comment-container">
        <el-avatar :src=comment?.author.avatarUrl :size="50"></el-avatar>
        <div class="comment-detail">
            <div class="comment-name">
                <el-link :underline="false">{{ comment?.author.alias }}</el-link>
                <span v-if="comment?.replyToUser">
                    @ <el-link :underline="false">{{ comment?.replyToUser.alias }}</el-link>
                </span>
            </div>
            <div class="comment-comment">
                <span>{{ comment?.content }}</span>
            </div>
            <div class="comment-info">
                <div class="comment-info-time">
                    <span>{{ comment?.createdAt }}</span>
                </div>
                <div class="comment-info-reply">
                    <el-button link :underline="false" size="small" @click="clickReply"
                    type="primary">Reply</el-button>
                </div>

            </div>
        </div>
    </div>
    <CommentBox v-if="showSubCommentBox" :replyTo="comment?.reviewNo" @data-uploaded="refreshCommentList"></CommentBox>
</template>

<script setup >
import { defineProps, ref } from 'vue';
import CommentBox from '../../components/comment/sub-comment-box.vue'
const emits = defineEmits(['data-uploaded']);
const showSubCommentBox = ref(false);
const refreshCommentList = () => {
    emits('data-uploaded');
}
const clickReply = () => {
    showSubCommentBox.value = !showSubCommentBox.value;
}
const props = defineProps({
    comment: {
        type: Object,
        required: false,
    }
});

</script>

<style scoped>
.comment-container {
    display: flex;

}

.comment-detail {
    margin-left: 10px;
    position: relative;
}

.comment-name {
    text-align: left;
    font-size: 13px;
}

.comment-comment {
    text-align: left;
    font-size: 15px;
    line-height: 24px;
}

.comment-info {
    display: flex;
    font-size: 12px;
    align-items: center;
}

.comment-info-reply {
    margin-left: 30px;
}

.comment-info-time {
    color: var(--el-color-info-light-5)
}
</style>
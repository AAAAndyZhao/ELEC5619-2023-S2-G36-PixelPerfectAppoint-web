<template>
    <div class="app-comment-item">
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
        <div v-if="showSubCommentBox" class="app-sub-comment-box">
            <el-input v-model="inputContent" placeholder="Add a comment" ref="commentInputRef"
            @focus="showButtons = true"/>
            <div v-if="showButtons" class="app-post-buttons">
                <el-button :disabled="!inputContent" @click="postComment" round>
                    Post
                </el-button>
                <el-button text @click="cancel">
                    Cancel
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup >
import { defineProps, ref } from 'vue';

const props = defineProps({
    comment: {
        type: Object,
        required: false,
        default: () => {}
    }
});

const emits = defineEmits(['add-sub-review']);

const showSubCommentBox = ref(false);
const inputContent = ref('');
const commentInputRef = ref(null);
const showButtons = ref(false);

const postComment = () => {
    emits('add-sub-review', {
        content: inputContent.value,
        replyTo: props.comment?.reviewNo
    });
    inputContent.value = '';
    showButtons.value = false;
}

const clickReply = () => {
    showSubCommentBox.value = !showSubCommentBox.value;
}

const cancel = () => {
    inputContent.value = '';
    showButtons.value = false;
}
</script>

<style scoped>
.app-comment-item {
    margin: 15px 0;
}
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

.app-sub-comment-box {
    margin-top: 10px;
}

.app-post-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end
}
</style>
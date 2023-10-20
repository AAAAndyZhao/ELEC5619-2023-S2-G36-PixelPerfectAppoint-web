<template>
    <div class="comment-container">
        <el-avatar :src=comment?.avatar :size="70"></el-avatar>
        <div class="comment-detail">
            <div class="comment-name">
                <el-link :underline="false">{{ comment?.userName }}</el-link>
            </div>
            <div class="comment-comment">
                <span>{{ comment?.content }}</span>
            </div>
            <div class="comment-info">
                <div class="comment-info-time">
                    <span>{{ comment?.commentDate }}</span>
                </div>
                <div class="comment-info-reply">
                    <el-link :underline="false">Reply</el-link>
                </div>

            </div>
        </div>


    </div>
</template>

<script setup lang = 'ts'>
import { defineProps } from 'vue';

const props = defineProps({
    comment: Object as () => ({
        userName: string,
        content: String,
        avatar: String
        commentDate: String
    })
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

}

.comment-info-reply {
    margin-left: 60px;
}</style>
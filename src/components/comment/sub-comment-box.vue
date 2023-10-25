<template>
    <div>
        <div class="post-comment">
            <el-input id="comment-input" v-model="inputContent" placeholder="Add a comment" ref="commentInput"
                @focus="showButtons = true"></el-input>
        </div>
    </div>
    <div v-if="showButtons" class="post-buttons">
        <el-button :disabled="!inputContent" @click="post" round>
            post
        </el-button>
        <el-button text @click="cancel">
            cancel
        </el-button>
    </div>
</template>
<script setup >
import { ref, defineProps, computed, watch, onMounted } from 'vue'
import reviewApi from '../../services/review-api'
import userApi from '../../services/user-api'
const inputContent = ref('');
const showButtons = ref(false);
const commentInput = ref('');
const emits = defineEmits(['data-uploaded']);
const props = defineProps(['replyTo']);

const post = async () => {
    try {
        const userId = localStorage.getItem('userId');
        let path = window.location.pathname;
        let parts = path.split('/');
        let postId = parts[parts.length - 1];
        const reviewData = {
            content: inputContent.value,
            post_id: postId,
            uid: userId,
            reply_to: props.replyTo
        }
        console.log("zhegeshi子评论发出的数据", reviewData);
        const response = await reviewApi.addReview(reviewData);
        if (response.code === 0) {
            inputContent.value = '';
            showButtons.value = false;
            emits('data-uploaded');
        }

    } catch (e) {

        inputContent.value = '';
        showButtons.value = false;
    }
};

const cancel = () => {
    inputContent.value = '';
    showButtons.value = false;
};

</script>

<style scoped>
.post-comment {
    display: flex;
}

.post-buttons {
    margin-top: 6px;
    display: flex;
    justify-content: flex-end
}
</style>
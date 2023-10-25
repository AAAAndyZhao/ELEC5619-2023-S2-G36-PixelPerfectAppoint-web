<template>
    <div>
        <div class="post-comment">
            <el-avatar :src=userAvatarUrl :size="70"></el-avatar>
            <el-input class="post-comment-input" id="comment-input" v-model="inputContent" placeholder="Add a comment" ref="commentInput"
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
const userAvatarUrl = ref('');
const inputContent = ref('');
const showButtons = ref(false);
const commentInput = ref('');
const emits = defineEmits(['data-uploaded']);
const props = defineProps(['middleValue']);
watch(() => props.middleValue, (newValue, oldValue) => {
    const innerValue = computed(() => props.middleValue);
    if (innerValue.value) {
        commentInput.value.focus();
    }
});

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
            reply_to: 0
        }
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

const getUserProfile = async () => {
    const response = await userApi.getUserProfile();
    if (response.code === 0) {
        userAvatarUrl.value = response.data[0].avatarUrl;
    }
};
onMounted(() => {
    getUserProfile();

});

</script>

<style scoped>
.post-comment {
    display: flex;
}
.post-comment-input{
    margin-left: 10px;
}
.post-buttons {
    margin-top: 6px;
    display: flex;
    justify-content: flex-end
}
</style>
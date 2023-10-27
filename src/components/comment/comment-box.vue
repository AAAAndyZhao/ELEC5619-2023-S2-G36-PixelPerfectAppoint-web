<template>
    <div v-if="currentUserId">
        <div class="post-comment">
            <el-avatar :src=userAvatarUrl :size="70"></el-avatar>
            <el-input class="post-comment-input" id="comment-input"
                type="textarea"
                resize="none"
                :rows="3"
                v-model="inputContent" placeholder="Add a comment" ref="commentInput"
                @focus="showButtons = true"></el-input>
        </div>
    </div>
    <div v-if="showButtons && currentUserId" class="post-buttons">
        <el-button :disabled="!inputContent" @click="post" round>
            Post
        </el-button>
        <el-button text @click="cancel">
            Cancel
        </el-button>
    </div>
    <el-card v-if="!currentUserId">
        <el-link @click="toLogin">Login</el-link>
        <el-text> to comment</el-text>
    </el-card>
</template>
<script setup >
import { ref, defineProps, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import reviewApi from '../../services/review-api'
import userApi from '../../services/user-api'
import router from '@/router';
const userAvatarUrl = ref('');
const inputContent = ref('');
const showButtons = ref(false);
const commentInput = ref('');
const emits = defineEmits(['data-uploaded']);
const props = defineProps(['middleValue']);
const currentUserId = localStorage.getItem('userId');
watch(() => props.middleValue, (newValue, oldValue) => {
    const innerValue = computed(() => props.middleValue);
    if (innerValue.value) {
        commentInput.value.focus();
    }
});

const post = async () => {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            ElMessage.error('Please login first');
            return;
        }
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
    if (!localStorage.getItem('userId')) {
        return;
    }
    const response = await userApi.getUserProfile();
    if (response.code === 0) {
        userAvatarUrl.value = response.data[0].avatarUrl;
    }
};

const toLogin = () => {
    // push to sign in with current url (path and query)
    router.push({ path: '/sign-in', query: { redirect: window.location.href } });
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
<template>
    <div v-if="currentUserId">
        <div class="app-comment">
            <user-avatar :user="userInfo" :size="70"></user-avatar>
            <el-input class="app-comment-input"
                type="textarea"
                resize="none"
                :rows="3"
                v-model="inputContent" placeholder="Add a comment" ref="commentInputRef"
                @focus="showButtons = true"></el-input>
        </div>
    </div>
    <div v-if="showButtons && currentUserId" class="app-post-button">
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
import userApi from '@/services/user-api'
import router from '@/router';
import UserAvatar from '@/components/user/user-avatar.vue';

const props = defineProps({
    focusInput: {
        type: Boolean,
        required: true
    },
    photoId: {
        type: String,
        required: false,
        default: ''
    }
})

const userInfo = ref({});
const commentInputRef = ref(null);
const inputContent = ref('');
const showButtons = ref(false);
const emits = defineEmits(['add-review']);
const currentUserId = localStorage.getItem('userId');

watch(() => props.focusInput, (newValue, oldValue) => {
    if (props.focusInput) {
        commentInputRef.value.focus();
    }
});

const post = async () => {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            ElMessage.error('Please login first');
            return;
        }
        if (!props.photoId) {
            ElMessage.error('Please provide photo id');
            return;
        }
        const reviewData = {
            uid: userId,
            content: inputContent.value,
            photo_id: props.photoId,
            reply_to: 0
        }
        emits('add-review', reviewData);
        inputContent.value = '';
        showButtons.value = false;
    } catch (e) {
        console.error(e)
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
        userInfo.value = response.data[0];
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
.app-comment {
    display: flex;
}
.app-comment-input{
    margin-left: 10px;
}
.app-post-button {
    margin-top: 6px;
    display: flex;
    justify-content: flex-end
}
</style>
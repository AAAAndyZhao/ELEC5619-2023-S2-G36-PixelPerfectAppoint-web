<template>
    <div class="app-operation-bar">
        <el-button link @click="toggleLike">
            <like class="tool-icon" theme="outline" size="30" fill="#333" v-if="!isLiked" />
            <like class="tool-icon" theme="filled" size="30" fill="#d60000" v-if="isLiked" />
            <el-text>{{ likeCount }}</el-text>
        </el-button>
        <el-button link @click="focusOnNestedChildInput">
            <comment class="tool-icon" theme="outline" size="30" fill="#333" />
        </el-button>
        <el-button link @click="getCurrentUrl"> <share-three class="tool-icon" theme="outline" size="30" fill="#333" />
        </el-button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Like, Comment, ThumbsUp, ShareThree } from '@icon-park/vue-next'

const props = defineProps({
    likeCount: {
        type: Number,
        required: false,
        default: 0
    },
    isUserLiked: {
        type: Boolean,
        required: false,
        default: false
    }
});
const emits = defineEmits(['like', 'unlike', 'focus-input']);
const isLiked = ref(false);

const getCurrentUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    ElNotification({
        title: 'Success',
        message: 'Link copied to clipboard',
        type: 'success'
    });
};

const focusOnNestedChildInput = () => {
    emits('focus-input');
};

const toggleLike = () => {
    isLiked.value = !isLiked.value;
    if (isLiked.value) {
        emits('like');
    } else {
        emits('unlike');
    }
};

onMounted(() => {
    isLiked.value = props.isUserLiked;
});
</script>

<style scoped>
.app-operation-bar {
    height: 60px;
    box-sizing: border-box;
    padding: 0 20px;
    display: flex;
    gap: 10px;
    margin-top: 20px;
    border-style: solid;
    border-width: 1px 0;
    border-color: #ccc;
}
</style>
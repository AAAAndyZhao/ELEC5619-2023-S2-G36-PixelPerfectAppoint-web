<template>
    <div>
        <div class="post-comment">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="70"></el-avatar>
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
import { ref, defineProps, computed, watch } from 'vue'
const inputContent = ref('');
const showButtons = ref(false);
const commentInput = ref('');

const props = defineProps(['middleValue']);
watch(() => props.middleValue, (newValue, oldValue) => {
    const innerValue = computed(() => props.middleValue);
    if (innerValue.value) {
        commentInput.value.focus();
    }
});

const post = () => {
    // 在此处执行发布内容的逻辑
    inputContent.value = '';
    showButtons.value = false;

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
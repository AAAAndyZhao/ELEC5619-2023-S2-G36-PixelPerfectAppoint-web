<template>
    <div class="app-account-cancellation-confirm">
        <el-text type="danger" size="large">
            Are you sure you want to delete your account?
        </el-text>
        <el-text type="danger" size="large">
            This action cannot be undone.
        </el-text>
        <el-input class="app-confirm-input" v-model="confirmInput" @input="updateConfirmText" placeholder="Type 'cancel' to confirm" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    input: {
        type: String,
        required: true
    }
});
const confirmInput = ref(props.input);

const emits = defineEmits(['update:input']);

const updateConfirmText = (value) => {
    emits('update:input', value);
};
</script>

<style scoped>
.app-account-cancellation-confirm {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 200px;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    font-size: 20px;
}
.app-confirm-input {
    margin-top: 20px;
}
</style>
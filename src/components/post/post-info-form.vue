<template>
    <div class="app-photo-info-form">
        <el-form :model="photoForm" label-width="120px" :rules="rules" ref="photoFormRef">
            <el-form-item label="Title:" prop="title">
                <el-input :disabled="!props.photo" v-model="photoForm.title" size="large"></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
                <el-input :disabled="!props.photo" type="textarea" v-model="photoForm.description"
                :rows="4" resize="none" size="large"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue';

const photoFormRef = ref(null)
//从父组件传递过来的数据
const props = defineProps({
    photo: {
        type: Object,
        required: false
    },
    
});
//向父组件传递数据
const emits = defineEmits([ 'update:postInfo']);

const photoForm = ref({
    title: '',
    description: '',
    
});



watchEffect(() => {
    if (!props.photo) {
        photoForm.value = {
            title: '',
            description: '',
        };
        return;
    }

});

watchEffect(() => {
    emits('update:postInfo', { ...photoForm.value });
})

const rules = {
    title: [
        { required: true, message: 'Please input post title', trigger: 'blur' },
        { min: 1, max: 50, message: 'Length should be 1 to 50', trigger: 'blur' },
    ],
    description: [
        { required: true, message: 'Please input post description', trigger: 'blur' }
    ]
}


</script>

<style scoped>
.app-photo-info-form{
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
}
</style>
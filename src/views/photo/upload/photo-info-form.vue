<template>
    <div class="app-photo-info-form">
        <el-form :model="photoForm" label-width="120px" :rules="rules" ref="photoFormRef">
            <el-form-item label="Name" prop="name">
                <el-input :disabled="!props.photo" v-model="photoForm.name" size="large"></el-input>
            </el-form-item>
            <el-form-item label="Description" prop="description">
                <el-input :disabled="!props.photo" type="textarea" v-model="photoForm.description"
                :rows="4" resize="none" size="large"></el-input>
            </el-form-item>
            <el-form-item label="Category">
                <el-select :disabled="!props.photo" v-model="photoForm.categoryCode" placeholder="Select a category" size="large">
                    <el-option
                    v-for="category in photoCategories"
                    :key="category.code"
                    :label="category.value"
                    :value="category.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-divider content-position="left">Advanced</el-divider>
            <el-form-item label="Camera Maker" prop="camMaker">
                <el-input :disabled="!props.photo" v-model="photoForm.camMaker" size="large"></el-input>
            </el-form-item>
            <el-form-item label="Camera Model" prop="camModel">
                <el-input :disabled="!props.photo" v-model="photoForm.camModel" size="large"></el-input>
            </el-form-item>
            <el-form-item label="Lens" prop="lens">
                <el-input :disabled="!props.photo" v-model="photoForm.lens" size="large"></el-input>
            </el-form-item>
            <el-form-item label="Focal Length" prop="focalLength">
                <el-input :disabled="!props.photo" v-model="photoForm.focalLength" size="large" style="width: 170px;">
                    <template #suffix>mm</template>
                </el-input>
            </el-form-item>
            <el-form-item label="Exposure Time" prop="exposureTime">
                <el-input :disabled="!props.photo" v-model="photoForm.exposureTime" style="width: 170px;">
                    <template #suffix>second(s)</template>
                </el-input>
            </el-form-item>
            <el-form-item label="F Number" prop="fNumber">
                <el-input :disabled="!props.photo" v-model="photoForm.fNumber" style="width: 100px;">
                    <template #prefix>f/</template>
                </el-input>
            </el-form-item>
            <el-form-item label="ISO" pro="iso">
                <el-input :disabled="!props.photo" v-model="photoForm.iso" style="width: 100px;"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const photoFormRef = ref(null)
const props = defineProps({
    photo: {
        type: Object,
        required: false
    }
});
const emits = defineEmits(['update:photo']);

const photoForm = ref({
    name: '',
    description: '',
    categoryCode: 0,
    camMaker: '',
    camModel: '',
    lens: '',
    focalLength: '',
    exposureTime: '',
    fNumber: '',
    iso: '',
});

watchEffect(() => {
    if (!props.photo) {
        photoForm.value = {
            name: '',
            description: '',
            categoryCode: 0,
            camMaker: '',
            camModel: '',
            lens: '',
            focalLength: '',
            exposureTime: '',
            fNumber: '',
            iso: '',
        };
        return;
    }
    Object.assign(photoForm.value, props.photo);
});
watchEffect(() => {
    if (!props.photo || !photoFormRef.value) return;
    emits('update:photo', { ...photoForm.value });
});

const rules = {
    name: [
        { required: true, message: 'Please input photo name', trigger: 'blur' },
        { min: 1, max: 50, message: 'Length should be 1 to 50', trigger: 'blur' },
    ],
    description: [
        { required: true, message: 'Please input photo description', trigger: 'blur' }
    ],
    camMaker: [
        { max: 64, message: 'Camera maker should be at most 64', trigger: 'blur' }
    ],
    camModel: [
        { max: 64, message: 'Camera model should be at most 64', trigger: 'blur' }
    ],
    lens: [
        { max: 64, message: 'Lens info should be at most 64', trigger: 'blur' }
    ],
    focalLength: [
        { pattern: /^\d{1,4}$/, message: 'Focal length should be a number between 1 and 9999', trigger: 'blur' }
    ],
    exposureTime: [
        // exposure time could be 1/1000, 1/100, 1/10, 1, 10, 100, 1000
        // left part could only be number 1
        { pattern: /^1\/\d{1,4}$|^1$|^\d{1,5}$/, message: 'Invalid exposure time', trigger: 'blur' }
    ],
    fNumber: [
        { pattern: /^\d{1,2}\.?\d{0,2}$/, message: 'Invalid F number', trigger: 'blur' }
    ],
    iso: [
        { pattern: /^\d{1,5}$/, message: 'ISO should be a number between 1 and 99999', trigger: 'blur' }
    ]
}

const photoCategories = ref($MENU['PHOTO_CATEGORY'])

const validate = async () => {
    await photoFormRef.value.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
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
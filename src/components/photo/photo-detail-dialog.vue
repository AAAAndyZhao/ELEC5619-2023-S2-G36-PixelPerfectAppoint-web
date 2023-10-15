<template>
    <el-dialog :model-value="show">
        <div class="app-photo-detail-dialog">
            <el-card class="app-photo-container">
                <el-image v-if="photo" :src="photo.url">
                    <template #error>
                        <el-icon>
                            <Picture />
                        </el-icon>
                    </template>
                </el-image>
                <el-icon v-else>
                    <Picture />
                </el-icon>
            </el-card>
            <div class="app-photo-info-container">
                <PhotoInfoForm :photo="photoForm" @update:photo="handlePhotoFormUpdate"/>
            </div>
        </div>

        <template #footer>
            <el-button @click="hanldeCancel">Cancel</el-button>
            <el-button type="primary" @click="handleConfirm">Confirm</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { Picture } from '@element-plus/icons-vue';
import { computed, ref, watchEffect } from 'vue';
import PhotoInfoForm from '@/components/photo/photo-info-form.vue';

const emits = defineEmits(['update:show', 'confirm']);

const props = defineProps({
    photo: {
        type: Object,
        required: true,
    },
    show: {
        type: Boolean,
        required: true,
    }
});



const photoForm = ref({
    // required fields
    id: '',
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
    resolutionX: '',
    resolutionY: '',
    public: false,  // converted from hidden field
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
            public: false
        };
        return;
    }
    Object.assign(photoForm.value, props.photo);
})


const handlePhotoFormUpdate = (photo) => {
    // not emit, just update local value
    Object.assign(photoForm.value, photo);
}

const hanldeCancel = () => {
    emits('update:show', false);
}

const handleConfirm = () => {
    emits('confirm', photoForm.value);
}
</script>

<style scoped>
/* fixed in the center of the screen */
.app-photo-detail-dialog {
    min-width: 700px;
    min-height: 500px;
    box-sizing: border-box;
    background-color: var(--el-card-background-color, #fff);
    z-index: 100;
    display: flex;
    overflow: hidden;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;

    .app-photo-container {
        width: 50%;
        /* keep 1/1 ratio */
        height: auto;
        display: flex;
    }
}
</style>
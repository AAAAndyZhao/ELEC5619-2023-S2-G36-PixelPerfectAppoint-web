<template>
    <el-image :src="imageSrc" :alt="alt" :style="style" :fit="fit" :hide-on-click-modal="hideOnClickModal"
        :loading="loading" :lazy="lazy" :scroll-container="scrollContainer" :referrerpolicy="referrerpolicy"
        :preview-src-list="previewSrcList" :z-index="zIndex" :initial-index="initialIndex"
        :close-on-press-escape="closeOnPressEscape" :preview-teleported="previewTeleported" :infinite="infinite"
        :zoom-rate="zoomRate" :min-scale="minScale" :max-scale="maxScale">
        <!-- pass templates to el-image -->
        <template #error>
            <slot name="error">
            </slot>
        </template>
        <template #placeholder>
            <slot name="placeholder">
            </slot>
        </template>
        <template #viewer>
            <slot name="viewer">
            </slot>
        </template>
    </el-image>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watchEffect, watch } from 'vue';
import axios from '@/utils/axios';
const props = defineProps({
    src: {
        type: String,
        default: '',
    },
    alt: {
        type: String,
        default: null,
    },
    style: {
        type: Object,
        default: () => ({}),
    },
    fit: {
        type: String,
        default: '',
    },
    hideOnClickModal: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: String,
        default: null,
    },
    lazy: {
        type: Boolean,
        default: false,
    },
    scrollContainer: {
        type: String | Object,
        default: null,
    },
    referrerpolicy: {
        type: String,
        default: null,
    },
    previewSrcList: {
        type: Array,
        default: () => ([]),
    },
    zIndex: {
        type: Number,
        default: 0,
    },
    initialIndex: {
        type: Number,
        default: 0,
    },
    closeOnPressEscape: {
        type: Boolean,
        default: true,
    },
    previewTeleported: {
        type: Boolean,
        default: false,
    },
    infinite: {
        type: Boolean,
        default: true,
    },
    zoomRate: {
        type: Number,
        default: 1.2,
    },
    minScale: {
        type: Number,
        default: 0.2,
    },
    maxScale: {
        type: Number,
        default: 7,
    },
})
const emits = defineEmits([
    'load',
    'error',
    'switch',
    'close',
    'show'
]);
// emit all el-images events

const imageSrc = ref('');
const fetchImage = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        let src = props.src;
        if (src.indexOf('?') > -1) {
            src += `&uid=${userId}`;
        } else {
            src += `?uid=${userId}`;
        }
        const res = await axios.get(src, {
            responseType: 'blob',
            headers: {
                authorization: token,
            },
        });
        if (res.status !== 200) {
            throw new Error('Network response was not ok');
        }
        const blob = await res.data;
        imageSrc.value = URL.createObjectURL(blob);
    } catch (error) {
        console.error(error);
        return '';
    }
}

watch(() => props.src, () => {
    fetchImage();
})
// watchEffect src change, fetch image
watchEffect(() => {
    if (props.src !== '') {
        fetchImage();
    }
})

onBeforeUnmount(() => {
    URL.revokeObjectURL(imageSrc.value);
})

onMounted(() => {
    fetchImage();
})
</script>
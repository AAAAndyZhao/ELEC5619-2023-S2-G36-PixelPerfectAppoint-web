<template>
    <div class="app-photo-image-container" v-loading="imgLoading">
        <el-image v-bind:draggable.attr="false" :src="imageSrc" :alt="alt" :style="style" :fit="fit" :hide-on-click-modal="hideOnClickModal"
            :loading="loading" :lazy="lazy" :scroll-container="scrollContainer" :referrerpolicy="referrerpolicy"
            :preview-src-list="previewSrcList" :z-index="zIndex" :initial-index="initialIndex"
            :close-on-press-escape="closeOnPressEscape" :preview-teleported="previewTeleported" :infinite="infinite"
            :zoom-rate="zoomRate" :min-scale="minScale" :max-scale="maxScale" v-show="showThePhoto"
            :class="`${selected ? 'app-selected' : ''}`">
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
        <el-checkbox v-if="selectMode" :model-value="selected" class="app-photo-image-checkbox" @change="updateSelected"></el-checkbox>
        <el-icon v-if="showHidden && hidden" class="app-hidden-icon"><Hide /></el-icon>
    </div>
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
    // custom props
    width: {
        type: String,
        default: '100%',
    },
    height: {
        type: String,
        default: '100%',
    },
    selectMode: {
        type: Boolean,
        default: false,
    },
    selected: {
        type: Boolean,
        default: false,
    },
    showHidden: {
        type: Boolean,
        default: false,
    },
    hidden: {
        type: Boolean,
        default: false,
    },
})
const emits = defineEmits([
    'load',
    'error',
    'switch',
    'close',
    'show',
    // emits custom events
    'load-complete',
    'update:selected'
]);
// emit all el-images events
const showThePhoto = ref(false);
const imgLoading = ref(false);
const imageSrc = ref('');
const fetchImage = async () => {
    if (!props.src) {
        return;
    }
    imgLoading.value = true;
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
        emits('load-complete');
        setTimeout(() => {
            showThePhoto.value = true;
        }, 100);
    } catch (error) {
        console.error(error);
        return '';
    } finally {
        imgLoading.value = false;
    }
}
const updateSelected = (value) => {
    emits('update:selected', value);
}
watch(() => props.src, () => {
    fetchImage();
})

onBeforeUnmount(() => {
    URL.revokeObjectURL(imageSrc.value);
})

onMounted(() => {
    fetchImage();
})
</script>

<style scoped>
.app-photo-image-container {
    position: relative;
}
.app-photo-image-checkbox{
    position: absolute;
    top: 0;
    left: 5px;
}
.app-hidden-icon {
    position: absolute;
    top: 0;
    right: 5px;
    color: #409eff;
}
.app-selected{
    border: 2px solid #409eff;
    /* add a little filter */
    filter: brightness(0.8);
}
</style>
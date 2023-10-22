<template>
    <div class="app-title-edit">
        <el-form>
            <el-input
                :model-value="title"
                placeholder="Please input title"
                clearable
                @input="updateTitle"/>
        </el-form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const emits = defineEmits(['update:title']);
const props = defineProps({
    title: {
        type: String,
        required: true
    }
})

const updateTitle = (title) => {
    emits('update:title', title)
}
</script>

<style scoped>
</style>
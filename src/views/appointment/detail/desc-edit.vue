<template>
    <div class="app-desc-edit">
        <el-form>
            <el-input
                :model-value="description"
                type="textarea"
                :rows="7"
                placeholder="Please input description"
                clearable
                resize="none"
                @input="updateDescription"/>
        </el-form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const emits = defineEmits(['update:description']);
const props = defineProps({
    description: {
        type: String,
        required: true
    }
})

const updateDescription = (description) => {
    emits('update:description', description)
}
</script>

<style scoped>
</style>
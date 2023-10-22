<template>
    <div class="description">
        <p class="description-detail"> {{ postInfo?.text }} </p>
    </div>
</template>

<script setup >
import { ref } from 'vue'
const props = defineProps({
    postInfo: {
        type: Object,
        required: false
    },
   
});
</script>

<style scoped>
.description {
    text-align: left;
}
</style>
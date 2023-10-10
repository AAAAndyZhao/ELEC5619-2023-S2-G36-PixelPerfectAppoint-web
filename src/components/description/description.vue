<template>

    <div class="description">
        <p class="description-detail"> {{ description.descriptionDetail }} </p>
    </div>
    
</template>

<script setup lang = 'ts'>
import{ref} from 'vue'
interface description{
    descriptionDetail: string;
}
const description = ref<description>({
    descriptionDetail: '这是一段描述',
});
</script>

<style scoped>
.description{
    text-align: left;
}
</style>
<template>
    <div class="post-info">
        <h1 class="post-title"> {{ postInfo?.title }} </h1>
        <p class="post-date"> {{ postInfo?.updateDatetime
 }} </p>
    </div>
</template>

<script setup >
import { ref} from 'vue'
const props = defineProps({
    postInfo: {
        type: Object,
        required: false
    },
   
});




</script>


<style scoped>
.post-title {
    font-size: 20px;
    font-weight: 500;
    text-align: left;
}

.post-date {
    font-size: 12px;
    color: #999;
    text-align: left;
}
</style>
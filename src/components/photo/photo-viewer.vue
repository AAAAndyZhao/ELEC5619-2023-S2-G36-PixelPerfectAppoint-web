<template>
    <div v-show="visible" @click="closeClick" class="showPhoto">
        <PhotoImage class="img" :src="url" alt="Image failed to load!" />
    </div>
</template>
  
<script >
import PhotoImage from "@/components/photo/photo-image.vue";

export default {
    props: {
        url: {
            type: String,
            default: "",
        },
        visible: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        closeClick() {
            this.$emit("closeClick");
        },
    },
    components: { PhotoImage }
};
</script>


<style scoped>
.showPhoto {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.showPhoto .img {
    display: block;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
</style>
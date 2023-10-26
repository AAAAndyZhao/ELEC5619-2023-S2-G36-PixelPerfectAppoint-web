<template>
    <div class="app-review-add">
        <el-select v-model="review.targetParticipantId" size="large"
            no-data-text="No participant" @change="handleReviewChange">
            <el-option
            v-for="participant in displayParticipants"
            :key="participant.user.id"
            :label="participant.user.alias"
            :value="participant.user.id">
                <div class="app-participant-option">
                    <user-avatar :user="participant.user" :size="30"/>
                    <el-text truncated>{{ participant.user.alias }}</el-text>
                </div>
            </el-option>
        </el-select>
        <el-rate v-model="review.rating" size="large" @change="handleReviewChange"/>
        <el-input v-model="review.content" type="textarea"
        :rows="5" placeholder="Write your review here" @change="handleReviewChange"/>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import UserAvatar from '@/components/user/user-avatar.vue';
const props = defineProps({
    participants: {
        type: Array,
        required: false,
        default: () => []
    },
    existReviews: {
        type: Array,
        required: false,
        default: () => []
    }
})
const emits = defineEmits(['update:review']);
const displayParticipants = computed(() => {
    return props.participants.filter(participant => {
        return !props.existReviews.find(review => review.targetParticipant.id === participant.user.id)
        && participant.user.id !== localStorage.getItem('userId');
    })
})
const review = ref({
    targetParticipantId: '',
    rating: 5,
    content: '',
});
const handleReviewChange = () => {
    emits('update:review', review.value);
}
</script>

<style scoped>
.app-review-add{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px;
    box-sizing: border-box;
}
.el-select-dropdown__item{
    height: 50px;
}
.app-participant-option{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
}
</style>
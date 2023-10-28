<template>
    <div class="app-user-review" v-loading="loading">
        <div class="app-reviews-container">
            <el-timeline>
                <el-timeline-item v-for="review in reviewsSent" :key="review" :timestamp="review.updateAt" placement="top">
                    <user-appointment-review :participant="review.participant"
                        :target-participant="review.targetParticipant" :content="review.content" :rating="review.rating">
                    </user-appointment-review>
                </el-timeline-item>
                <el-timeline-item v-for="review in reviewsReceived" :key="review" :timestamp="review.updateAt"
                    placement="top">
                    <user-appointment-review :participant="review.participant"
                        :target-participant="review.targetParticipant" :content="review.content" :rating="review.rating" />
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import appointmentApi from '@/services/appointment-api';
import router from '@/router';
import UserAppointmentReview from '@/components/appointment/user-appointment-review.vue';

const loading = ref(false);
const reviewsSent = ref([]);
const reviewsReceived = ref([]);
const props = defineProps({
    userId: {
        type: String,
        required: true
    }
})

const fetchAppointmentReviewsSent = async () => {
    let userId = props.userId;
    loading.value = true;
    try {
        const res = await appointmentApi.getAppointmentReviewsOfUser(userId);
        if (res.code === 0) {
            reviewsSent.value = res.data;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('Failed to get appointment reviews: ' + error.message || 'Error');
    } finally {
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}
const fetchAppointmentReviewsReceived = async () => {
    let userId = props.userId;
    loading.value = true;
    try {
        const res = await appointmentApi.getAppointmentReviewsOfTargetUser(userId);
        if (res.code === 0) {
            reviewsReceived.value = res.data;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('Failed to get appointment reviews: ' + error.message || 'Error');
    }
}
const viewAppointment = (appointmentId) => {
    router.push('/appointment/' + appointmentId);
}

onMounted(() => {
    fetchAppointmentReviewsSent();
    fetchAppointmentReviewsReceived();
})
</script>

<style scoped>
.app-user-review {
    height: 100%;
    width: calc(100% - 100px);
}

.app-title {
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    text-align: left;
    font-weight: bold;
}

.app-user-reviews-tabs {
    height: calc(100% - 60px);
    width: 100%;
    box-sizing: border-box;
}

:deep(.app-user-reviews-tabs > .el-tabs__content),
:deep(.app-user-reviews-tabs > .el-tabs__content > .el-tab-pane) {
    height: 100%;
}

.app-reviews-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    text-align: left;
    overflow-y: auto;
}
</style>
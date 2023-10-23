<template>
    <div class="app-appointment-invitation" v-loading="loading">
        <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/p/vgdgWWIJTQhf1Pg8edVg3VY2f3l049xabq6AONJYm0Pd21d730L85UInxTqGMG8g/n/sdhdhqcmzyxg/b/ppa-assets/o/logo-large-transparent.png" alt="logo" />
        <h1>Appointment Invitation</h1>
        <div v-if="validInvitation && !isSuccessful" class="app-apppointment-info-container">
            <div class="app-apppointment-info-item">
                <div>Title</div>
                <el-divider direction="vertical" />
                <el-text>{{ appointmentData?.title }}</el-text>
            </div>
            <div class="app-apppointment-info-item">
                <div>Creator</div>
                <el-divider direction="vertical" />
                <user-info-detail v-if="appointmentData?.creator" :user="appointmentData?.creator" 
                :show-follow-option="false" :show-message-button="false"/>
            </div>
            <div class="app-apppointment-info-item">
                <div>Time</div>
                <el-divider direction="vertical" />
                <div class="app-time-info-content">
                    <div class="app-info-item">
                        <el-icon :size="40">
                            <Calendar />
                        </el-icon>
                        <span>{{ dayjs(appointmentData?.appointDatetime).format('YYYY-MM-DD') }}</span>
                    </div>
                    <div class="app-info-item">
                        <el-icon :size="40">
                            <Timer />
                        </el-icon>
                        <span>{{ dayjs(appointmentData?.appointDatetime).format('HH:mm:ss') }} (24h)</span>
                    </div>
                    <div class="app-info-item">
                        <el-icon :size="40">
                            <Camera />
                        </el-icon>
                        <span>{{ appointmentData?.estimateDuration }} mins</span>
                    </div>
                </div>
            </div>
            <div class="app-apppointment-info-item">
                <div>Location</div>
                <el-divider direction="vertical" />
                <el-text>{{ locationStr }}</el-text>
            </div>
            <div class="app-apppointment-info-item">
                <div>Participants</div>
                <el-divider direction="vertical" />
                <div class="app-participant-info-container">
                    <user-avatar class="app-participant-avatar" v-for="participant in appointmentData?.participants"
                    :user="participant.user"/>
                </div>
            </div>
            <div class="app-apppointment-invitation-operation">
                <el-button v-if="!isSuccessful" type="success" :icon="Check" circle @click="acceptInvitation"/>
                <el-button v-if="!isSuccessful" type="danger" :icon="Close" circle @click="rejectInvitation"/>
            </div>
        </div>
        <div v-else-if="validInvitation">
            <!-- success -->
            <h2 v-if="isAccept">
                You have accepted the invitation successfully!
            </h2>
            <h2 v-else>
                You have rejected the invitation!
            </h2>
        </div>
        <div v-else>
            <h3>Invalid invitation</h3>
        </div>
        <transition name="accept-animate" @after-enter="keepButtonLarge">
            <el-button v-if="isSuccessful && isAccept" :class="animateButtonClass" type="success" :icon="Check" circle/>
        </transition>
        <transition name="accept-animate" @after-enter="keepButtonLarge">
            <el-button v-if="isSuccessful && !isAccept" :class="animateButtonClass" type="danger" :icon="Close" circle/>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { Check, Close } from '@element-plus/icons-vue';
import appointmentApi from '@/services/appointment-api';
import UserInfoDetail from '@/components/user/user-info-detail.vue';
import UserAvatar from '@/components/user/user-avatar.vue';

const props = defineProps({
    appointmentId: {
        type: String,
        required: false,
        default: ''
    },
    token: {
        type: String,
        required: false,
        default: ''
    }
});
const loading = ref(false);
const validInvitation = ref(true);
const isSuccessful = ref(false);
const isAccept = ref(false);
const appointmentData = ref({});
const animateButtonClass = ref('null');

const keepButtonLarge = () => {
    animateButtonClass.value = 'app-animate-button'
}
const locationStr = computed(() => {
    const location = appointmentData.value?.location;
    if (!location) {
        return 'No Location';
    }
    const locationArray = [
        location.apartmentNo,
        `${location.streetNo ? location.streetNo + ' ' : ''}${location.streetName}`,
        location.city,
        `${location.state} ${location.zipCode}`,
        location.country,
    ];
    return locationArray.filter((item) => item).join(', ');
})
const getAppointmentInfo = async () => {
    try {
        const res = await appointmentApi.getAppointmentById(props.appointmentId, props.token);
        if (res.code === 0 && res.data.length > 0) {
            appointmentData.value = res.data[0];
            validInvitation.value = true;
        } else {
            validInvitation.value = false;
        }
    } catch (error) {
        console.error(error);
        validInvitation.value = false;
    }
};

const acceptInvitation = async () => {
    loading.value = true;
    try{
        const res = await appointmentApi.respondInvitation(props.appointmentId, props.token, true);
        if (res.code === 0){
            isSuccessful.value = true;
            isAccept.value = true;
        }else{
            ElMessage.error('Failed to accept invitation: ' + res.msg || 'Unknown error');
        }
    }catch(error){
        console.error(error)
        ElMessage.error('Failed to accept invitation: ' + error.message || 'Unknown error');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 500);
    }
}

const rejectInvitation = async () => {
    loading.value = true;
    try{
        const res = await appointmentApi.respondInvitation(props.appointmentId, props.token, false);
        if (res.code === 0){
            isSuccessful.value = true;
            isAccept.value = false;
        }else{
            ElMessage.error('Failed to reject invitation: ' + res.msg || 'Unknown error');
        }
    }catch(error){
        console.error(error)
        ElMessage.error('Failed to reject invitation: ' + error.message || 'Unknown error');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 500);
    }
}

onMounted(async () => {
    if (!props.appointmentId || !props.token) {
        validInvitation.value = false;
        return;
    }
    getAppointmentInfo();
});
</script>

<style scoped>
.app-appointment-invitation{
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 160px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
}
.app-appointment-invitation img{
    width: 200px;
    height: 200px;
}
.app-apppointment-info-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 25px;
}
.app-apppointment-info-item{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 20px;
}

.app-time-info-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 35px;

    .app-info-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
}
.app-participant-info-container{
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 10px;
}
.app-apppointment-invitation-operation{
    margin-top: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
    position: relative;
}
.app-appointment-invitation .el-button {
    width: 70px;
    height: 70px;
    font-size: 24px;
}
.accept-animate-enter-active, .accept-animate-leave-active {
    transition: transform 2s;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.accept-animate-enter-to /* .accept-animate-enter-active.accept-animate-enter-to in <2.1.8 */ {
    transform: translate(-50%, -50%) scale(3);
}

.app-animate-button{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(3);
}
</style>
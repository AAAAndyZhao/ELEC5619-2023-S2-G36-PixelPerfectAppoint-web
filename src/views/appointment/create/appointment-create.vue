<template>
    <div class="app-appointment-create" v-loading="loading">
        <div class="app-title">
            <h2>Create new Appointment</h2>
        </div>
        <div class="app-content">
            <div class="app-create-stepbar">
                <el-steps :active="currentStep">
                    <el-step title="Basic Information" :icon="Edit" />
                    <el-step title="Location" :icon="MapLocation" />
                    <el-step title="Step 3" :icon="User" />
                </el-steps>
            </div>
            <div class="app-create-form">
                <router-view @data-update="handleDataUpdate" :data="appointmentForm[stepArray[currentStep - 1]]" />
            </div>
            <div class="app-buttons">
                <el-button v-if="currentStep > 1" size="large" @click="previousStep">Previous</el-button>
                <el-button type="primary" size="large" @click="nextStep">{{ currentStep === maxStep ? 'Create' : 'Next'
                }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Edit, MapLocation, User } from '@element-plus/icons-vue'
import router from '@/router';
import appointmentApi from '@/services/appointment-api';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const currentStep = ref(1);
const stepArray = ['information', 'location', 'participants'];
const maxStep = 3;

const appointmentForm = ref({
    information: {
        title: '',
        description: '',
        appointmentDate: null,
        appointmentTime: null,
        endTime: null,
        isEndTimeTomorrow: false,
        estimatedDuration: 0
    },
    location: null,
    participants: {
        selectedUsers: [],
    }
})
const saveCurrentAppointmentFormData = () => {
    // clear old appointmentForm data in local storage
    localStorage.removeItem('appointmentForm');
    // save current appointmentForm data into local storage
    localStorage.setItem('appointmentForm', JSON.stringify(appointmentForm.value));
}

const nextStep = async () => {
    if (currentStep.value === maxStep) {
        // submit
        // create appointment
        const appointment = {
            ...appointmentForm.value.information,
            location: appointmentForm.value.location,
            participants: appointmentForm.value.participants.selectedUsers.map(user => user.id)
        }
        try {
            loading.value = true;
            const res = await appointmentApi.createAppointment(appointment);
            if (res.code === 0) {
                ElMessage.success('Appointment created successfully');
                // redirect to success page
                // clear appointmentForm data in local storage
                localStorage.removeItem('appointmentForm');
                // to /appointment/create/success
                router.push({
                    path: '/appointment/create/success'
                });
            } else {
                ElMessage.error('Appointment created failed');
            }
        } catch (e) {
            console.error(e);
            ElMessage.error('Appointment created failed: ' + e.message || 'Unknown error');
        } finally {
            setTimeout(() => {
                loading.value = false;
            }, 2000);
        }
        return;
    }
    if (currentStep.value < maxStep) {
        loading.value = true;
        currentStep.value++;
        saveCurrentAppointmentFormData();
        router.push({
            path: stepArray[currentStep.value - 1]
        });
        setTimeout(() => {
            loading.value = false;
        }, 500);
    }

}

const previousStep = () => {
    if (currentStep.value > 1) {
        loading.value = true;
        currentStep.value--;
        saveCurrentAppointmentFormData();
        router.push({
            path: stepArray[currentStep.value - 1]
        });
        setTimeout(() => {
            loading.value = false;
        }, 500);
    }
}

const handleDataUpdate = (step, data) => {
    switch (step) {
        case 'information':
            appointmentForm.value.information = data;
            break;
        case 'location':
            appointmentForm.value.location = data;
            break;
        case 'participants':
            appointmentForm.value.participants.selectedUsers = data;
            break;
        default:
            break;
    }
}

window.addEventListener('beforeunload', (event) => {
    // before tab being closed, remove appointmentForm data from local storage
    localStorage.removeItem('appointmentForm');
});

watch(currentStep, (newVal, oldVal) => {
    if (newVal === oldVal) return;
    // load appointmentForm data from local storage
    const appointmentFormStr = localStorage.getItem('appointmentForm');
    if (appointmentFormStr) {
        Object.assign(appointmentForm.value, JSON.parse(appointmentFormStr));
    }
})

onMounted(() => {
    // before tab being closed, remove appointmentForm data from local storage
    // get the last part of the path
    const path = router.currentRoute.value.path;
    const step = path.split('/').pop();
    currentStep.value = stepArray.indexOf(step) + 1;
})
</script>

<style scoped>
.app-appointment-create {
    width: 100%;
    /* height is the whole view - header height */
    height: calc(100vh - 100px);
    box-sizing: border-box;
    padding: 0 20px;
}

.app-appointment-create>.app-title {
    height: 36px;
}

.app-appointment-create>.app-title>h2 {
    text-align: left;
    margin-block-start: 0;
}

.app-appointment-create>.app-content {
    height: calc(100% - 36px);
    width: 100%;
    box-sizing: border-box;
    padding: 10px 0;
    text-align: left;

    .app-create-stepbar {
        height: 70px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 50px;
    }

    .app-create-form {
        height: calc(100% - 150px);
        width: 100%;
        box-sizing: border-box;
        padding: 0;
    }

    .app-buttons {
        height: 80px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 50px;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-direction: row;
    }
}
</style>
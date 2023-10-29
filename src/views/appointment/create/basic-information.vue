<template>
    <div class="app-appointment-create-basic-info">
        <div class="app-title">
            <h3>Basic Information</h3>
        </div>
        <div class="app-content">
            <el-card class="app-form-card app-info-form-card">
                <template #header>
                    <div class="clearfix">
                        <span>Basic Information</span>
                    </div>
                </template>
                <el-form ref="infoFormRef" class="app-form app-info-form" label-width="120px"
                :model="appointmentForm" :rules="rules">
                    <el-form-item label="Title" prop="title">
                        <el-input v-model="appointmentForm.title" size="large"></el-input>
                    </el-form-item>
                    <el-form-item label="Description" prop="description">
                        <el-input  type="textarea" v-model="appointmentForm.description"
                        :rows="10" resize="none" size="large"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card class="app-form-card app-time-form-card">
                <template #header>
                    <div class="clearfix">
                        <span>Date & Time</span>
                    </div>
                </template>
                <el-form ref="timeFormRef" class="app-form app-time-form" label-width="180px"
                :model="appointmentForm" :rules="rules">
                    <el-form-item label="Appointment Date" prop="appointmentDate">
                        <el-date-picker
                            v-model="appointmentForm.appointmentDate"
                            type="date"
                            placeholder="Pick a day"
                            size="large"
                            :disabled-date="time => time.getTime() < Date.now()"
                        />
                    </el-form-item>
                    <el-form-item label="Appointment Time" prop="appointmentTime">
                        <el-time-picker
                        format="HH:mm"
                        v-model="appointmentForm.appointmentTime"
                        placeholder="Pick a time"
                        size="large"
                        />
                    </el-form-item>
                    <el-form-item label="Estimated End Time" prop="endTime">
                        <el-time-picker
                        format="HH:mm"
                        v-model="appointmentForm.endTime"
                        placeholder="Pick an estimated end time"
                        size="large"
                        />
                        <el-switch
                        style="margin-left: 20px;"
                        v-model="appointmentForm.isEndTimeTomorrow"
                        active-text="Tommorow"
                        size="large"
                        />
                    </el-form-item>
                    <el-form-item label="Estimated Duration" prop="estimatedDuration">
                        <el-input
                            style="width: 120px;"
                            readonly
                            v-model="estimatedDuration"
                            size="large">
                            <template #suffix>min(s)</template>
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
const emits = defineEmits(['data-update']);

const infoFormRef = ref(null);
const timeFormRef = ref(null);

const appointmentForm = ref({
    title: '',
    description: '',
    appointmentDate: null,
    appointmentTime: null,
    endTime: null,
    isEndTimeTomorrow: false
});

const estimatedDuration = computed(() => {
    if (appointmentForm.value.appointmentTime && appointmentForm.value.endTime) {
        const startTime = new Date(appointmentForm.value.appointmentTime);
        const endTime = new Date(appointmentForm.value.endTime);
        if (appointmentForm.value.isEndTimeTomorrow) {
            endTime.setDate(endTime.getDate() + 1);
        }
        const duration = (endTime.getTime() - startTime.getTime()) / 1000 / 60;
        if (duration < 0) {
            return 0;
        }
        return duration;
    }
    return 0;
})

const rules = {
    title: [
        { required: true, message: 'Please input the title', trigger: 'blur' },
        { min: 3, max: 50, message: 'Length should be 3 to 50', trigger: 'blur' }
    ],
    description: [
        { required: true, message: 'Please input the description', trigger: 'blur' },
        { min: 3, max: 500, message: 'Length should be 3 to 500', trigger: 'blur' }
    ],
    appointmentDate: [
        { required: true, message: 'Please select the appointment date', trigger: 'blur' }
    ],
    appointmentTime: [
        { required: true, message: 'Please select the appointment time', trigger: 'blur' }
    ],
    endTime: [
        { required: true, message: 'Please select the estimated end time', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            const startTime = new Date(appointmentForm.value.appointmentTime);
            const endTime = new Date(appointmentForm.value.endTime);
            if (appointmentForm.value.isEndTimeTomorrow) {
                endTime.setDate(endTime.getDate() + 1);
            }
            const duration = (endTime.getTime() - startTime.getTime()) / 1000 / 60;
            if (duration < 0) {
                callback(new Error('Estimated end time should be later than appointment time'));
            }
        }, trigger: 'change' }
    ]
}

const syncDataToParent = () => {
    emits('data-update', 'information', {
        ...appointmentForm.value,
        estimatedDuration: estimatedDuration.value
    });
}
watchEffect(() => {
    if (!infoFormRef.value || !timeFormRef.value) return;
    syncDataToParent();
});
watchEffect(() => {
    if (!props.data) return;
    // if all properties in props.data has no valid value, return
    if (!props.data.title && !props.data.description && !props.data.appointmentDate && !props.data.appointmentTime && !props.data.endTime && !props.data.isEndTimeTomorrow) {
        return;
    }
    Object.assign(appointmentForm.value, props.data);
});
</script>

<style scoped>
.app-appointment-create-basic-info{
    width: 100%;
    min-height: calc(100vh - 160px);
    box-sizing: border-box;
    .app-title{
        height: 36px;
        width: 100%;
        box-sizing: border-box;
        padding: 0;
        text-align: left;
    }
    .app-content {
        height: calc(100vh - 196px);
        width: 100%;
        box-sizing: border-box;
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: row;
        .app-form-card {
            height: 100%;
            width: 49%;
            box-sizing: border-box;

            .app-form {
                height: 100%;
                width: 100%;
                box-sizing: border-box;
                padding: 0 20px;
                .el-form-item {
                    margin-bottom: 50px;
                }
            }
        }
    }
}
.app-appointment-create-basic-info .app-title h3 {
    margin-block-start: 0;
}
:deep(.app-content>.app-form-card>.el-card__body) {
    height: calc(100% - 64px);
    width: 100%;
    box-sizing: border-box;
}
</style>

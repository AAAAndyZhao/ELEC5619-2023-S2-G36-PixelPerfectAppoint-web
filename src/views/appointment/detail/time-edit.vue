<template>
    <div class="app-time-edit">
        <el-form :model-value="time">
            <el-form-item label="Appointment Date" prop="date">
                <el-date-picker
                    v-model="date"
                    type="date"
                    placeholder="Pick a day"
                    size="large"
                    :disabled-date="time => time.getTime() < Date.now()"
                    @change="updateDate"
                />
            </el-form-item>
            <el-form-item label="Appointment Time" prop="startTime">
                <el-time-picker
                format="HH:mm"
                v-model="time.startTime"
                placeholder="Pick a time"
                size="large"
                @change="updateStartTime"
                />
            </el-form-item>
            <el-form-item label="Estimated End Time" prop="endTime">
                <el-time-picker
                format="HH:mm"
                v-model="time.endTime"
                placeholder="Pick an estimated end time"
                size="large"
                @change="updateEndTime"
                />
                <el-switch
                style="margin-left: 20px;"
                v-model="time.isTomorrow"
                active-text="Tommorow"
                size="large"
                @change="updateIsTomorrow"
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import dayjs from 'dayjs';
const emits = defineEmits(['update:date', 'update:start', 'update:end', 'update:tomorrow']);
const props = defineProps({
    time: {
        type: Object,
        required: true
    }
})

const date = ref(null);
const isTomorrow = ref(false);

const updateDate = (date) => {
    console.log(date);
    emits('update:date', dayjs(date).format('YYYY-MM-DD'));
}
const updateStartTime = (time) => {
    console.log(time);
    emits('update:start', time);
}
const updateEndTime = (time) => {
    console.log(time);
    emits('update:end', time);
}
const updateIsTomorrow = (isTomorrow) => {
    console.log(isTomorrow);
    emits('update:tomorrow', isTomorrow);
}

watchEffect(() => {
    if (!props.time) return;
    date.value = props.time.date;
})

</script>

<style scoped>
</style>
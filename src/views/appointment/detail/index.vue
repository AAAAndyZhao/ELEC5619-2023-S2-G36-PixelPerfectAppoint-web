<template>
    <div class="app-appointment-detail">
        <div class="app-title">
            <h2>
                <el-button v-if="isCreator" :icon="Edit" circle class="app-edit-button"
                    @click="openDialog('title')"></el-button>
                {{ appointmentData.title }}
            </h2>
        </div>
        <div class="app-content">
            <section class="app-creator-info">
                <el-skeleton style="--el-skeleton-circle-size: 70px" animated
                    :loading="skeletonLoading">
                    <template #template>
                        <div class="app-creator-info-skeleton-template">
                            <el-skeleton-item variant="circle" />
                            <el-skeleton-item :rows="1" animated />
                        </div>
                    </template>
                </el-skeleton>
                <user-info-detail
                    v-if="appointmentData?.creator"
                    :user="appointmentData?.creator"/>
            </section>
            <el-divider />
            <section class="app-description">
                <h3>
                    Description
                    <el-button v-if="isCreator" :icon="Edit" circle class="app-edit-button"
                    @click="openDialog('description')"></el-button>
                </h3>
                <el-skeleton :rows="5" animated :loading="skeletonLoading">
                    <div class="app-description-text">{{ appointmentData?.description }}</div>
                </el-skeleton>
            </section>
            <el-divider />
            <section class="app-time-info">
                <h3>
                    Appointment Date & Time
                    <el-button v-if="isCreator" :icon="Edit" circle class="app-edit-button"
                    @click="openDialog('time')"></el-button>
                </h3>
                <el-skeleton :rows="4" animated :loading="skeletonLoading">
                    <div class="app-time-info-content">
                        <div class="app-info-item">
                            <el-icon :size="40"><Calendar /></el-icon>
                            <span>{{ dayjs(appointmentData?.appointDatetime).format('YYYY-MM-DD') }}</span>
                        </div>
                        <div class="app-info-item">
                            <el-icon :size="40"><Timer /></el-icon>
                            <span>{{ dayjs(appointmentData?.appointDatetime).format('HH:mm:ss') }} (24h)</span>
                        </div>
                        <div class="app-info-item">
                            <el-icon :size="40"><Camera /></el-icon>
                            <span>{{ appointmentData?.estimateDuration }} mins</span>
                        </div>
                    </div>
                </el-skeleton>
            </section>
            <el-divider />
            <section class="app-location-info">
                <h3>
                    Location
                    <el-button v-if="isCreator" :icon="Edit" circle class="app-edit-button"
                    @click="openDialog('location')"></el-button>
                </h3>
                <el-skeleton :rows="1" animated :loading="skeletonLoading">
                    <el-link class="app-location-text">{{ locationStr }}</el-link>
                    <MapShow :location="appointmentData?.location"/>
                </el-skeleton>
            </section>
            <el-divider />
            <section class="app-participants">
                <h3>Participants<el-button v-if="isCreator" :icon="Edit" circle class="app-edit-button"></el-button></h3>
                <el-skeleton :rows="5" animated :loading="skeletonLoading">
                    <div class="app-participants-content">
                        <participant-info
                            v-for="participant in appointmentData?.participants"
                            :key="participant.id"
                            :user="participant.user"
                            :role="participant.role"
                            :status="participant.status">
                            <el-button>tst</el-button>
                        </participant-info>
                    </div>
                </el-skeleton>
            </section>
            <el-divider />
        </div>
        <el-dialog v-model="editDialogVisible.title" class="app-edit-dialog">
            <template #header>
                <h3>Edit Title</h3>
            </template>
            <title-edit v-model:title="editProps.title"/>
            <template #footer>
                <el-button @click="cancelUpdate.title">Cancel</el-button>
                <el-button type="primary" @click="confirmUpdate.title">Confirm</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editDialogVisible.description" class="app-edit-dialog">
            <template #header>
                <h3>Edit Description</h3>
            </template>
            <description-edit v-model:description="editProps.description"/>
            <template #footer>
                <el-button @click="cancelUpdate.description">Cancel</el-button>
                <el-button type="primary" @click="confirmUpdate.description">Confirm</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editDialogVisible.time" class="app-edit-dialog" width="500px">
            <template #header>
                <h3>Edit Date & Time</h3>
            </template>
            <time-edit v-model:time="editProps.time"
            @update:date="updateTime.date"
            @update:start="updateTime.startTime"
            @update:end="updateTime.endTime"
            @update:tomorrow="updateTime.isTomorrow"/>
            <template #footer>
                <el-button @click="cancelUpdate.time">Cancel</el-button>
                <el-button type="primary" @click="confirmUpdate.time">Confirm</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editDialogVisible.location" class="app-edit-dialog app-map-edit-dialog"
        width="80vw">
            <template #header>
                <h3>Edit Location</h3>
            </template>
            <location-edit :location="editProps.location" @update:location="updateLocation"/>
            <template #footer>
                <el-button @click="cancelUpdate.location">Cancel</el-button>
                <el-button type="primary" @click="confirmUpdate.location">Confirm</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import dayjs from 'dayjs';
import { Edit } from '@element-plus/icons-vue';
import appointmentApi from '@/services/appointment-api';
import router from '@/router';
import PhotoImage from '@/components/photo/photo-image.vue';
import UserInfoDetail from '@/components/user/user-info-detail.vue';
import MapShow from '@/components/map/map-show.vue';
import ParticipantInfo from '@/components/appointment/participant-info.vue';
import TitleEdit from '@/views/appointment/detail/title-edit.vue';
import DescriptionEdit from '@/views/appointment/detail/desc-edit.vue';
import TimeEdit from '@/views/appointment/detail/time-edit.vue';
import LocationEdit from '@/views/appointment/detail/location-edit.vue';

const props = defineProps({
    appointmentId: {
        type: String,
        required: false,
    }
})
const skeletonLoading = ref(true)
const appointmentData = ref({})
const editDialogVisible = ref({
    title: false,
    description: false,
    time: false,
    location: false,
    participants: false,
})
const editProps = ref({
    title: '',
    description: '',
    time: {},
    location: {},
    participants: [],
})

const isCreator = computed(() => {
    return localStorage.getItem('userId') === appointmentData.value?.creator?.id;
})

const fetchAppointmentDetail = async () => {
    try{
        const res = await appointmentApi.getAppointmentById(props.appointmentId);
        if (res.code === 0 && res.data.length > 0){
            appointmentData.value = res.data[0]
            skeletonLoading.value = false
        }else{
            // 404
            router.push('/404')
        }
        console.log(res)
    }catch(error){
        console.error(error)
    }finally{
    }
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

const openDialog = (propName) => {
    // copy value
    switch (propName) {
        case 'title':
        case 'description':
        case 'location':
            editProps.value[propName] = appointmentData.value[propName];
            break;
        case 'time':
            editProps.value[propName] = {
                date: dayjs(appointmentData.value.appointDatetime).format('YYYY-MM-DD'),
                startTime: dayjs(appointmentData.value.appointDatetime).toDate(),
                // calculated by estimateDuration and startTime
                endTime: dayjs(appointmentData.value.appointDatetime).add(appointmentData.value.estimateDuration, 'minute').toDate(),
                duration: appointmentData.value.estimateDuration,
                isTomorrow: false
            }
            break;
        default:
            break;
    }
    editDialogVisible.value[propName] = true;
}

const closeDialog = (propName) => {
    editDialogVisible.value[propName] = false;
}

const syncEstimatedDuration = (date) => {
    // calculate duration, consider end time is tomorrow
    const startTime = dayjs(editProps.value.time.startTime);
    let endTime = dayjs(editProps.value.time.endTime);
    if (editProps.value.time.isTomorrow) {
        endTime = endTime.add(1, 'day');
    }
    const duration = endTime.diff(startTime, 'minute');
    editProps.value.time.duration = duration;
}
const updateTime = {
    date: (date) => {
        editProps.value.time.date = date;
        syncEstimatedDuration()
    },
    startTime: (time) => {
        editProps.value.time.startTime = time;
        syncEstimatedDuration()
    },
    endTime: (time) => {
        editProps.value.time.endTime = time;
        syncEstimatedDuration()
    },
    isTomorrow: (isTomorrow) => {
        editProps.value.time.isTomorrow = isTomorrow;
        syncEstimatedDuration()
    }
}

const updateLocation = (location) => {
    editProps.value.location = location;
}

const confirmUpdate = {
    title: () => {
        appointmentData.value.title = editProps.value.title;
        closeDialog('title');
    },
    description: () => {
        appointmentData.value.description = editProps.value.description;
        closeDialog('description');
    },
    time: () => {
        appointmentData.value.appointDatetime = dayjs(editProps.value.time.date).format('YYYY-MM-DD') + ' ' + dayjs(editProps.value.time.startTime).format('HH:mm:ss');
        appointmentData.value.estimateDuration = editProps.value.time.duration;
        closeDialog('time');
    },
    location: () => {
        appointmentData.value.location = editProps.value.location;
        closeDialog('location');
    },
    participants: () => {
        appointmentData.value.participants = editProps.value.participants;
        closeDialog('participants');
    }
}

const cancelUpdate = {
    title: () => {
        editProps.value.title = '';
        closeDialog('title');
    },
    description: () => {
        editProps.value.description = '';
        closeDialog('description');
    },
    time: () => {
        editProps.value.time = {};
        closeDialog('time');
    },
    location: () => {
        editProps.value.location = {};
        closeDialog('location');
    },
    participants: () => {
        editProps.value.participants = [];
        closeDialog('participants');
    }
}

onMounted(() => {
    if (props.appointmentId){
        fetchAppointmentDetail()
    }else{
        // 404
        router.push('/404')
    }
})
</script>

<style scoped>
.app-appointment-detail{
    min-height: calc(100vh - 100px);
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
}
.app-appointment-detail .app-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 20px;
}
.app-appointment-detail .app-content{
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    text-align: left;
}
.app-creator-info{
    
}
.app-description-text{
    /* allow line break */
    white-space: pre-wrap;
}
.app-time-info-content{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 35px;
    .app-info-item{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
}
.app-creator-info-skeleton-template{
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-around;
    gap: 20px;
}
.app-location-text{
    margin-bottom: 20px;
}

.app-edit-button{
    margin-left: 10px;
}
.app-edit-dialog h3{
    margin: 0;
}
</style>
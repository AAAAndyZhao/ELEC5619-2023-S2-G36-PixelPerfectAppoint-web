<template>
    <div class="app-appointment-detail">
        <div class="app-title">
            <el-button v-if="isCreator" :icon="Edit" circle class="app-edit-button" @click="openDialog('title')"
                :disabled="disableEditing"></el-button>
            <el-tag :type="appointmentStatus?.tagType">{{ appointmentStatus?.value }}</el-tag>
            <h2>{{ appointmentData.title }}</h2>
            <el-dropdown v-if="isCreator && !disableEditing" class="app-creator-operation-dropdown">
                <el-button class="app-creator-button" readonly size="default">Creator Operations</el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleCompleteAppointment" class="app-creator-dropdown-item">
                            <el-icon color="#67C23A">
                                <Check />
                            </el-icon>Complete
                        </el-dropdown-item>
                        <el-dropdown-item @click="handleCancelAppointment" class="app-creator-dropdown-item">
                            <el-icon color="#F56C6C">
                                <Close />
                            </el-icon>Cancel
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="app-content">
            <section class="app-creator-info">
                <el-skeleton style="--el-skeleton-circle-size: 70px" animated :loading="skeletonLoading">
                    <template #template>
                        <div class="app-creator-info-skeleton-template">
                            <el-skeleton-item variant="circle" />
                            <el-skeleton-item :rows="1" animated />
                        </div>
                    </template>
                </el-skeleton>
                <user-info-detail v-if="appointmentData?.creator" :user="appointmentData?.creator" />
            </section>
            <el-divider />
            <section class="app-description">
                <h3>
                    Description
                    <el-button v-if="isCreator" :icon="Edit" circle class="app-edit-button"
                        @click="openDialog('description')" :disabled="disableEditing"></el-button>
                </h3>
                <el-skeleton :rows="5" animated :loading="skeletonLoading">
                    <div class="app-description-text">{{ appointmentData?.description }}</div>
                </el-skeleton>
            </section>
            <el-divider />
            <section class="app-time-info">
                <h3>
                    Appointment Date & Time
                    <el-button v-if="isCreator" :icon="Edit" circle class="app-edit-button" @click="openDialog('time')"
                        :disabled="disableEditing"></el-button>
                </h3>
                <el-skeleton :rows="4" animated :loading="skeletonLoading">
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
                </el-skeleton>
            </section>
            <el-divider />
            <section class="app-location-info">
                <h3>
                    Location
                    <el-button v-if="isCreator" :icon="Edit" circle class="app-edit-button" @click="openDialog('location')"
                        :disabled="disableEditing"></el-button>
                </h3>
                <el-skeleton :rows="1" animated :loading="skeletonLoading">
                    <el-link class="app-location-text">{{ locationStr }}</el-link>
                    <MapShow :location="appointmentData?.location" />
                </el-skeleton>
            </section>
            <el-divider />
            <section class="app-participants">
                <h3>
                    Participants
                    <el-button v-if="isCreator" :icon="Plus" circle class="app-edit-button"
                    @click="openDialog('participants-add')"></el-button>
                </h3>
                <el-skeleton :rows="5" animated :loading="skeletonLoading">
                    <div class="app-participants-content">
                        <participant-info v-for="participant in appointmentData?.participants" :key="participant.id"
                            :user="participant.user" :role="participant.role" :status="participant.status"
                            @role-change="handleChangeParticipantRole">
                            <el-button v-if="isCreator && participant.user.id !== currentUserId" type="danger" size="small"
                            @click="removeParticipant(participant)">Remove</el-button>
                        </participant-info>
                    </div>
                </el-skeleton>
            </section>
            <el-divider />
            <section class="app-reviews">
                <h3>
                    Reviews
                    <el-button :icon="Plus" circle class="app-edit-button"
                    @click="openDialog('review-add')"></el-button>
                </h3>
                <el-skeleton :rows="5" animated :loading="skeletonLoading">
                    <el-timeline>
                        <el-timeline-item v-for="review in appointmentData.reviews" :key="review"
                        :timestamp="review.updateAt" placement="top">
                            <user-appointment-review
                            :participant="review.participant"
                            :target-participant="review.targetParticipant"
                            :content="review.content"
                            :rating="review.rating"
                            />
                        </el-timeline-item>
                    </el-timeline>
                </el-skeleton>
            </section>
        </div>
        <el-dialog v-model="editDialogVisible.title" class="app-edit-dialog" destroy-on-close>
            <template #header>
                <h3>Edit Title</h3>
            </template>
            <title-edit v-model:title="editProps.title" />
            <template #footer>
                <el-button @click="cancelUpdate.title">Cancel</el-button>
                <el-button type="primary" @click="confirmUpdate.title">Confirm</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editDialogVisible.description" class="app-edit-dialog" destroy-on-close>
            <template #header>
                <h3>Edit Description</h3>
            </template>
            <description-edit v-model:description="editProps.description" />
            <template #footer>
                <el-button @click="cancelUpdate.description">Cancel</el-button>
                <el-button type="primary" @click="confirmUpdate.description">Confirm</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editDialogVisible.time" class="app-edit-dialog" width="500px" destroy-on-close>
            <template #header>
                <h3>Edit Date & Time</h3>
            </template>
            <time-edit v-model:time="editProps.time" @update:date="updateTime.date" @update:start="updateTime.startTime"
                @update:end="updateTime.endTime" @update:tomorrow="updateTime.isTomorrow" />
            <template #footer>
                <el-button @click="cancelUpdate.time">Cancel</el-button>
                <el-button type="primary" @click="confirmUpdate.time">Confirm</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editDialogVisible.location" class="app-edit-dialog app-map-edit-dialog" width="80vw"
            destroy-on-close>
            <template #header>
                <h3>Edit Location</h3>
            </template>
            <location-edit :location="editProps.location" @update:location="updateLocation" />
            <template #footer>
                <el-button @click="cancelUpdate.location">Cancel</el-button>
                <el-button type="primary" @click="confirmUpdate.location">Confirm</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editDialogVisible.participants.role" class="app-edit-dialog" width="20vw" destroy-on-close>
            <template #header>
                <h3>Edit Role</h3>
            </template>
            <participant-edit-role :participant="editProps.currentParticipant" @update:role="updateRole" />
            <template #footer>
                <el-button @click="cancelUpdate.participants('role')">Cancel</el-button>
                <el-button type="primary" @click="confirmUpdate.participants.role">Confirm</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editDialogVisible.participants.add" class="app-edit-dialog" width="50vw" destroy-on-close>
            <template #header>
                <h3>Invite Participant</h3>
            </template>
            <participant-add :participants="appointmentData.participants" @invite-user="inviteParticipant" />
            <template #footer>
                <el-button @click="cancelUpdate.participants('add')">Close</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editDialogVisible.reviewAdd" class="app-edit-dialog" width="30vw" destroy-on-close>
            <template #header>
                <h3>Add Review</h3>
            </template>
            <review-add
                :participants="appointmentData.participants"
                :exist-reviews="appointmentData.reviews"
                @update:review="updateReview" />
            <template #footer>
                <el-button @click="cancelUpdate.reviewAdd">Close</el-button>
                <el-button type="primary" @click="confirmUpdate.reviewAdd" :disabled="!editProps.review.targetParticipantId">Confirm</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import { Edit, Plus } from '@element-plus/icons-vue';
import appointmentApi from '@/services/appointment-api';
import router from '@/router';
import MenuUtils from '@/utils/menu';
import PhotoImage from '@/components/photo/photo-image.vue';
import UserInfoDetail from '@/components/user/user-info-detail.vue';
import MapShow from '@/components/map/map-show.vue';
import ParticipantInfo from '@/components/appointment/participant-info.vue';
import TitleEdit from '@/views/appointment/detail/title-edit.vue';
import DescriptionEdit from '@/views/appointment/detail/desc-edit.vue';
import TimeEdit from '@/views/appointment/detail/time-edit.vue';
import LocationEdit from '@/views/appointment/detail/location-edit.vue';
import ParticipantEditRole from '@/views/appointment/detail/participant-edit-role.vue';
import ParticipantAdd from '@/views/appointment/detail/participant-add.vue';
import ReviewAdd from '@/views/appointment/detail/review-add.vue';
import UserAppointmentReview from '@/components/appointment/user-appointment-review.vue';

const props = defineProps({
    appointmentId: {
        type: String,
        required: false,
    }
})
const skeletonLoading = ref(true)
const appointmentData = ref({})
const appointmentStatusMenu = $MENU['APPOINTMENT_STATUS']
const editDialogVisible = ref({
    title: false,
    description: false,
    time: false,
    location: false,
    participants: {
        role: false,
        add: false
    },
    reviewAdd: false,
})
const editProps = ref({
    title: '',
    description: '',
    time: {},
    location: {},
    currentParticipant: {},
    review: {}
})
const roleMenu = $MENU['APPOINTMENT_PARTICIPANT_ROLE']
const currentUserId = localStorage.getItem('userId')
const isCreator = computed(() => {
    return currentUserId === appointmentData.value?.creator?.id;
})
const appointmentStatus = computed(() => {
    if (!appointmentData.value) {
        return 'No Status';
    }
    const status = MenuUtils.getSingleMenuSelectedValue(appointmentStatusMenu, appointmentData.value?.status);
    return status
})
const disableEditing = computed(() => {
    return appointmentData.value?.status === 2 || appointmentData.value?.status === 3;
})
const fetchAppointmentDetail = async () => {
    try {
        const res = await appointmentApi.getAppointmentById(props.appointmentId);
        if (res.code === 0 && res.data.length > 0) {
            appointmentData.value = res.data[0]
            skeletonLoading.value = false
        } else {
            // 404
            router.push('/404')
        }
    } catch (error) {
        console.error(error)
    } finally {
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

const openDialog = (propName, participantId) => {
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
        case 'participants-role':
            Object.assign(editProps.value.currentParticipant, appointmentData.value.participants.find(participant => participant.user.id === participantId));
            break;
        case 'participants-add':
            // do nothing
            break;
        case 'review-add':
            // do nothing
            break;
        default:
            break;
    }
    if (propName === 'participants-role') {
        editDialogVisible.value.participants.role = true;
    } else if (propName === 'participants-add') {
        editDialogVisible.value.participants.add = true;
    } else if (propName === 'review-add') {
        editDialogVisible.value.reviewAdd = true;
    } else {
        editDialogVisible.value[propName] = true;
    }
}

const closeDialog = (propName) => {
    if (propName === 'participants-role') {
        editDialogVisible.value.participants.role = false;
    } else if (propName === 'participants-add') {
        editDialogVisible.value.participants.add = false;
        fetchAppointmentDetail();
    } else if (propName === 'review-add') {
        editDialogVisible.value.reviewAdd = false;
        fetchAppointmentDetail();
    } else {
        editDialogVisible.value[propName] = false;
    }
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
const updateRole = (role) => {
    editProps.value.currentParticipant.role = role;
}
const confirmUpdate = {
    title: async () => {
        try {
            if (!editProps.value.title) {
                ElMessage.error('title cannot be empty')
                return
            }
            if (editProps.value.title.length > 50) {
                ElMessage.error('title cannot be longer than 50 characters')
                return
            }
            appointmentData.value.title = editProps.value.title;
            closeDialog('title');
            const res = await appointmentApi.updateAppointmentFunctionMap.title(appointmentData.value.id, editProps.value.title);
            if (res.code === 0) {
                ElMessage.success('update title success')
            } else {
                console.error('update title failed: ' + res.msg)
                ElMessage.error('update title failed: ' + res.msg)
                fetchAppointmentDetail()
            }
        } catch (error) {
            console.error(error)
            ElMessage.error('update title failed: ' + error.message)
            fetchAppointmentDetail()
        }
    },
    description: async () => {
        try {
            if (!editProps.value.description) {
                ElMessage.error('description cannot be empty')
                return
            }
            if (editProps.value.description.length > 1000) {
                ElMessage.error('description cannot be longer than 1000 characters')
                return
            }
            appointmentData.value.description = editProps.value.description;
            closeDialog('description');
            const res = await appointmentApi.updateAppointmentFunctionMap.description(appointmentData.value.id, editProps.value.description);
            if (res.code === 0) {
                ElMessage.success('update description success')
            } else {
                console.error('update description failed: ' + res.msg)
                ElMessage.error('update description failed: ' + res.msg)
                fetchAppointmentDetail()
            }
        } catch (error) {
            console.error(error)
            ElMessage.error('update description failed: ' + error.message)
            fetchAppointmentDetail()
        }
    },
    time: async () => {
        try {
            if (!editProps.value.time.date) {
                ElMessage.error('date cannot be empty')
                return
            }
            if (!editProps.value.time.startTime) {
                ElMessage.error('start time cannot be empty')
                return
            }
            if (!editProps.value.time.endTime) {
                ElMessage.error('end time cannot be empty')
                return
            }
            if (editProps.value.time.duration <= 0) {
                ElMessage.error('duration must be greater than 0')
                return
            }

            appointmentData.value.appointDatetime = dayjs(editProps.value.time.date).format('YYYY-MM-DD') + ' ' + dayjs(editProps.value.time.startTime).format('HH:mm:ss');
            appointmentData.value.estimateDuration = editProps.value.time.duration;
            closeDialog('time');
            const res = await appointmentApi.updateAppointmentFunctionMap.time(appointmentData.value.id, appointmentData.value.appointDatetime, appointmentData.value.estimateDuration);
            if (res.code === 0) {
                ElMessage.success('update time success')
            } else {
                console.error('update time failed: ' + res.msg)
                ElMessage.error('update time failed: ' + res.msg)
                fetchAppointmentDetail()
            }
        } catch (error) {
            console.error(error)
            ElMessage.error('update time failed: ' + error.message)
            fetchAppointmentDetail()
        }
    },
    location: async () => {
        try {
            if (!editProps.value.location) {
                ElMessage.error('location cannot be empty')
                return
            }

            appointmentData.value.location = editProps.value.location;
            closeDialog('location');
            const res = await appointmentApi.updateAppointmentFunctionMap.location(appointmentData.value.id, editProps.value.location);
            if (res.code === 0) {
                ElMessage.success('update location success')
            } else {
                console.error('update location failed: ' + res.msg)
                ElMessage.error('update location failed: ' + res.msg)
                fetchAppointmentDetail()
            }
        } catch (error) {
            console.error(error)
            ElMessage.error('update location failed: ' + error.message)
            fetchAppointmentDetail()
        }
    },
    participants: {
        role: async () => {
            try {
                if (editProps.value.currentParticipant.role === null
                    && editProps.value.currentParticipant.role === undefined) {
                    ElMessage.error('role cannot be empty')
                    return
                }
                if (editProps.value.currentParticipant.role < roleMenu[0].code
                    || editProps.value.currentParticipant.role > roleMenu[roleMenu.length - 1].code) {
                    ElMessage.error('role is invalid')
                    return
                }
                appointmentData.value.participants.find(participant => participant.user.id === editProps.value.currentParticipant.user.id).role = editProps.value.currentParticipant.role;
                closeDialog('participants-role');
                const res = await appointmentApi.updateAppointmentFunctionMap.participant.role(appointmentData.value.id, editProps.value.currentParticipant.user.id, editProps.value.currentParticipant.role);
                if (res.code === 0) {
                    ElMessage.success('update role success')
                } else {
                    console.error('update role failed: ' + res.msg)
                    ElMessage.error('update role failed: ' + res.msg)
                    fetchAppointmentDetail()
                }
            } catch (error) {
                console.error(error)
                ElMessage.error('update role failed: ' + error.message)
                fetchAppointmentDetail()
            }
        }
    },
    reviewAdd: async () => {
        try {
            const res = await appointmentApi.addReview({
                appointmentId: appointmentData.value.id,
                targetParticipantId: editProps.value.review.targetParticipantId,
                content: editProps.value.review.content,
                rating: editProps.value.review.rating
            });
            if (res.code === 0){
                ElMessage.success('Review added');
                fetchAppointmentDetail()
                closeDialog('review-add');
            } else {
                console.error(res.msg);
                ElMessage.error('Failed to add review: ' + res.msg);
            }
        } catch (e) {
            console.error(e);
            ElMessage.error('Failed to add review');
        }
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
    participants: (field) => {
        editProps.value.participants = {};
        if (field === 'role') {
            closeDialog('participants-role');
        } else if (field === 'add') {
            closeDialog('participants-add');
        }
    },
    reviewAdd: () => {
        editProps.value.review = {};
        closeDialog('review-add');
    }
    
}
const handleChangeAppointmentStatus = (appointment, statusCode) => {
    let confirmText;
    let confirmType;
    if (statusCode === 2) {
        // complete
        confirmText = 'Are you sure to complete the appointment?';
        confirmType = 'warning';
    } else if (statusCode === 3) {
        // cancel
        confirmText = 'Are you sure to cancel the appointment?';
        confirmType = 'error';
    } else {
        return;
    }
    ElMessageBox.confirm(confirmText, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: confirmType
    }).then(async () => {
        try {
            const res = await appointmentApi.changeAppointmentStatusByCreator(appointment.id, statusCode);
            if (res.code === 0) {
                ElMessage.success('Change appointment status successfully');
                fetchAppointmentDetail()
            } else {
                console.error(res.msg);
                ElMessage.error('Failed to change appointment status: ' + res.msg);
            }
        } catch (e) {
            console.error(e);
            ElMessage.error('Failed to change appointment status');
        }
    }).catch(() => {
        // do nothing
    })
}
const handleCompleteAppointment = () => {
    handleChangeAppointmentStatus(appointmentData.value, 2);
}
const handleCancelAppointment = () => {
    handleChangeAppointmentStatus(appointmentData.value, 3);
}
const handleChangeParticipantRole = (userId) => {
    openDialog('participants-role', userId)
}
const removeParticipant = (participant) => {
    const confirmText = 'Are you sure to remove the participant from the appointment?';
    const userId = participant.user.id;
    ElMessageBox.confirm(confirmText, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'error'
    }).then(async () => {
        try {
            const res = await appointmentApi.removeParticipant(appointmentData.value.id, participant.user.id);
            if (res.code === 0){
                ElMessage.success('Remove participant successfully');
                fetchAppointmentDetail()
            } else {
                console.error(res.msg);
                ElMessage.error('Failed to remove participant: ' + res.msg);
            }
        } catch (e) {
            console.error(e);
            ElMessage.error('Failed to remove participant');
        }
    }).catch(() => {
        // do nothing
    })
}

const inviteParticipant = async (participant) => {
    try {
        const res = await appointmentApi.inviteParticipant(appointmentData.value.id, participant.id);
        if (res.code === 0){
            ElMessage.success('Participant invited');
            fetchAppointmentDetail()
        } else {
            console.error(res.msg);
            ElMessage.error('Failed to invite participant: ' + res.msg);
        }
    } catch (e) {
        console.error(e);
        ElMessage.error('Failed to invite participant');
    }
}

const updateReview = async (review) => {
    editProps.value.review = review
}

onMounted(() => {
    if (props.appointmentId) {
        fetchAppointmentDetail()
    } else {
        // 404
        router.push('/404')
    }
})
</script>

<style scoped>
.app-appointment-detail {
    min-height: calc(100vh - 100px);
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
}

.app-appointment-detail .app-title {
    margin-left: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    gap: 20px;
}

.app-appointment-detail .app-title .app-creator-operation-dropdown {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
}

.app-creator-button,
:deep(.app-creator-dropdown-item) {
    width: 160px;
}

:deep(.app-creator-dropdown-item) {
    width: 160px;
    justify-content: left;
    padding: 7px 19px;
    box-sizing: border-box;
    height: 30px;
}

.app-appointment-detail .app-content {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    text-align: left;
}

.app-description-text {
    /* allow line break */
    white-space: pre-wrap;
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

.app-creator-info-skeleton-template {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-around;
    gap: 20px;
}

.app-location-text {
    margin-bottom: 20px;
}

.app-edit-button {
    margin-left: 10px;
}

.app-edit-dialog h3 {
    margin: 0;
}
</style>
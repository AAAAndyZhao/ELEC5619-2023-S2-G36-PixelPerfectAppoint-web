<template>
    <div class="app-user-appointment-table-container">
        <el-table class="app-user-appointment-table"
            empty-text="No Appointment Data"
            size="large"
            height="100%"
            :row-class-name="tableRowClassName"
            show-overflow-tooltip
            :data="data">
            <el-table-column
                label="No."
                type="index"
                width="70"
                :index="rowIndexStart" />
            <el-table-column
                prop="title"
                label="Title"
                width="300">
                <template #default="scope">
                    <el-link @click="handleView(scope.row)">{{ scope.row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="appointDatetime"
                label="Appointment Datetime"
                width="250" />
            <el-table-column
                prop="estimateDuration"
                label="Estimate Duration"
                width="150"
                :formatter="(row, column, cellValue, index) => `${cellValue} mins`" />
            <el-table-column
                prop="location"
                label="Location"
                width="250">
                <template #default="scope">
                    <div class="app-location-cell" @click="() => handleClickLocation(scope.row)">
                        <el-icon><Position /></el-icon>
                        <span>{{ simpleLocation(scope.row.location) }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="creator"
                label="Creator"
                width="300">
                <template #default="scope">
                    <div style="display: flex; align-items: center;">
                        <el-avatar :src="scope.row.creator.avatar" :size="40" />
                        <span style="margin-left: 10px;">{{ scope.row.creator.alias }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="Participants">
                <template #default="scope">
                    <div style="display: flex; align-items: center;">
                        <el-avatar v-for="participant in scope.row.participants" :key="participant.id" :src="participant.avatar" :size="40" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="Status"
                width="150">
                <template #default="scope">
                    <div style="display: flex; align-items: center;">
                        <el-tag size="large" :type="getAppointmentStatusTagType(scope.row.status)">{{ getAppointmentStatus(scope.row.status) }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column>
                <template #default="scope">
                    <div class="app-appointment-operation">
                        <el-button type="primary" size="default" @click="handleView(scope.row)">View</el-button>
                        <el-button v-if="userId !== scope.row.creator.id" type="danger" size="default" @click="handleQuit(scope.row)">Quit</el-button>
                        <el-dropdown v-if="userId === scope.row.creator.id">
                            <el-button
                            class="app-creator-button"
                            readonly
                            size="default">Creator Operations</el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleEdit(scope.row)"
                                    class="app-creator-dropdown-item">
                                        <el-icon><Edit /></el-icon>Edit
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="handleComplete(scope.row)"
                                    class="app-creator-dropdown-item">
                                        <el-icon><Check /></el-icon>Complete
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="handleCancel(scope.row)"
                                    class="app-creator-dropdown-item">
                                        <el-icon><Close /></el-icon>Cancel
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog class="app-map-show-dialog" v-model="showMapDialog">
            <template #header>
                <h3 style="text-align: left; margin: 0;">Location</h3>
            </template>
            <MapShow :location="selectedAppointment.location" />
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Position } from '@element-plus/icons-vue';
import MenuUtils from '@/utils/menu';
import MapShow from '@/components/map/map-show.vue';

const emits = defineEmits(['change-status', 'view', 'edit', 'quit']);
const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    page: {
        type: Number,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
});
const rowIndexStart = computed(() => {
    return (props.page - 1) * props.size + 1;
});
const showMapDialog = ref(false);
const selectedAppointment = ref({});
const userId = localStorage.getItem('userId');

const tableRowClassName = ({ row, rowIndex }) => {
    const status = row.status;
    const statusResult = MenuUtils.getSingleMenuSelectedValue($MENU['APPOINTMENT_STATUS'], status);
    if (!statusResult) {
        return '';
    }
    if (statusResult.tagType === '') {
        return 'app-table-row-open';
    } else if (statusResult.tagType === 'success') {
        return 'app-table-row-completed';
    }
    return 'app-table-row-not-active';
}

const simpleLocation = (location) => {
    if (!location) {
        return 'No Location';
    }
    const locationArray = [
        `${location.streetNo ? location.streetNo + ' ' : ''}${location.streetName}`,
        location.city,
        `${location.state} ${location.zipCode}`,
        location.country,
    ];
    return locationArray.filter((item) => item).join(', ');
}

const getAppointmentStatus = (status) => {
    const statusResult = MenuUtils.getSingleMenuSelectedValue($MENU['APPOINTMENT_STATUS'], status);
    if (!statusResult) {
        return 'No Status';
    }
    return statusResult.value;
}
const getAppointmentStatusTagType = (status) => {
    const statusResult = MenuUtils.getSingleMenuSelectedValue($MENU['APPOINTMENT_STATUS'], status);
    if (!statusResult) {
        return 'info';
    }
    return statusResult.tagType;
}
const handleClickLocation = (row) => {
    selectedAppointment.value = row;
    showMapDialog.value = true;
}

const handleView = (row) => {
    emits('view', row);
}
const handleEdit = (row) => {
    emits('edit', row);
}
const handleQuit = (row) => {
    emits('quit', row);
}
const handleCancel = (row) => {
    emits('change-status', row, 3);
}
const handleComplete = (row) => {
    emits('change-status', row, 2);
}
</script>

<style scoped>
.app-user-appointment-table-container{
    height: calc(100vh - 390px);
}
.app-user-appointment-table{
    width: 100%;
    text-align: left;
}
:deep(.el-table__row.app-table-row-not-active) {
  --el-table-tr-bg-color: var(--el-color-info-light-9);
}
:deep(.el-table__row.app-table-row-open) {
  --el-table-tr-bg-color: var(--el-color-primary-light-9);
}
:deep(.el-table__row.app-table-row-completed) {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.app-location-cell{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    cursor: pointer;
}
:deep(.app-map-show-dialog .el-dialog__header){
    padding: 10px;
}
:deep(.app-map-show-dialog .el-dialog__body){
    padding-top: 10px;
}

.app-appointment-operation{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
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

</style>
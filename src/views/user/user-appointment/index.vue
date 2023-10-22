<template>
    <div class="app-user-appointment">
        <div class="app-title">
            My Appointment
            <el-button size="large" class="app-create-appointment-button"
            @click="createNewAppointment">
                <el-icon><Plus /></el-icon>Create
            </el-button>
        </div>
        <div class="app-filter-container">
            <el-input class="app-filter app-search-input"
            :prefix-icon="Search" placeholder="Search appointments"
            v-model="filterProps.searchText"
            @keyup.enter.native="fetchAppointmentData(true)"/>
            <el-date-picker
            class="app-filter app-date-range-picker"
            v-model="filterProps.dateRange"
            type="daterange"
            :shortcuts="dateRangeShortcuts"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"/>
            <el-button type="primary" @click="fetchAppointmentData(true)">Search</el-button>
            <div class="app-sort-select-container">
                <label>Sorted by</label>
                <el-select v-model="filterProps.sortedBy" class="app-filter app-sort-select" placeholder="Select" size="large"
                @change="handleSortChange">
                    <el-option
                    v-for="item in sortOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <el-divider></el-divider>
        <div class="app-table-container" v-loading="loading">
            <UserAppointmentTable :data="appointmentData"
            :page="paginationProps.currentPage"
            :size="paginationProps.pageSize"
            @change-status="handleChangeAppointmentStatus"
            @view="handleViewAppointmentDetail"
            @edit="handleEditAppointment"
            @quit="handleQuitFromAppointment"/>
            <el-pagination layout="prev, pager, next"
                :total="paginationProps.total"
                :current-page="paginationProps.currentPage"
                :page-size="paginationProps.pageSize"
                @update:current-page="paginationProps.handleCurrentPageChange"/>
        </div>
    </div>
</template>

<script setup>
import { Search } from '@icon-park/vue-next';
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { ElMessage, ElMessageBox } from 'element-plus';
import UserAppointmentTable from './user-appointment-table.vue';
import appointmentApi from '@/services/appointment-api';
import router from '@/router.js';

const loading = ref(false);
const appointmentData = ref([]);
const sortOptions = ref([{
    label: 'Newest',
    value: 'newest',
    sort: {
        sortedBy: 'latest',
        order: 'desc'
    }
}, {
    label: 'Oldest',
    value: 'oldest',
    sort: {
        sortedBy: 'latest',
        order: 'asc'
    }
}]);

const dateRangeShortcuts = [{
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
}, {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
}, {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
},]

const filterProps = ref({
    searchText: '',
    sortedBy: 'newest',
    notCompletedFirst: false,
    dateRange: []
});

const paginationProps = ref({
    currentPage: 1,
    pageSize: 30,
    total: 0,
    handleCurrentPageChange: (page) => {
        paginationProps.value.currentPage = page;
        fetchAppointmentData();
    }
});

const fetchAppointmentData = async (isReload = false) => {
    loading.value = true;
    if (isReload) {
        paginationProps.value.currentPage = 1;
        appointmentData.value = [];
    }
    const sortedOption = sortOptions.value.find(item => item.value === filterProps.value.sortedBy);
    if (!sortedOption) {
        console.error('Invalid sorted option');
        return;
    };
    let startDateStr;
    let endDateStr;
    if (filterProps.value.dateRange && filterProps.value.dateRange.length === 2){
        startDateStr = dayjs(filterProps.value.dateRange[0]).format('YYYY-MM-DD');
        endDateStr = dayjs(filterProps.value.dateRange[1]).format('YYYY-MM-DD');
    }
    try{
        const res = await appointmentApi.getAppointmentByUser({
            page: paginationProps.value.currentPage,
            size: paginationProps.value.pageSize,
            sortedBy: sortedOption.sort.sortedBy,
            order: sortedOption.sort.order,
            searchText: filterProps.value.searchText,
            start: startDateStr,
            end: endDateStr,
            notCompletedFirst: filterProps.value.notCompletedFirst
        })
        if (res.code === 0){
            appointmentData.value = res.data;
            paginationProps.value.total = res.totalCount;
        }else{
            console.error(res.msg);
            ElMessage.error('Failed to get appointment data: ' + res.msg);
        }
    }catch(e){
        console.error(e);
        ElMessage.error('Failed to get appointment data');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

const handleSortChange = (value) => {
    filterProps.sortedBy = value;
    fetchAppointmentData(true);
}

const handleChangeAppointmentStatus = (appointment, statusCode) => {
    let confirmText;
    if (statusCode === 2){
        // complete
        confirmText = 'Are you sure to complete the appointment?';
    }else if (statusCode === 3){
        // cancel
        confirmText = 'Are you sure to cancel the appointment?';
    }else{
        return;
    }
    ElMessageBox.confirm(confirmText, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
    }).then(async () => {
        try{
            const res = await appointmentApi.changeAppointmentStatusByCreator(appointment.id, statusCode);
            if (res.code === 0){
                ElMessage.success('Change appointment status successfully');
                fetchAppointmentData(true);
            }else{
                console.error(res.msg);
                ElMessage.error('Failed to change appointment status: ' + res.msg);
            }
        }catch(e){
            console.error(e);
            ElMessage.error('Failed to change appointment status');
        }
    }).catch(() => {
        // do nothing
    })
    
}
const handleViewAppointmentDetail = (appointment) => {
    console.log('handleViewAppointmentDetail', appointment);
    router.push({
        path: '/appointment/' + appointment.id
    })
}
const handleEditAppointment = (appointment) => {
    console.log('handleEditAppointment', appointment);
}
const handleQuitFromAppointment = (appointment) => {
    ElMessageBox.confirm('Are you sure to quit from the appointment?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
    }).then(async () => {
        try{
            const res = await appointmentApi.quitAppointment(appointment.id);
            if (res.code === 0){
                ElMessage.success('Quit from appointment successfully');
                fetchAppointmentData(true);
            }else{
                console.error(res.msg);
                ElMessage.error('Failed to quit from appointment: ' + res.msg);
            }
        }catch(e){
            console.error(e);
            ElMessage.error('Failed to quit from appointment');
        }
    }).catch(() => {
        // do nothing
    })
}
const createNewAppointment = () => {
    router.push({
        path: '/appointment/create'
    })
}
onMounted(() => {
    fetchAppointmentData(true);
})
</script>

<style scoped>
.app-user-appointment{
    min-height: 100%;
}
.app-title {
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    text-align: left;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
}
.app-filter-container {
    height: 60px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 20px;
}
:deep(.app-filter-container .app-filter) {
    height: 40px;
    width: 300px;
    box-sizing: border-box;
}
.app-filter-container .app-filter.app-search-input {
    width: 400px;
}
:deep(.app-filter-container .app-filter.app-date-range-picker) {
    width: 400px;
    flex-grow: unset;
}
.app-filter-container .app-filter.app-sort-select {
    width: 200px;
}

.app-sort-select-container{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    flex: 1;
}

.app-table-container {
    height: calc(100% - 160px);
    width: 100%;
    box-sizing: border-box;
    padding: 20px 20px;
    overflow-y: auto;
}

.app-table-container .el-pagination {
    justify-content: center
}
</style>
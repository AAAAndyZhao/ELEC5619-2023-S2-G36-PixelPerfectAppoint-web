<template>
    <div class="app-appointment-detail">
        <div class="app-title">
            <h2>{{ appointmentData.title }}</h2>
        </div>
        <div class="app-content">
            <section class="app-creator-info">
                <el-skeleton style="--el-skeleton-circle-size: 70px" animated>
                    <template #template>
                        <div class="app-creator-info-skeleton-template">
                            <el-skeleton-item variant="circle" />
                            <el-skeleton-item :rows="1" animated />
                        </div>
                    </template>
                </el-skeleton>
            </section>
            <el-divider />
            <section class="app-description">
                <h3>Description</h3>
                <el-skeleton :rows="5" animated />
            </section>
            <el-divider />
            <section class="app-time-info">
                <h3>Appointment Date & Time</h3>
                <el-skeleton :rows="4" animated />
            </section>
            <el-divider />
            <section class="app-location-info">
                <h3>Location</h3>
                <el-skeleton :rows="1" animated />
            </section>
            <el-divider />
            <section class="app-participants">
                <h3>Participants</h3>
                <el-skeleton :rows="5" animated />
            </section>
            <el-divider />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const loading = ref(true)
const appointmentData = ref({
    title: "Appointment Title",
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
    margin-bottom: 20px;
    margin-left: 20px;
}
.app-appointment-detail .app-content{
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    text-align: left;
}
.app-creator-info-skeleton-template{
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-around;
    gap: 20px;
}
</style>
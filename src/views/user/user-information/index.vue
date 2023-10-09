<template>
    <div class="app-user-information">
        <div class="app-title">My Profile</div>
        <div class="profile-view-container">
            <div class="profile-data"><img v-bind:src="profileData.avatarUrl == 'default' ? 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' : profileData.avatarUrl"/></div>
            <div class="profile-label">First Name</div>
            <div class="profile-data">{{profileData.firstName}}</div>
            <div class="profile-label">Last Name</div>
            <div class="profile-data">{{profileData.lastName}}</div>
            <div class="profile-label">Alias</div>
            <div class="profile-data">{{profileData.alias}}</div>
            <div class="profile-label">User Name</div>
            <div class="profile-data">{{profileData.userName}}</div>
            <div class="profile-label">Email</div>
            <div class="profile-data">{{profileData.email}}</div>
            <div class="profile-label">Birthday</div>
            <div class="profile-data">{{profileData.birthday}}</div>
            <div class="profile-label">Description</div>
            <div class="profile-data">{{profileData.description}}</div>
            <div class="profile-label">Gender</div>
            <div class="profile-data">{{profileData.gender}}</div>
            <div class="profile-label">Phone Code</div>
            <div class="profile-data">+{{profileData.phoneCode}}</div>
            <div class="profile-label">Phone Number</div>
            <div class="profile-data">{{profileData.phoneNumber}}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import postApi from '@/services/user-api';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const profileData = ref({});

const fetchProfileData = async () => {
    loading.value = true;
    try{
        const res = await postApi.getUserProfile();
        if (res.code === 0){
            profileData.value = res.data[0];
        }else{
            ElMessage.error('Failed to get profile data');
        }
    }catch(err){
        console.log(err);
        ElMessage.error('Failed to get profile data');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

onMounted(() => {
    fetchProfileData();
});

</script>

<style scoped>
.app-user-information {
    height: 100%;
    min-height: 100%;
}

.app-title {
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    text-align: left;
    font-weight: bold;
}

.profile-label {
    font-size: 18px;
    text-align: left;
    font-weight: bold;
}

.profile-data {
    font-size: 16px;
    text-align: left;
    margin-bottom: 10px;
}
</style>
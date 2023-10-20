<template>
    <div class="app-user-information">
        <div class="app-title-container">
            <div class="app-title">My Profile</div>
        </div>
        <div class="app-info-form-container">
            <div class="app-avatar-container">
                <UserAvatar class="app-user-avatar"
                :size="100" :user="profileData" @click="handleClickAvatar"/> 
            </div>
        </div>
        <UserUploadAvatarDialog :show="showUploadAvatarDialog"/>
    </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import userApi from '@/services/user-api';
import { ElMessage } from 'element-plus';
import router from '@/router';
import moment from "moment";
import { allCountries } from 'country-telephone-data';
import MenuUtils from '@/utils/menu';
import UserAvatar from '@/components/user/user-avatar.vue';
import UserUploadAvatarDialog from '@/components/user/user-upload-avatar-dialog.vue'

const loading = ref(false);
const profileData = ref({});
const showUploadAvatarDialog = ref(false);

const fetchProfileData = async () => {
    loading.value = true;
    try{
        const res = await userApi.getUserProfile();
        console.log(res)
        if (res.code === 0 && res.data !== null && res.data.length > 0){
            profileData.value = res.data[0]
        }else{
            ElMessage.error('Failed to get profile data');
        }
    }catch(err){
        console.error(err);
        ElMessage.error('Failed to get profile data');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

const handleClickAvatar = () => {
    showUploadAvatarDialog.value = false;
    nextTick(() => {
        showUploadAvatarDialog.value = true;
    })
}

onMounted(() => {
    fetchProfileData();
});

</script>

<style scoped>
.app-user-information {
    min-height: calc(100vh - 100px);
}

.app-title-container {
    text-align: left;
    display: flex;
    align-items: center;
}

.app-title {
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    text-align: left;
    font-weight: bold;
}
.app-info-form-container{
    min-height: calc(100vh - 160px);
    text-align: left;
    cursor: pointer;
}

.app-user-avatar:hover {
    border: 1px solid #409eff;
    filter: brightness(0.8);
    transition: all 0.2s;
}
</style>
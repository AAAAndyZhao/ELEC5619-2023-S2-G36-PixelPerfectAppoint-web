<template>
    <div class="app-user-information">
        <div class="app-title-container">
            <div class="app-title">My Profile</div>
        </div>
        <div class="app-info-form-container">
            <div class="app-avatar-container">
                <el-avatar :size="150" :src="profileData.avatar"></el-avatar>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import userApi from '@/services/user-api';
import { ElMessage } from 'element-plus';
import router from '@/router';
import moment from "moment";
import { allCountries } from 'country-telephone-data';
import MenuUtils from '@/utils/menu';

const loading = ref(false);
const profileData = ref({});


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
    min-height: calc(100vh - 100px);
}
</style>
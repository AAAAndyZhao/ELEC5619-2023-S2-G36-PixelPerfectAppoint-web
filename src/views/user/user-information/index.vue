<template>
    <div class="app-user-information">
        <div class="app-title">My Profile</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import postApi from '@/services/user-api';

const loading = ref(false);
const profileData = ref([{}]);

const fetchProfileData = async (isReload = false) => {
    loading.value = true;
    if (isReload){

    }
    try{
        const res = await postApi.getUserInformation(
            filterProps.value
        );
        if (res.code === 0){
            profileData.value = res.data;
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
    fetchProfileData(true);
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
</style>
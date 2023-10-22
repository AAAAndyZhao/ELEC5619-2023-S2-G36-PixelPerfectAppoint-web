<template>
    <div class="app-account-activation-container" v-loading="loading">
        <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/p/vgdgWWIJTQhf1Pg8edVg3VY2f3l049xabq6AONJYm0Pd21d730L85UInxTqGMG8g/n/sdhdhqcmzyxg/b/ppa-assets/o/logo-large-transparent.png" alt="logo" />
        <div class="app-reset-password-content">
            <div v-if="!showContent">
                <el-icon class="is-loading">
                    <Loading />
                </el-icon>
                <h1>Account activating...</h1>
            </div>
            <div v-if="showContent && activateSuccess">
                <el-icon color="#67C23A" :size="100"><Check /></el-icon>
                <h1>Account Activation Success</h1>
                <el-link href="/sign-in">To Sign In</el-link>
            </div>
            <div v-if="showContent && !activateSuccess">
                <el-icon color="#F56C6C" :size="100"><Close /></el-icon>
                <h1>Account Activation Failed</h1>
                <h2>Invalid token</h2>
                <el-link href="/sign-up">To Sign Up</el-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import userApi from '@/services/user-api';
import { ElMessage } from 'element-plus';
const loading = ref(false)
const props = defineProps({
    token: {
        type: String,
        default: '',
    },
})
const showContent = ref(false)
const activateSuccess = ref(false)
const activateAccount = async () => {
    loading.value = true
    try {
        const res = await userApi.activateAccount(props.token)
        if (res.code === 0){
            activateSuccess.value = true;
        }else{
            activateSuccess.value = false;
            ElMessage.error(res.msg)
        }
    } catch (error) {
        console.error(error)
        activateSuccess.value = false;
    } finally {
        setTimeout(() => {
            loading.value = false;
            showContent.value = true;
        }, 1000)
    }
}
onMounted(() => {
    activateAccount()
})
</script>

<style scoped>
.app-account-activation-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.app-account-activation-container img {
    width: 300px;
    height: 300px;
}
</style>
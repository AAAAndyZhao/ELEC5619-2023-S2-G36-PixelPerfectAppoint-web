<template>
    <div class="app-settings-container" v-loading="loading">
        <div class="app-settings-user-info">
            <UserAvatar :user="user" :size="size" />
            <div class="app-settings-user-info-name">{{ user.firstName }} {{ user.lastName }}</div>
            <div class="app-settings-user-info-alias">@{{ user.alias }}</div>
            <div class="app-settings-user-info-email">E-mail: {{ user.email }}
                <el-button class="instagram-button" @click="goToPersonalInformation">
                    Personal Information
                </el-button>
                <el-button class="instagram-button" @click="goToChangPassword">
                    Change Password
                </el-button>
                <el-button type="danger" class="instagram-button-danger" @click="cancelAccount">
                    Cancel Account
                </el-button>
            </div>
        </div>
        <el-dialog v-model="showAccountCancellationConfim" width="30vw">
            <template #header>
                Cancel Account
            </template>
            <account-cancellation-confim :input="confirmInputText" @update:input="(value) => confirmInputText = value" />
            <template #footer>
                <el-button @click="showAccountCancellationConfim = false">Cancel</el-button>
                <el-button type="danger" @click="confirmAccountCancellation"
                    :disabled="confirmInputText !== 'cancel'">Confirm</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import userApi from '@/services/user-api'
import UserAvatar from '@/components/user/user-avatar.vue'
import router from '@/router'
import AccountCancellationConfim from './account-cancellation-confim.vue'

const user = ref({})
const size = ref(120)
const loading = ref(false)
const showAccountCancellationConfim = ref(false)
const confirmInputText = ref('')

const fetchUserInfo = async () => {
    const userId = localStorage.getItem('userId')
    const res = await userApi.getUserInformation(userId)
    console.log(res)
    if (res.code === 0) {
        user.value = res.data[0]
    }
}

const goToPersonalInformation = () => {
    router.push('profile').then(() => {
        window.location.reload()
        openLoadingPage()
    })
}

const goToChangPassword = () => {
    router.push('/forget-password').then(() => {
        window.location.reload()
        openLoadingPage()
    })
}

const cancelAccount = () => {
    showAccountCancellationConfim.value = true
}

const confirmAccountCancellation = async () => {
    loading.value = true
    try {
        const res = await userApi.cancelAccount();
        if (res.code === 0) {
            ElMessageBox.alert('Account cancelled successfully', 'Success', {
                confirmButtonText: 'OK',
                callback: () => {
                    router.push('/sign-out').then(() => {
                        window.location.reload()
                        openLoadingPage()
                    })
                }
            })
        }
    } catch (error) {
        ElMessage.error('Failed to cancel account')
    }
}


onMounted(() => {
    fetchUserInfo()
})


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Maven+Pro:wght@500&display=swap');

.app-settings-user-info-name {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 10px;
    font-family: 'Pacifico', cursive;
}

.app-settings-user-info-alias {
    font-size: 20px;
    color: #928f8f;
    margin-bottom: 20px;
    font-family: 'Maven Pro', sans-serif;
}

.app-settings-user-info-email {
    font-size: 20px;
    color: #928f8f;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.instagram-button {
    width: 200px;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 20px;
    margin: 5px;
    margin-top: 20px;
    border: none;
    border-radius: 5px;
    background-color: #3897f0;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.3s;
}

.instagram-button-danger {
    width: 200px;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 20px;
    margin: 5px;
    margin-top: 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.instagram-button:hover {
    background-color: #357ABD;
}
</style>
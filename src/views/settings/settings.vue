<template>
    <div class="app-settings-container">
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
    </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import userApi from '@/services/user-api'
import UserAvatar from '@/components/user/user-avatar.vue'
import router from '@/router'

const user = ref({})
const size = ref(120)

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
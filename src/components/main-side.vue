<template>
    <div id="app-side">
        <el-menu default-active="-1" class="app-side-functionalities" @open="handleOpen" @close="handleClose">
            <el-menu-item index="1">
                <el-icon size="30px" color="#928f8f" class="app-side-home-icon" style="margin: 20px; margin-left: 50px;">
                    <House />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;" @click="goToHomePage">Home</span>
            </el-menu-item>
            <el-menu-item index="2">
                <el-icon size="30px" color="#928f8f" class="app-side-message-icon" style="margin: 20px; margin-left: 50px;">
                    <Message />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;">Message</span>
            </el-menu-item>
            <el-menu-item index="3">
                <el-icon size="25px" color="#928f8f" class="app-side-following-icon"
                    style="margin: 20px; margin-left: 50px;">
                    <Switch />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;" @click="goToFollowerTab">Following</span>
            </el-menu-item>
            <el-menu-item index="4">
                <el-icon size="30px" color="#928f8f" class="app-side-search-icon" style="margin: 20px; margin-left: 50px;">
                    <Search />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;" @click="goToSearchPage">Search</span>
            </el-menu-item>
            <el-menu-item index="5">
                <el-icon size="30px" color="#928f8f" class="app-side-appointment-icon"
                    style="margin: 20px; margin-left: 50px;">
                    <Connection />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;" @click="goToAppointmentPage">Appointment</span>
            </el-menu-item>
            <el-menu-item index="6">
                <el-icon size="30px" color="#928f8f" class="app-side-profolio-icon"
                    style="margin: 20px; margin-left: 50px;">
                    <Compass />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;" @click="goToUserProfolio">Portfolio</span>
            </el-menu-item>
            <el-menu-item index="7">
                <el-icon size="30px" color="#928f8f" class="app-side-setting-icon" style="margin: 20px; margin-left: 50px;">
                    <Setting />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;">Setting</span>
            </el-menu-item>
        </el-menu>
        <div id="app-side-user" v-if="!needLogIn">
            <div class="app-side-user-avatar">
                <UserAvatar :user="user"/>
            </div>
            <h3 style="margin: auto 30px;">
                <div class="app-user-alias">
                    <el-link href="/user">{{ user.alias }}</el-link>
                </div>
            </h3>
            <el-dropdown trigger="click" @visible-change="clickIconTransition">
                <el-button type="primary"
                    style="margin: auto 10px auto 30px; width: 30px; border-radius: 30px; background-color: #fff; border: #fff;">
                    <!-- <el-icon class="el-icon--right"><arrow-down /></el-icon> -->
                    <el-icon style="transform: rotate(90deg); transition: transform 2s ease;" color="#409EFF" size="20px" v-if="!isRotated">
                        <More />
                    </el-icon>
                    <el-icon color="#409EFF" size="20px" v-if="isRotated">
                        <More />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logOutCurrentAccount">Log Out</el-dropdown-item>
                        <el-dropdown-item @click="goToProfile">Profile</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div id="app-side-user-need-login" v-if="needLogIn">
            <el-button type="primary" @click="goToLogIn">
                Login
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElDialog, ElAvatar, ElButton } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { Home, Mounted, Split } from '@icon-park/vue-next'
import router from '../router.js'
import '@icon-park/vue-next/styles/index.css'
import userApi from '../services/user-api'
import { useStore } from 'vuex'
import UserAvatar from '@/components/user/user-avatar.vue'

const needLogIn = ref(false)
const isRotated = ref(false)
const user = ref({})

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}

const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}

const goToHomePage = () => {
    router.push('/').then(() => {
        window.location.reload()
    })
}

const goToProfile = () => {
    router.push('/user/profile').then(() => {
        window.location.reload()
    })
}

const goToFollowerTab = () => {
    router.push({ path: '/user/profile', query: { tab: 'follower' } }).then(() => {
        window.location.reload()
    })
}

const goToUserProfolio = () => {
    router.push({ path: '/user/profile', query: { tab: 'portfolio' } }).then(() => {
        window.location.reload()
    })
}

const goToLogIn = () => {
    router.push('/sign-in')
}

const goToSearchPage = () => {
    router.push('/search')
}

const goToAppointmentPage = () => {
    router.push('/appointment/create')
}

const logOutCurrentAccount = () => {
    ElMessageBox.confirm('Are you sure to log out?', 'Log Out', {
        confirmButtonText: 'Log Out',
        cancelButtonText: 'Cancel',
        type: 'warning'
    }).then(() => {
        router.push('/sign-out')
    }).catch(() => {
        // do nothing
    })
}

const getUserInfoForDisplay = async (userId) => {
    userId = localStorage.getItem('userId')
    if (userId === null || userId === undefined || userId === '') {
        needLogIn.value = true
    } else {
        const getUserInfoRes = await userApi.getUserInformation(userId)
        if (getUserInfoRes.code === 0 && getUserInfoRes.data.length > 0) {
            user.value = getUserInfoRes.data[0]
        } else {
            ElMessage.error(`Failed to get user info: ${getUserInfoRes.msg}`)
        }
    }
}

const clickIconTransition = () => {
    isRotated.value = !isRotated.value
}



onMounted(() => {
    getUserInfoForDisplay()
})

</script>

<style scoped>
#app-side {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 60px);
}

#app-side-user {
    width: 100%;
    height: 10%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

#app-side-user-need-login {
    width: 100%;
    height: 5%;
    border-radius: 10px;
}

#app-side-user-need-login .el-button {
    margin: auto;
    width: 80%;
    height: 80%;
}

.app-user-alias{
    width: 100px;
    font-weight: 600;
    font-size: small;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
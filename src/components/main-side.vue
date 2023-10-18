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
                <span style="margin: 10px; font-weight: 600;">Search</span>
            </el-menu-item>
            <el-menu-item index="5">
                <el-icon size="30px" color="#928f8f" class="app-side-appointment-icon"
                    style="margin: 20px; margin-left: 50px;">
                    <Connection />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;">Appointment</span>
            </el-menu-item>
            <el-menu-item index="6">
                <el-icon size="30px" color="#928f8f" class="app-side-profolio-icon"
                    style="margin: 20px; margin-left: 50px;">
                    <Compass />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;" @click="goToUserProfolio">Profolio</span>
            </el-menu-item>
            <el-menu-item index="7">
                <el-icon size="30px" color="#928f8f" class="app-side-setting-icon" style="margin: 20px; margin-left: 50px;">
                    <Setting />
                </el-icon>
                <span style="margin: 10px; font-weight: 600;">Setting</span>
            </el-menu-item>
        </el-menu>
        <div id="app-side-user" v-if="!needLogIn">
            <div class="app-side-user-avatar" style="margin: auto 50px; margin-right: 0px;">
                <el-avatar>
                    {{ nameAbbreviation }}
                </el-avatar>
            </div>
            <h3 style="margin: auto 30px;">
                <span style="font-weight: 600; font-size: x-small;">{{ userName }}</span>
            </h3>
            <el-dropdown trigger="click">
                <el-button type="primary" style="margin: auto; margin-right: 10px; width: 80px">
                    More<el-icon class="el-icon--right"><arrow-down /></el-icon>
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
import { Home, Split } from '@icon-park/vue-next'
import router from '../router.js'
import '@icon-park/vue-next/styles/index.css'
import userApi from '../services/user-api'
import { useStore } from 'vuex'

const userName = ref('')
const nameAbbreviation = ref('')
const needLogIn = ref(false)

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}

const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}

const goToHomePage = () => {
    router.push('/')
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
        if (getUserInfoRes.code === 0) {
            if (getUserInfoRes.data[0].alias.length > 7) {
                userName.value = getUserInfoRes.data[0].alias.substring(0, 7) + '...'
                nameAbbreviation.value = (getUserInfoRes.data[0].firstName).charAt(0) + (getUserInfoRes.data[0].lastName).charAt(0)
                // todo: if the avatar is available, can test for it.
            }
        } else {
            ElMessage.error(`Failed to get user info: ${getUserInfoRes.msg}`)
        }
    }
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
    display: flex;
    flex-direction: row;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
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
</style>
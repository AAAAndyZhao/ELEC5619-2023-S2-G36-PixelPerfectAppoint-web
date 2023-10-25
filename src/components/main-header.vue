<template>
    <el-header class="app-header">
        <el-menu class="app-header-menu" mode="horizontal">
            <router-link to="/">
                <el-menu-item class="app-header-logo-img">
                    <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/p/vgdgWWIJTQhf1Pg8edVg3VY2f3l049xabq6AONJYm0Pd21d730L85UInxTqGMG8g/n/sdhdhqcmzyxg/b/ppa-assets/o/logo-large-transparent.png" alt="logo" />
                    <h3 style="margin-left: 10px; font-family: 'Bebas Neue', sans-serif; font-size: 25px;">Pixel Perfect Appoint</h3>
                </el-menu-item>
            </router-link>
            <el-input v-if="!isSearchPage" v-model="searchInput" placeholder="Press Enter to Search Beauty..." @keyup.enter.native="search"
                maxlength="50" @keydown.space.stop >
                <template #append>
                    <el-button type="primary" icon="Search" @click="search"></el-button>
                </template>
            </el-input>
            <el-button type="primary" class="app-header-login-btn" @click="visible = true">
                <plus/>
                Upload
            </el-button>
        </el-menu>
    </el-header>
    <el-dialog v-model="visible" :show-close="false" width="400px" height="300px" style="border-radius: 10px;">
        <span class="app-header-dialog-header">
            Share the Moment
        </span>
        <div class="app-header-choose-dialog">
            <div>
                <el-text>Post</el-text>
                <router-link to="/post/upload" @click="goToPostPage" class="app-header-choose-post">
                    <el-icon size="80px" color="#928f8f" class="app-header-choose-post-icon"><Picture /></el-icon>
                </router-link>
            </div>
            <div>
                <el-text>Photo</el-text>
                <router-link to="/photo/upload" @click="goToPhotoPage" class="app-header-choose-photo">
                    <el-icon size="80px" color="#928f8f" class="app-header-choose-photo-icon"><Camera /></el-icon>
                </router-link>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElDialog } from 'element-plus'
import { Plus, Picture, Camera } from '@icon-park/vue-next'
import router from '../router.js'
import '@icon-park/vue-next/styles/index.css'
import userApi from '../services/user-api'
import photoApi from '../services/photo-api'
import { useStore } from 'vuex'

const isSearchPage = computed(() => {
    return router.currentRoute.value.name == 'SearchPage'
})

const visible = ref(false)
const searchInput = ref('')

let goToPostPage = () => {
    visible.value = false
}

let goToPhotoPage = () => {
    visible.value = false
}

const search = () => {
    if(searchInput.value == '') {
        ElMessage({
            message: 'Please enter a keyword',
            type: 'warning'
        })
    } else {
        router.push({ name: 'SearchPage', query: { keyword: searchInput.value } })
    }
}

</script>
<script>
export default {
    name: 'Header',
    props: {
        msg: String

    },
    data() {
        return {
            
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

#app-header {
    position: fixed;
    background-color: #fff;
    height: 60px;
    padding: 0 20px;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;
}

.app-header-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.app-header-logo-img {
    display: flex;
    align-items: center;
    /* margin-left: 20px; */
}

.app-header-logo-img img {
    width: 50px;
}

.el-input {
    width: 500px;
    margin: auto;
    height: 40px;
    font-size: 15px;
}

.app-badge-cart {
    margin-right: 20px;
}

button.el-button.el-button--primary.app-header-login-btn {
    margin: 0 10px;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    background-color: #fff;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    outline: 0;
    /* color: var(--el-menu-hover-text-color); */
    background-color: #fff;
}

.app-header-choose-dialog {
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.app-header-choose-dialog .el-text {
    font-size: 16px;
    font-family: 'Playfair Display', serif, bold;
    margin-top: 20px;
    margin-bottom: 20px;
}

.app-header-choose-post,
.app-header-choose-photo {
    width: 100px;
    height: 100px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border: 1px solid #ccc;
}

.app-dialog__body {
    padding: 10px;
}

.app-header-choose-post:hover,
.app-header-choose-photo:hover {
    cursor: pointer;
    background-color: #bdbaba;
    transition: all 0.5s ease-in-out;
}

.app-header-choose-post:hover .el-icon, 
.app-header-choose-photo:hover .el-icon {
    transition: all 0.5s ease-in-out;
    color: #c6e2ff;
}

.app-header-dialog-header {
    font-family: 'Playfair Display', serif, bold;
    font-size: 20px;
}

.app-account {
    display: flex;
    align-items: center;
    margin-right: 20px;
}
</style>
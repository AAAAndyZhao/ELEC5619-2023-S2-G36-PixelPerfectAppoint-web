<template>
    <el-header class="app-header">
        <el-menu class="app-header-menu" mode="horizontal">
            <router-link to="/">
                <el-menu-item class="app-header-logo-img">
                    <img src="@/assets/vue.svg" alt="logo" />
                    <h3 style="margin-left: 10px;">Pixel Perfect Appoint</h3>
                </el-menu-item>
            </router-link>
            <el-input v-model="searchInput" placeholder="Press Enter to Search📱" @keyup.enter.native="search"
                maxlength="50" @keydown.space.stop >
                <template #append>
                    <el-button type="primary" icon="Search" @click="search"></el-button>
                </template>
            </el-input>
            <router-link to="/sisu/signin">
                <el-button type="primary" class="app-header-login-btn">
                    <plus/>
                    Post
                </el-button>
            </router-link>
        </el-menu>
    </el-header>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@icon-park/vue-next'
import router from '../router.js'
import '@icon-park/vue-next/styles/index.css'
import userApi from '../services/user-api'
import { useStore } from 'vuex'



</script>
<script>
export default {
    name: 'Header',
    props: {

    },
    data() {
        return {
            
        }
    }
}
</script>

<style scoped>
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
    margin-left: 20px;
}

.app-header-logo-img img {
    width: 60px;
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

.app-account {
    display: flex;
    align-items: center;
    margin-right: 20px;
}
</style>
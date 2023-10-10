<template>
    <el-contrainer class="app-container">
        <el-header class="app-header">
            <router-view name="header"/>
        </el-header>
        <el-main class="app-main">
            <div class = "tools">
                <el-button type="info" class="back" @click="backTo" icon= "DArrowLeft" round></el-button>
            </div>
            <el-card class="app-main-post-title">
                <router-view name="title"/>
            </el-card>
            <el-card class="app-main-post-photo">
                <router-view name="content"/>
            </el-card>
            
            <el-card class = "app-main-user-info">
                <div>
                    <router-view name="info"/>
                </div>
            </el-card>
            <el-card class="app-main-post-description">
                <router-view name="description"/>
            </el-card>
            <el-card>
                <router-view name="comment"/>
            </el-card>
            
        </el-main>
    </el-contrainer>
</template>

<script setup lang="ts"> 
import { ref } from 'vue';
import { ElCard } from 'element-plus';
import router from '../router'

//点击返回按钮返回上一页


const backTo = () => {
    router.back();
};








</script>
<style scoped>
.app-container{
    display: block;
    height: 100%;
}
.app-main-post-title{
    border: none !important;
    box-shadow: none !important;
}
.tools{
    display: flex;
    align-items: center; 
    justify-content: space-between;
}
.post-comment{
    margin-top: 20px;
}
.app-main-user-info{
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    margin-top: 10px;
    margin-bottom: 10px;
    box-shadow: none !important;
    
}
.post-info-detail{
    display: flex;
    margin-top: 1px;
    border: none !important;
    margin-top: 10px;
    
}
.post-like{
    display: flex;
    border: none !important;
    box-shadow: none !important;
    
}
.post-info{
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    box-shadow: none !important;
}
.app-main-post-photo{
    border:none !important;
}

.app-main-post-description{
    border:none !important;
    box-shadow: none !important;
}

</style>
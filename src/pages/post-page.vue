<template>
    <el-contrainer class="app-container">
        <el-header class="app-header">
            <router-view name="header"/>
        </el-header>
        <el-main class="app-main">
            <div class = "tools">
                <el-button type="primary" class="back" @click="backTo" icon= "DArrowLeft" ></el-button>
            </div>
            <router-view name="content"/>
            <BigImg :visible="photoVisible" :url="bigImgUrl" @closeClick="closeBigImage"></BigImg>
            <el-card class = "post-detail">
                <router-view name="info"/>
                <el-descriptions title="太美啦">
                    <el-descriptions-item >啊啊啊啊啊啊啊</el-descriptions-item>
                </el-descriptions>
            </el-card>
            <el-card class="comment">
                <el-input

                v-model="textarea"
                :rows="2"
                type="textarea"
                placeholder="comment..."
                />
            </el-card>
        </el-main>
    </el-contrainer>
</template>

<script setup>

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
.tools{
    display: flex;
    align-items: center; 
    justify-content: space-between;
}
.comment{
    margin-top: 20px;
}

</style>
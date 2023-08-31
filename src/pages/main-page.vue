<template>
    <el-contrainer class="app-container">
        <el-header class="app-header">
            <router-view name="header"/>
        </el-header>
        <el-contrainer class="app-inner-container">
            <el-aside class="app-aside">
                <router-view name="side"/>
            </el-aside>
            <el-main class="app-main">
                <router-view name="content"/>
            </el-main>
        </el-contrainer>
    </el-contrainer>
</template>
<style scoped>
.app-container,
.app-inner-container{
    display: block;
    height: 100%;
}
.app-inner-container{
    display: flex;
}
</style>
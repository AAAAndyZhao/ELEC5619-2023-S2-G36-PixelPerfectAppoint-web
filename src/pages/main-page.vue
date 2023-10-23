<template>
    <el-container class="app-container">
        <el-header class="app-header">
            <router-view name="header" />
        </el-header>
        <el-container class="app-inner-container">
            <el-aside v-if="showSideView" class="app-aside">
                <router-view name="side" />
            </el-aside>
            <el-main class="app-main">
                <router-view name="content" />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showSideView = computed(() => {
    // if router-view named side has no component, it will return false
    // if router-view named side has component, it will return true
    return route.matched.some(match => match.components.side);
})
</script>

<style scoped>
.app-container {
    display: block;
    height: 100%;
}

.app-inner-container {
    display: flex;
    min-height: calc(100% - 60px);
}

.app-main {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}
</style>
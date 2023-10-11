<template>
    <div class="user-info-container">
        <div class="user-info">
            <el-avatar :src=userInfo.userAvatar :size="70"></el-avatar>
            <div class="user-info-detail">
                <div class="user-name">
                    <el-link :underline="false">{{ userInfo.userName }}</el-link>
                    <el-button type="text" icon="ChatDotSquare">message</el-button>
                </div>
                <div class="user-id">
                    <el-text>@{{ userInfo.userId }}</el-text>
                </div>
            </div>
        </div>
        <el-button type="primary" icon="User">Follow</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
interface userInfo {
    userName: string;
    userId: string;
    userAvatar: string;
}

const userInfo = ref<userInfo>({
    userName: '1234567',
    userId: 'ftest1',
    userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
});






</script>

<style scoped>
.user-info {
    display: flex;

}

.user-info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.user-info-detail {
    margin-left: 12px;
    flex: 1;
    overflow: auto;
}

.user-name {
    display: flex;
    align-items: center;
}

.user-id {
    text-align: left;
}
</style>
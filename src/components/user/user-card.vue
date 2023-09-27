<template>
    <el-card class="app-user-card" body-class="app-user-card-body">
        <div class="app-user-card-avatar">
            <img :src="user.avatar" alt="avatar" v-if="user.avatar"/>
            <el-icon v-else>
                <Avatar />
            </el-icon>
        </div>
        <div class="app-user-card-info">
            <div class="app-user-alias">{{ user.alias }}</div>
            <div class="app-user-username">@{{ user.userName }}</div>
        </div>
        <div class="app-user-card-introduction">
            <div class="app-user-introduction">{{ user.introduction ? user.introduction : 'This user is too lazy to leave a introduction.' }}</div>
        </div>
        <div class="app-user-card-operation">
            <slot name="default">

            </slot>
        </div>
    </el-card>
</template>

<script setup>
defineProps({
    user: {
        type: Object,
        required: false,
        default: () => {
            return {
                alias: 'unknown',
                userName: 'unknown',
                introduction: 'unknown',
                avatar: '',
            }
        }
    }
})
</script>

<style scoped>
.app-user-card {
    width: 100%;
    height: 120px;
    box-sizing: border-box;
    background-color: var(--el-card-background-color, #fff);
    margin-bottom: 20px;
}
:deep(.app-user-card-body) {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
}
.app-user-card-avatar {
    aspect-ratio: 1 / 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.app-user-card-avatar img,
.app-user-card-avatar .el-icon,
.app-user-card-avatar .el-icon svg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.app-user-card-info {
    width: 300px;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px;
}
.app-user-card-introduction {
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    padding: 10px 20px;
    color: #999;
}
.app-user-card-operation {
    width: auto;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}
.app-user-alias {
    font-size: 20px;
    font-weight: bold;
}
.app-use-name {
    font-size: 15px;
    font-weight: bold;
}
.app-user-introduction {
    font-size: 15px;
}

</style>
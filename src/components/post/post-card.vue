<template>
    <el-card class="app-post-card" body-class="app-post-card-body">
        <div class="app-post-card-img">
            <img :src="post.coverImageUrl" alt="avatar" v-if="post.coverImageUrl"/>
            <!-- todo: default post cover image -->
            <el-icon v-else>
                <Avatar />
            </el-icon>
        </div>
        <div class="app-post-card-content">
            <div class="app-post-title">{{ post.title }}</div>
            <div class="app-post-content">
                {{ post.content }}
            </div>
            <div class="app-post-last-modify-time">
                Last modified on <span>{{ post.lastModifyDateTime }}</span>
            </div>
        </div>
        <div class="app-post-card-operation">
            <slot name="default">

            </slot>
        </div>
    </el-card>
</template>

<script setup>
defineProps({
    post: {
        type: Object,
        required: false,
        default: () => {
            return {
                id: 'unknown',
                title: 'unknown',
                content: 'unknown',
                coverImageUrl: '',
                lastModifyDateTime: 'unknown',
            }
        }
    }
})
</script>

<style scoped>
.app-post-card {
    width: 100%;
    height: 200px;
    box-sizing: border-box;
    background-color: var(--el-card-background-color, #fff);
    margin-bottom: 20px;
}
:deep(.app-post-card-body) {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
}
.app-post-card-img {
    aspect-ratio: 1 / 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.app-post-card-img img,
.app-post-card-img .el-icon,
.app-post-card-img .el-icon svg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.app-post-card-content {
    height: 100%;
    width: calc(100% - 160px);
    flex: 1;
    box-sizing: border-box;
    padding: 0 20px;
}
.app-post-card-content .app-post-title {
    height: 30px;
    font-size: 24px;
    font-weight: bold;
    box-sizing: border-box;
    margin-bottom: 10px;
}
.app-post-card-content .app-post-content {
    height: calc(100% - 80px);
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
}
.app-post-card-content .app-post-last-modify-time {
    height: 30px;
    line-height: 30px;
    width: 100%;
    font-size: 16px;
    color: #909399;
}
.app-post-card-content .app-post-last-modify-time span {
    font-weight: bold;
    text-decoration: underline;
}
.app-post-card-operation {
    width: auto;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}

</style>
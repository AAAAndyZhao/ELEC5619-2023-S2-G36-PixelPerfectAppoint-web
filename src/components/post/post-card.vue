<template>
    <el-card class="app-post-card" body-class="app-post-card-body">
        <div class="app-post-card-img">
            <el-image v-if="post.coverPhoto.thumbnailUrl" :src="post.coverPhoto.thumbnailUrl">
                <template #error>
                    <el-icon>
                        <Picture />
                    </el-icon>
                </template>
            </el-image>
            <el-icon v-else>
                <Picture />
            </el-icon>
        </div>
        <div class="app-post-card-content">
            <div v-if="display.includes('title')" class="app-post-title">
                <el-link :href="`/post/detail/${post.id}`" target="_blank">{{ post.title }}</el-link>
            </div>
            <div v-if="display.includes('text')" class="app-post-content">
                {{ post.simpleText }}
            </div>
            <div v-if="display.includes('updateDatetime')" class="app-post-last-modify-time">
                <span>Last modified on</span>
                <span class="app-date-value">{{ post.updateDatetime }}</span>
            </div>
        </div>
        <div v-if="display.includes('likes')"  class="app-likes">
            <span class="app-likes-number">{{ shortenLikesNumber(post.likes) }}</span>
            <span class="app-likes-text">Likes</span>
        </div>
        <div v-if="display.includes('author')"  class="app-author">
            <div class="app-avatar">
                <el-image v-if="post.author && post.author.avatarUrl" 
                    :src="post.author.avatarUrl">
                    <template #error>
                        <el-icon>
                            <Avatar />
                        </el-icon>
                    </template>
                </el-image>
                <el-icon v-else>
                    <Avatar />
                </el-icon>
            </div>
            <div class="app-author-alias">
                {{ hasAuthor ? post.author.alias : 'Unknown' }}
            </div>
            <div class="app-author-username">
                @{{ hasAuthor ? post.author.userName : 'Unknown' }}
            </div>
        </div>
        <div v-if="display.includes('operation')" class="app-post-card-operation">
            <slot name="default">

            </slot>
        </div>
    </el-card>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
    post: {
        type: Object,
        required: false,
        default: () => {
            return {
                id: 'unknown',
                title: 'unknown',
                simpleText: 'unknown',
                coverUrl: '',
                updateDatetime: 'unknown',
                author: null
            }
        }
    },
    display: {
        type: Array,
        required: false,
        default: () => {
            return ['title', 'text', 'updateDatetime', 'author', 'likes'];
        }
    }
})

const shortenLikesNumber = (number) => {
    return $FUNC.shortenNumber(number);
}

const hasAuthor = computed(() => {
    return props.post.author && props.post.author.id;
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
.app-post-card-content .app-post-title {
    width: 100%;
    font-size: 24px;
    font-weight: bold;
    box-sizing: border-box;
    margin-bottom: 10px;

    .el-link{
        font-size: 24px;
        font-weight: bold;
        box-sizing: border-box;
    }
}
.app-post-card-content .app-post-content {
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
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
}
.app-post-card-content .app-post-last-modify-time span.app-date-value {
    font-weight: bold;
    text-decoration: underline;
    margin-left: 10px;
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
.app-author{
    width: 160px;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    
    .app-avatar{
        aspect-ratio: 1 / 1;
        height: 30%;
    }

    .app-author-alias{
        font-size: 16px;
        font-weight: bold;
        margin-top: 5px;
    }
    .app-author-username{
        font-size: 14px;
        color: #999;
        margin-top: 5px;
    }
}

.app-avatar img,
.app-avatar .el-icon,
.app-avatar .el-icon svg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.app-likes{
    width: 150px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .app-likes-number{
        font-size: 16px;
        font-weight: bold;
        font-style: italic;
        margin-right: 5px;
    }
    .app-likes-text{
        font-size: 12px;
        font-style: italic;
    }
}
</style>
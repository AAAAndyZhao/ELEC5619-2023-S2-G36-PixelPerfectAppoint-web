<template>
    <div :class="`app-chat-card ${isSelected ? 'app-active-chat' : ''}`">
        <div class="app-message-chat-card-avatar">
            <user-avatar :user="displayedUser" />
        </div>
        <div class="app-chat-info">
            <el-text class="app-message-chat-user-alias" truncated>{{ displayedUser?.alias }}</el-text>
            <el-text class="app-last-message" truncated>{{ lastMessage }}</el-text>
        </div>
        <div class="app-chat-time">
            <el-text class="app-message-chat-card-last-time" truncated>{{ lastSendDatetime }}</el-text>
            <el-badge v-if="chat.unreadCount" :value="chat.unreadCount" class="app-unread-count-badge" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import UserAvatar from '@/components/user/user-avatar.vue'
const props = defineProps({
    chat: {
        type: Object,
        required: false,
        default: () => { },
    },
    isSelected: {
        type: Boolean,
        required: false,
        default: false,
    },
})
const currentUserId = localStorage.getItem('userId');
const displayedUser = computed(() => {
    if (!props.chat) {
        return {}
    }
    if (props.chat.senderId === currentUserId) {
        return props.chat.receiver;
    }
    return props.chat.sender;
})
const lastSendDatetime = computed(() => {
    if (!props.chat) {
        return ''
    }
    if (!props.chat.sendDatetime) {
        return ''
    }
    // if within 24 hours, show time only
    if (dayjs().diff(props.chat.sendDatetime, 'day') < 1) {
        return dayjs(props.chat.sendDatetime).format('HH:mm')
    }
    // if within 7 days, show day only
    if (dayjs().diff(props.chat.sendDatetime, 'day') < 7) {
        return dayjs(props.chat.sendDatetime).format('MM-DD')
    }
    return dayjs(props.chat.sendDatetime).format('YYYY-MM-DD')
})
const lastMessage = computed(() => {
    if (!props.chat) {
        return ''
    }
    if (props.chat.isMedia) {
        return '[Media]'
    }
    return props.chat.messageText?.text
})
</script>

<style scoped>
.app-chat-card {
    width: 95%;
    height: 60px;
    margin: 5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 5px #ccc;
    cursor: pointer;
}
.app-chat-card.app-active-chat{
    background-color: var(--el-color-info-light-7);
}

.app-chat-info {
    width: calc(100% - 120px);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
}

.app-chat-info .el-text {
    text-align: left;
    width: 100%;
    box-sizing: border-box;
    margin: 0 5px;
}

.app-message-chat-card-avatar {
    width: 40px;
    height: 40px;
    margin: auto 10px;
}

.app-message-chat-user-alias {
    margin: auto;
    width: 70px;
    font-size: var(--el-font-size-small);
    align-items: center;
    font-weight: 600;
}

.app-last-message {
    margin: auto;
    font-size: var(--el-font-size-extra-small);
    align-items: center;
    color: var(--el-color-primary-light-3);
}

.app-chat-time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 5px;
    margin-right: 10px;
    font-size: var(--el-font-size-extra-small);
    align-items: center;
    box-sizing: border-box;
    width: 60px;
    flex-shrink: 0;
}

.app-message-chat-card-last-time {
    box-sizing: border-box;
    font-size: var(--el-font-size-extra-small);
    align-items: center;
}
</style>
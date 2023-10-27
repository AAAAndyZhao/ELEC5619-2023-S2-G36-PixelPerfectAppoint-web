<template>
    <div :class="`app-message-bubble ${position === 'right' ? 'app-bubble-right' : ''}`">
        <user-avatar v-if="position === 'left'" :user="chat.sender" class="app-message-bubble-avatar" />
        <div class="app-message-body">
            <el-card :class="`app-message-content ${isSelf ? 'app-self-message-content' : ''}`"
            body-class="app-message-content-body">
                <div v-if="chat.isMedia" class="app-media-message">
                    [Media]
                </div>
                <div v-else class="app-text-message">
                    {{ chat.messageText.text }}
                </div>
            </el-card>
            <div class="app-message-send-time">
                {{ simplifiedSendDatetime }}
            </div>
        </div>
        <user-avatar v-if="position === 'right'" :user="chat.sender" class="app-message-bubble-avatar" />
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
    isSelf: {
        type: Boolean,
        required: false,
        default: false,
    },
    position: {
        type: String,
        required: false,
        default: 'left',
    },
})


const simplifiedSendDatetime = computed(() => {
    if (!props.chat) {
        return ''
    }
    // if within 24 hours, show time only
    if (dayjs().diff(props.chat.sendDatetime, 'day') < 1) {
        return dayjs(props.chat.sendDatetime).format('HH:mm')
    }
    return dayjs(props.chat.sendDatetime).format('YYYY-MM-DD HH:mm:ss')
})
</script>

<style scoped>
.app-message-bubble {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
}

.app-message-bubble.app-bubble-right {
    align-self: flex-end;
}

.app-message-content.app-self-message-content {
    background-color: #409EFF;
    color: #fff;
}

.app-message-content {
    margin: 0 10px;
    min-width: 100px;
}
:deep(.app-message-content-body) {
    box-sizing: border-box;
    padding: 5px;
}
.app-media-message,
.app-text-message {
    box-sizing: border-box;
    padding: 5px;
    white-space: pre-wrap;
    text-align: left;
    font-size: var(--el-font-size-small);
}
.app-message-send-time{
    box-sizing: border-box;
    font-size: var(--el-font-size-extra-small);
    color: #ccc;
    margin: 5px 10px;
    text-align: left;
}
</style>
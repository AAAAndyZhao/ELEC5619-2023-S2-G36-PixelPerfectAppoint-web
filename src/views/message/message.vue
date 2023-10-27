<template>
    <div class="app-message-container">
        <div class="app-message-header">
            <h3>{{ chatTitle }}</h3>
        </div>
        <div class="app-message-content">
            <div class="app-message-group-card-container">
                <chat-card v-for="chat in chats" @click="handleClickConversation(chat)" :key="chat" :chat="chat"
                    :is-selected="chatEquals(chat, selectedChat)" />
            </div>
            <div class="app-message-chat-page">
                <div ref=messageContentRef class="app-message-chat-content" v-if="selectedChat"
                    @scroll="handleMessageScroll">
                    <el-divider v-if="noMoreHistoryTag" class="app-no-more-history-divider">No more history</el-divider>
                    <el-icon v-if="isLoadingHistoryTag && !noMoreHistoryTag" class="is-loading">
                        <Loading />
                    </el-icon>
                    <message-bubble v-for="message in selectedChat.messages" :key="message" :chat="message"
                        :position="useTwoSideLayout && message.senderId === currentUserId ? 'right' : 'left'"
                        :is-self="message.senderId === currentUserId" />
                </div>
                <div class="app-message-chat-input-container">
                    <el-input id="app-message-chat-input" v-model="messageInput"
                        @keyup.native.enter="sendMessage"></el-input>
                    <el-button type="primary" class="app-message-send-button" @click="sendMessage">Send</el-button>
                    <el-button class="app-message-media-button">
                        <el-icon size="30px" color="var(--el-color-primary-light-3)">
                            <CirclePlusFilled />
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { ElImage, ElMessage } from 'element-plus'
import messageApi from '@/services/message-api'
import ChatCard from '@/components/message/chat-card.vue'
import MessageBubble from '@/components/message/message-bubble.vue'
import router from '@/router'

const props = defineProps({
    toUserId: {
        type: String,
        required: false,
        default: '',
    },
})

const messageInput = ref('')
const chats = ref([])
const selectedChat = ref({})
const currentUserId = localStorage.getItem('userId')
const useTwoSideLayout = ref(true)
const messageContentRef = ref(null)
const isLoadingHistoryTag = ref(false) // loading history tag, to prevent loading history multiple times
const noMoreHistoryTag = ref(false) // no more history tag, to prevent loading history multiple times
let loadNewMessageInterval = null

const isWatchingHistory = () => {
    if (!messageContentRef.value) {
        return false
    }
    return messageContentRef.value.scrollTop < messageContentRef.value.scrollHeight - messageContentRef.value.clientHeight - 100
}
const chatEquals = (chat1, chat2) => {
    return chat1.receiverId === chat2.receiverId && chat1.senderId === chat2.senderId
        || chat1.receiverId === chat2.senderId && chat1.senderId === chat2.receiverId
}
const messageEquals = (message1, message2) => {
    // PK: receiverId & messageNo
    return message1.receiverId === message2.receiverId && message1.messageNo === message2.messageNo
}
const getOtherUserIdFromChat = (chat) => {
    if (!chat) {
        return ''
    }
    if (chat.receiverId === currentUserId) {
        return chat.senderId
    }
    return chat.receiverId
}
const chatTitle = computed(() => {
    if (!selectedChat.value.receiverId) {
        return ''
    }
    if (selectedChat.value.receiverId === currentUserId) {
        return selectedChat.value.sender.alias
    }
    return selectedChat.value.receiver.alias
})
const handleClickConversation = (chat) => {
    if (chatEquals(chat, selectedChat.value)) {
        return
    }
    selectedChat.value = chat;
    isLoadingHistoryTag.value = false;
    noMoreHistoryTag.value = false;
    // for user experience, just set unreadCount to 0
    chat.unreadCount = 0;
    // change 'to' in query string
    const query = { to: getOtherUserIdFromChat(chat) }
    router.push({ path: '/message', query: query })
    loadMessages(chat);
}
const sortChatsBySendDatetimeDesc = () => {
    chats.value.sort((chat1, chat2) => {
        if (!chat1.sendDatetime) {
            return 1
        }
        if (!chat2.sendDatetime) {
            return -1
        }
        // convert to long to compare
        return new Date(chat2.sendDatetime).getTime() - new Date(chat1.sendDatetime).getTime()
    })
}
const loadRecentChats = async () => {
    try {
        const res = await messageApi.getRecentChats()
        if (res.code === 0) {
            // not simply assign, because we need to keep the existing chat
            // and only replace the item
            // unexisting chats will be added
            // the most recent chats will be at the first
            for (const chat of res.data) {
                const existChat = chats.value.find((existChat) => chatEquals(chat, existChat));
                if (!existChat) {
                    chats.value.push(chat)
                } else {
                    // replace the existing chat
                    Object.assign(existChat, chat)
                }
            }
            sortChatsBySendDatetimeDesc()
        } else {
            ElMessage.error(res.msg)
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('Failed to load recent chats: ' + error.message)
    }
}
const loadMessages = async (chat, loadHistory) => {
    const currentUserId = localStorage.getItem('userId')
    const otherUserId = getOtherUserIdFromChat(chat);
    if (!currentUserId) {
        ElMessage.error('Please login first')
        return
    }
    if (!chat) {
        ElMessage.error('Please select a chat first')
        return
    }
    const chatObj = chats.value.find((chatObj) => chatEquals(chatObj, chat));
    if (!chatObj) {
        ElMessage.error('Failed to load messages: chat not found')
        return
    }
    let page = 1;
    let size = 15;
    if (loadHistory) {
        // calculate page and size based on current messages
        if (chatObj.messages) {
            page = Math.floor(chatObj.messages.length / size) + 1;
        }
    }
    try {
        const res = await messageApi.getMessages(otherUserId, page, size)
        if (res.code === 0) {
            if (!chatObj.messages) chatObj.messages = [];
            let addMessageCounter = 0;
            // find the correct position to insert, messageNo is in ascending order
            for (const message of res.data) {
                const existMessage = chatObj.messages.find((existMessage) => messageEquals(message, existMessage));
                if (!existMessage) {
                    addMessageCounter++;
                    // if not found, means 
                    // because messageNo is in ascending order
                    // insert to the correct position based on messageNo
                    const index = chatObj.messages.findIndex((existMessage) => message.messageNo < existMessage.messageNo);
                    if (index === -1) {
                        chatObj.messages.push(message)
                    } else {
                        chatObj.messages.splice(index, 0, message)
                    }
                } else {
                    // if found, means messsage exists, do nothing
                }
            }
            if (loadHistory && addMessageCounter === 0 && isLoadingHistoryTag.value) {
                ElMessage.info('No more history')
                noMoreHistoryTag.value = true
            }
            if (!isWatchingHistory()) {
                // scroll to bottom
                setTimeout(() => {
                    messageContentRef.value.scrollTop = messageContentRef.value.scrollHeight;
                }, 100);
            }

        } else {
            ElMessage.error(res.msg)
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('Failed to load messages: ' + error.message)
    }
}
const sendMessage = async () => {
    if (!currentUserId) {
        ElMessage.error('Please login first')
        return
    }
    const otherUserId = getOtherUserIdFromChat(selectedChat.value);
    if (!otherUserId) {
        ElMessage.error('Please select a chat first')
        return
    }
    if (messageInput.value === ''
        || messageInput.value === null
        || messageInput.value === undefined) {
        ElMessage.error('Please input message')
        return
    }
    try {
        const res = await messageApi.sendMessage({
            isMedia: false,
            message: messageInput.value,
            receiverId: otherUserId,
            senderId: currentUserId,
        })
        if (res.code === 0) {
            messageInput.value = ''
            loadMessages(selectedChat.value).then(() => {
                // scroll to bottom
                setTimeout(() => {
                    messageContentRef.value.scrollTop = messageContentRef.value.scrollHeight;
                }, 100);
            })
        } else {
            ElMessage.error(res.msg)
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('Failed to send message: ' + error.message)
    }
}
const handleMessageScroll = () => {
    if (messageContentRef.value.scrollTop === 0) {
        // load history
        if (isLoadingHistoryTag.value || noMoreHistoryTag.value) {
            return
        }
        isLoadingHistoryTag.value = true
        loadMessages(selectedChat.value, true).then(() => {
            isLoadingHistoryTag.value = false
            // scroll bottom a little bit to prevent loading history multiple times
            messageContentRef.value.scrollTop = 200;
        })
    }
}
const loadDefaultOpenChat = async () => {
    if (!props.toUserId) {
        return
    }
    const chat = chats.value.find((chat) => chat.receiverId === props.toUserId || chat.senderId === props.toUserId)
    if (chat) {
        handleClickConversation(chat)
    } else {
        // if not found, could be the first time chatting with this user, or the chat is not loaded due to not recent chat
        // build a chat object
        const chatRes = await messageApi.getChat(props.toUserId);
        if (chatRes.code === 0 && chatRes.data.length > 0) {
            const chat = chatRes.data[0];
            chats.value.unshift(chat)
            handleClickConversation(chat)
        } else {
            ElMessage.error(chatRes.msg)
        }
    }
}
const updateLayout = () => {
    if (window.innerWidth < 1000) {
        useTwoSideLayout.value = false
    } else {
        useTwoSideLayout.value = true
    }
}
onMounted(() => {
    window.addEventListener('resize', updateLayout);
    loadRecentChats().then(() => {
        loadDefaultOpenChat()
    })
    loadNewMessageInterval = setInterval(() => {
        loadRecentChats()
        if (!selectedChat.value.senderId) {
            return
        }
        loadMessages(selectedChat.value)
    }, 5000)
})
onUnmounted(() => {
    window.removeEventListener('resize', updateLayout);
});
</script>

<style scoped>
.app-message-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.app-message-header {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-sizing: border-box;
}

.app-message-content {
    width: 100%;
    height: calc(100vh - 160px);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid #ccc;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-sizing: border-box;
}

.app-message-group-card-container {
    width: 300px;
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-right: 1px solid #ccc;
    overflow-y: auto;
    box-sizing: border-box;
}

.app-message-group-card {
    width: 95%;
    height: 60px;
    margin: 5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 5px #ccc;
    cursor: pointer;
}

.app-message-chat-card-avatar {
    width: 40px;
    height: 40px;
    margin: auto 20px;
    border-radius: 50%;
}

.app-message-chat-card-group-name {
    margin: auto;
    width: 70px;
    font-size: var(--el-font-size-extra-small);
    align-items: center;
    font-weight: 600;
}

.app-message-chat-card-last-time {
    margin: auto;
    font-size: var(--el-font-size-extra-small);
    align-items: center;
}

.app-message-chat-page {
    width: calc(100% - 300px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.app-message-chat-content {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    height: calc(100% - 60px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.app-message-chat-content .el-icon {
    margin: 0 auto;
}

.app-no-more-history-divider {
    margin: 0 auto;
}

:deep(.app-no-more-history-divider .el-divider__text) {
    font-size: var(--el-font-size-small);
    color: #ccc;
}

.app-message-chat-input-container {
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid #ccc;
    border-bottom-right-radius: 10px;
    box-shadow: 0 0 5px #ccc;
    box-sizing: border-box;
}

.el-input {
    height: 40px;
    margin: 10px;
    border-radius: 10px 0 10px 10px;
    box-shadow: 0 0 5px #ccc;
}

.app-message-send-button {
    width: 100px;
    height: 40px;
    margin: 10px;
    border-radius: 10px;
    box-shadow: 0 0 5px #ccc;
}

.app-message-media-button {
    width: 40px;
    height: 40px;
    margin: 10px;
    border-radius: 40px;
    box-shadow: 0 0 5px #ccc;
}</style>
<template>
    <div class="app-message-container">
        <div class="app-message-header">
            <h3>Message</h3>
        </div>
        <div class="app-message-content">
            <div class="app-message-group-card-container">
                <div class="app-message-group-card" v-for="chatgroup in chatgroups" @click="handleChatGroupClick(chatgroup)">
                    <el-image :src="chatgroup.chat_group_image" alt="chat group image" class="app-message-chat-card-avatar"/>
                    <el-text class="app-message-chat-card-group-name" >{{ cutChatCardName(chatgroup.chat_group_name) }}</el-text>
                    <el-text class="app-message-chat-card-last-time">{{ cutChatCardTime(chatgroup.last_message_time) }}</el-text>
                </div>
            </div>
            <div class="app-message-chat-page">
               <div class="app-message-chat-content" v-if="selectedChatGroup">
                    <div class="app-message-chat-detail" v-for="chat in chats">
                        <!-- based on the time sequence, if the sender id = 1, then the chat would display the right side -->
                        <!-- those chat sender id != 1 would display at the left side -->
                        <div v-if="chat.sender_id == 1">
                            <el-image :src="selectedChatGroup.chat_group_image" alt="chat group image" class="app-message-chat-card-avatar"/>
                            <el-text class="app-message-chat-card-last-time">{{ chat.created_at }}</el-text>
                            <el-text class="app-message-chat-card-message">{{ chat.message }}</el-text>
                        </div>
                        <div v-else>
                            <el-image :src="selectedChatGroup.chat_group_image" alt="chat group image" class="app-message-chat-card-avatar"/>
                            <el-text class="app-message-chat-card-message">{{ chat.message }}</el-text>
                            <el-text class="app-message-chat-card-last-time">{{ chat.created_at }}</el-text>
                        </div>
                    </div>
               </div> 
               <div class="app-message-chat-input-container">
                    <el-input id="app-message-chat-input" v-model="messageInput"></el-input>
                    <el-button type="primary" id="app-message-send-button">Send</el-button>
                    <el-button id="app-message-media-button">
                        <el-icon size="30px" color="var(--el-color-primary-light-3)"><CirclePlusFilled /></el-icon>
                    </el-button>
               </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElImage } from 'element-plus'

const messageInput = ref('')
const selectedChats = ref([])

const selectedChatGroup = ref({
    chat_group_id: 1,
    chat_group_name: 'Group 1',
    chat_group_image: 'https://picsum.photos/200',
    last_message_time: '2021-10-10 10:10:10'
})

const chatgroups = ref([
    {
        chat_group_id: 1,
        chat_group_name: 'Group 1',
        chat_group_image: 'https://picsum.photos/200',
        last_message_time: '2021-10-10 10:10:10'
    },
    {
        chat_group_id: 2,
        chat_group_name: 'Group 2',
        chat_group_image: 'https://picsum.photos/300',
        last_message_time: '2021-10-10 10:10:10'
    },
    {
        chat_group_id: 3,
        chat_group_name: 'Group 3',
        chat_group_image: 'https://picsum.photos/400',
        last_message_time: '2021-10-10 10:10:10'
    }
])

const chats = ref([
    {
        receiver_id: 1,
        sender_id: 2,
        message: 'Hello',
        created_at: '2021-10-10 10:10:10'
    },
    {
        receiver_id: 2,
        sender_id: 1,
        message: 'Hi',
        created_at: '2021-10-10 10:10:10'
    },
    {
        receiver_id: 1,
        sender_id: 2,
        message: 'How are you?',
        created_at: '2021-10-10 10:10:10'
    }
])

const cutChatCardName = (chatName) => {
    if (chatName.length > 10) {
        return chatName.slice(0, 10) + '...'
    }
    return chatName
}

const cutChatCardTime = (chatTime) => {
    return chatTime.slice(0, 10)
}

const handleChatGroupClick = (chatgroup) => {
    selectedChatGroup.value = chatgroup
    selectedChats.value = chats.value.filter(chat => chat.receiver_id == chatgroup.chat_group_id)
}

</script>

<style scoped>
.app-message-container {
    width: 100%;
    min-width: calc(100vh - 300px);
    min-height: calc(100vh - 100px);
    height: 100%;
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
}

.app-message-group-card {
    width: 95%;
    height: 60px;
    margin: 5px; 
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
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
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

#app-message-send-button {
    width: 100px;
    height: 40px;
    margin: 10px;
    border-radius: 10px;
    box-shadow: 0 0 5px #ccc;
}

#app-message-media-button {
    width: 40px;
    height: 40px;
    margin: 10px;
    border-radius: 40px;
    box-shadow: 0 0 5px #ccc;
}

</style>
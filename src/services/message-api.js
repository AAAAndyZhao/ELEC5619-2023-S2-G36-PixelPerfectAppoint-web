import axios from '@/utils/axios'

const sendMessage = async ({isMedia, message, receiverId, senderId}) => {
    const token = localStorage.getItem('token')
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    const body = {
        uid: senderId,
        is_media: isMedia,
        receiver_id: receiverId,
        is_group_message: false,
    }
    if (isMedia) {
        body.media_id = message
    } else {
        body.text = message
    }
    return await axios.post('/message/send', body, {
        headers: {
            authorization: token
        }
    })
}

const getRecentChats = async () => {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    return await axios.get(`/message/recent_chats?uid=${userId}`, {
        headers: {
            authorization: token
        }
    })
}

const getMessages = async (otherUserId, page = 1, size = 10) => {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    if (otherUserId === null
        || otherUserId === undefined
        || otherUserId === '') {
        throw new Error('Other user id is invalid');
    }
    return await axios.post(`/message/get`, {
        uid: userId,
        other_uid: otherUserId,
        page,
        size
    }, {
        headers: {
            authorization: token
        }
    })
}

const getChat = async (otherUserId) => {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    if (otherUserId === null
        || otherUserId === undefined
        || otherUserId === '') {
        throw new Error('Other user id is invalid');
    }
    return await axios.get(`/message/get_chat?uid=${userId}&other_uid=${otherUserId}`, {
        headers: {
            authorization: token
        }
    })
}

const getUnreadCount = async () => {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    return await axios.get(`/message/get_unread_count?uid=${userId}`, {
        headers: {
            authorization: token
        }
    })
}

export default {
    sendMessage,
    getRecentChats,
    getMessages,
    getChat,
    getUnreadCount
}
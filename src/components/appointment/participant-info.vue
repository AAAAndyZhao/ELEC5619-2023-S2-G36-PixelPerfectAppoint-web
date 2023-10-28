<template>
    <el-card class="app-participant-info" body-class="app-participant-info-body" shadow="never">
        <user-avatar :user="user" :size="70" @click="goToThisProfile(user.id)"></user-avatar>
        <div class="app-participant-info-detail">
            <div class="app-user-alias">
                <el-link :underline="false">{{ user?.alias }}</el-link>
                <el-link v-if="!isSelf" class="app-message-button" icon="ChatDotSquare" @click="sendMessage">message</el-link>
            </div>
            <div class="app-user-name">
                <el-text>@{{ user?.userName }}</el-text>
            </div>
        </div>
        <div class="app-role-info">
            <el-dropdown v-if="isSelf" class="app-role-dropdown">
                <el-tag :type="participantRole.tagType">{{ participantRole.value }}</el-tag>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleChangeRole"
                        class="app-creator-dropdown-item">
                            <el-icon><Edit /></el-icon>Change role
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-tag v-else :type="participantRole.tagType">{{ participantRole.value }}</el-tag>
        </div>
        <div class="app-status-info">
            <el-tag round effect="dark" :type="participantStatus.tagType">{{ participantStatus.value }}</el-tag>
        </div>
        <slot name="default"></slot>
    </el-card>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import PhotoImage from '@/components/photo/photo-image.vue';
import UserFollowOperation from '@/components/user/user-follow-operation.vue';
import userApi from '@/services/user-api';
import UserAvatar from '@/components/user/user-avatar.vue';
import MenuUtils from '@/utils/menu';
import router from '@/router';

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    role: {
        type: Number,
        required: false,
        default: 0
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
})
const emits = defineEmits(['role-change']);
const roleMenu = $MENU["APPOINTMENT_PARTICIPANT_ROLE"];
const statusMenu = $MENU["APPOINTMENT_PARTICIPANT_STATUS"];
const isSelf = computed(() => {
    return localStorage.getItem('userId') === props.user.id;
})

const participantRole = computed(() => {
    const result = MenuUtils.getSingleMenuSelectedValue(roleMenu, props.role)
    if (!result){
        return {
            value: "unknown",
        }
    }
    return result;
})

const participantStatus = computed(() => {
    const result = MenuUtils.getSingleMenuSelectedValue(statusMenu, props.status)
    if (!result){
        return {
            value: "unknown",
        }
    }
    return result;
})
const handleChangeRole = () => {
    emits('role-change', props.user.id)
}
const sendMessage = () => {
    router.push({ path: '/message', query: { to: props.user.id } })
}

const goToThisProfile = (userId) => {
    const currentUserId = localStorage.getItem('userId');
    if (userId === currentUserId) {
        router.push('/user/profile');
    } else {
        router.push(`/other/${userId}`);
    }
}
// can jump to the profile page of the user

</script>

<style scoped>
.app-participant-info{
    margin: 12px 0;
}
:deep(.app-participant-info-body) {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.app-participant-info-detail {
    margin-left: 12px;
    flex: 1;
    overflow: auto;
}

.app-user-alias {
    display: flex;
    align-items: center;
}
.app-message-button{
    margin-left: 10px;
}

.app-user-name {
    text-align: left;
}
.app-status-info,
.app-role-info{
    margin-right: 10px;
}

.app-role-dropdown .el-tag:focus-visible{
    outline: none;
}
</style>
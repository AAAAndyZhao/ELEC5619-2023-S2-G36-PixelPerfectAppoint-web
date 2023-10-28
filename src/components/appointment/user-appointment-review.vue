<template>
    <el-card class="app-user-appointment-review" body-class="app-user-appointment-review-body">
        <div class="app-review-info">
            <div class="app-participant-target">
                <user-avatar :user="participant" :size="20" @click="goToThisProfile(props.targetParticipant.id)"/>
                <span @click="goToThisProfile(props.targetParticipant.id)">{{ participant.alias }}</span>
                <el-icon><Right /></el-icon>
                <user-avatar :user="targetParticipant" :size="20" @click="goToThisProfile(props.targetParticipant.id)"/>
                <span @click="goToThisProfile(props.targetParticipant.id)">{{ targetParticipant.alias }}</span>
            </div>
            <div class="app-review-rating">
                <el-rate :model-value="rating" size="large" disabled />
            </div>
            <el-text class="app-review-content">
                {{  content  }}
            </el-text>
        </div>
        <slot class="app-oparation-slot" name="default">

        </slot>
    </el-card>
</template>

<script setup>
import UserAvatar from '@/components/user/user-avatar.vue';
import router from '@/router.js';
const props = defineProps({
    participant: {
        type: Object,
        required: false,
        default: () => {}
    },
    targetParticipant: {
        type: Object,
        required: false,
        default: () => {}
    },
    content: {
        type: String,
        required: false,
        default: '',
    },
    rating: {
        type: Number,
        required: false,
        default: 0,
    }
})

const goToThisProfile = (userId) => {
    console.log(userId);
    const currentUserId = localStorage.getItem('userId');
    if (userId === currentUserId) {
        router.push('/user/profile');
    } else if(userId) {
        router.push(`/other/${userId}`);
    } else if(userId === null || userId === undefined || userId === '' || userId === 0) {
        router.push('/sign-in');
    } 
}

</script>

<style scoped>
:deep(.app-user-appointment-review-body) {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    gap: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}
.app-review-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    justify-content: flex-start;
}

.app-participant-target {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    .el-icon{
        margin: 0 5px;
    }
}
.app-review-rating {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}
.app-review-content{
    width: 100%;
    white-space: pre-wrap;
}
.app-oparation-slot{
    flex: 1;
    text-align: right;
}
</style>
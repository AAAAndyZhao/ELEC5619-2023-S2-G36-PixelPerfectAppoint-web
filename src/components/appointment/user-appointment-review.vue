<template>
    <el-card class="app-user-appointment-review" body-class="app-user-appointment-review-body">
        <div class="app-participant-target">
            <user-avatar :user="participant" :size="20"/>
            <span>{{ participant.alias }}</span>
            <el-icon><Right /></el-icon>
            <user-avatar :user="targetParticipant" :size="20"/>
            <span>{{ targetParticipant.alias }}</span>
        </div>
        <div class="app-review-rating">
            <el-rate :model-value="rating" size="large" readonly />
        </div>
        <el-text class="app-review-content">
            {{  content  }}
        </el-text>
    </el-card>
</template>

<script setup>
import UserAvatar from '@/components/user/user-avatar.vue';
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
</script>

<style scoped>
:deep(.app-user-appointment-review-body) {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
    padding: 20px;
    box-sizing: border-box;
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
</style>
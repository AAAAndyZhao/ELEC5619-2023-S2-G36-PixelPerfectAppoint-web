<template>
    <div class="app-participant-edit">
        <el-radio-group class="app-role-radio-group" v-model="seletedRole" @change="handleRoleChange">
            <el-radio v-for="role in roleMenu" :key="role.code" :label="role.code"
            size="large" border>
                {{ role.value }}
            </el-radio>
        </el-radio-group>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
const emits = defineEmits(['update:role']);
const props = defineProps({
    participant: {
        type: Object,
        required: false,
        default: () => {}
    }
})
const seletedRole = ref(props.participant.role);

const roleMenu = $MENU["APPOINTMENT_PARTICIPANT_ROLE"];
const handleRoleChange = (value) => {
    emits('update:role', value)
}
</script>

<style scoped>
.app-role-radio-group{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    align-content: center;
    gap: 10px;
    font-size: 15px;
}
</style>
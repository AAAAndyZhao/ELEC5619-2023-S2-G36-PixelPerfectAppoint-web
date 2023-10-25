<template>
    <el-form :model="user" label-width="150px"
        class="app-info-form" size="default">
        <el-form-item label="Full name">
            <el-col :span="11">
                <el-form-item prop="firstName">
                    <el-input v-model="user.firstName" placeholder="firstname" readonly/>
                </el-form-item>
            </el-col>
            <el-col class="text-center" :span="2">
                <span class="text-gray-500"></span>
            </el-col>
            <el-col :span="11">
                <el-form-item prop="lastName">
                    <el-input v-model="user.lastName" placeholder="lastname" readonly/>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="Alias" prop="alias">
            <el-input v-model="user.alias" readonly></el-input>
        </el-form-item>
        <el-form-item label="User name" prop="userName">
            <el-input v-model="user.userName" readonly></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
            <el-input v-model="user.email" readonly></el-input>
        </el-form-item>
        
        <el-form-item label="Birthday" prop="birthday" class="app-birthday-picker">
            <el-date-picker v-model="user.birthday" type="date" label="Pick a date"
                placeholder="Pick a date" style="width: 100%" readonly/>
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
            <el-select v-model="user.gender" placeholder="choose gender" disabled>
                <el-option label="Male" :value="0" />
                <el-option label="Female" :value="1" />
                <el-option label="Prefer not to disclose" :value="2" />
            </el-select>
        </el-form-item>
        <el-form-item label="Professional" prop="professional">
            <el-checkbox-group :model-value="professionalValueArray" readonly>
                <el-checkbox label="Photographer" name="professional" border />
                <el-checkbox label="Model" name="professional" border />
                <el-checkbox label="Others" name="professional" border />
            </el-checkbox-group>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { computed } from 'vue';
import MenuUtils from '@/utils/menu';

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
})
const professionalMenu = $MENU['USER_PROFESSIONAL']
const professionalValueArray = computed(() => {
    return MenuUtils.getMultiMenuSelectedArray(professionalMenu, props.user.professional)
        .map(item => item.value);
})

</script>

<style scoped>
.app-info-form{
    width: 30%;
    min-width: 600px;
}
.app-info-form .el-form-item {
    margin-top: 30px;
    align-items: baseline;
}
.app-phone-code-select{
    width: 100px;
    display: inline-block;
}
.app-phone-number-input{
    width: 300px;
    margin-left: 30px;
}
.app-birthday-picker{
    width: 300px;
}
.app-password-input{
    height: 60px;
    flex-direction: row;
    align-items: flex-start;
}
</style>
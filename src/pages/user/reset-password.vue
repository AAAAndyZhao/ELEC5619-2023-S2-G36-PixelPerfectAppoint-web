<template>
    <div class="app-reset-password-form-container">
        <h1>Reset Password</h1>
        <div class="app-reset-password-content">
            <img src="@/assets/images/reset-password.png">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px"
            class="app-reset-password-form" :size="formSize" status-icon
            v-if="showResetPasswordForm">
                <el-form-item label="New password" prop="newPassword">
                    <el-input type="password" v-model="ruleForm.newPassword" placeholder="Please enter new password"></el-input>
                </el-form-item>
                <el-form-item label="Confirm password" prop="newPassword">
                    <el-input type="password" v-model="ruleForm.confirmPassword" placeholder="Please confirm new password"></el-input>
                </el-form-item>

                <el-form-item class="app-send-new-password-button">
                    <el-button type="primary" @click="submitForm">
                        Reset Password
                    </el-button>
                </el-form-item>
            </el-form>
            <div v-else>
                <h2>{{ shownText }}</h2>
                <h3>Go to <router-link to="/sign-in">Sign In</router-link></h3>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onBeforeMount } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import userApi from '../../services/user-api'

const props = defineProps({
    token: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        default: '',
    }
})
const showResetPasswordForm = ref(false)
const shownText = ref('')
const checkChangePasswordToken = async () => {
    try {
        const checkChangePasswordTokenRes: any = await userApi.verifyResetPasswordToken(props.token, props.id);
        if (checkChangePasswordTokenRes.code === 0) {
            showResetPasswordForm.value = true;
        }else{
            showResetPasswordForm.value = false;
            shownText.value = checkChangePasswordTokenRes.msg;
        }
    } catch (error: any) {
        shownText.value = error.message;
    }
}

interface RuleForm {
    newPassword: string,
    confirmPassword: string,
}

const formSize = ref('large')
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<RuleForm>({
    newPassword: '',
    confirmPassword: '',
})

const rules = reactive<FormRules<RuleForm>>({
    newPassword: [
        { required: true, message: 'Please input your new password', trigger: 'blur' },
        {
            trigger: 'blur',
            validator: (_rule, value, callback) => {
                var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}/
                if (!passwordreg.test(value)) {
                    callback(new Error('Password must be a combination of numbers, letters and special characters, please enter 8-16 digits.'))
                } else {
                    return callback()
                }
            }
        },
    ],
    confirmPassword: [
        { required: true, message: 'Please confirm your new password', trigger: 'blur' },
        {
            validator: (_rule: any, value: any, callback: any) => {
                if (value === '') {
                    callback(new Error('Please input password again'));
                } else if (value !== ruleForm.value.newPassword) {
                    callback(new Error('Two passwords are inconsistent!'));
                } else {
                    callback();
                }
            }, trigger: 'blur',
        }
    ],
})

const submitForm = async () => {
    try {
        await ruleFormRef.value?.validate();
        const requestChangePassword: any = await userApi.changePassword(props.id, props.token, ruleForm.value.newPassword);
        if (requestChangePassword.code === 0) {
            ElMessage.success('change password successfully!');
            showResetPasswordForm.value = false;
            shownText.value = 'You have successfully changed your password.';
        }else{
            ElMessage.error(`change password failed: ${requestChangePassword.msg}`);
        }
    } catch (error: any) {
        console.error(error);
        ElMessage.error(`change password failed: ${error.message}`);
    }
}

onBeforeMount(() => {
    checkChangePasswordToken();
})
</script>

<style scoped>
.app-reset-password-form-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.app-reset-password-content{
    width: 50%;
    height: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.app-reset-password-form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 40%;
}
.app-reset-password-form .el-form-item{
    margin-bottom: 50px;
}
</style>
<template>
    <div class="app-forget-password-form-container">
        <img src="../../assets/images/forget-password.png">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px"
            class="app-forget-password-form-info-input-items" :size="formSize" status-icon>
            <el-form-item>
                <h1>Forget Password</h1>
            </el-form-item>
            <el-form-item label="Email" prop="email">
                <el-input v-model="ruleForm.email" placeholder="Please enter email"></el-input>
            </el-form-item>

            <el-form-item class="app-send-email-button">
                <el-button type="primary" @click="submitForm">
                    Send Email
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import userApi from '../../services/user-api'

interface RuleForm {
    email: string
}
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<RuleForm>({
    email: '',
})

const checkEmail = (_rule: any, value: any, callback: any) => {
    const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (regEmail.test(value)) {
        return callback();
    }
    callback(new Error("Please input right email!"))
}

const rules = reactive<FormRules<RuleForm>>({
    email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur'}
    ],
})

const submitForm = async () => {
    try {
        await ruleFormRef.value?.validate();
        const requestChangePasswordRes: any = await userApi.requestChangePassword(ruleForm.value.email);
        if (requestChangePasswordRes.code === 0) {
            ElMessage.success('Email sent');
        }else{
            if (!requestChangePasswordRes.data || requestChangePasswordRes.data.length === 0) {
                ElMessage.error(`Send email failed: ${requestChangePasswordRes.msg}`);
            }else{
                const errorMsg = `Send email failed: ${requestChangePasswordRes.data.join(', ')}`;
                ElMessage.error(errorMsg);
            }
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('Send email failed');
    }
}
</script>





<style scoped>
.app-forget-password-form-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
}

.app-forget-password-form-info-input-items {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 20vw;
}

.app-send-email-button {
    margin-bottom: 0;
}
</style>
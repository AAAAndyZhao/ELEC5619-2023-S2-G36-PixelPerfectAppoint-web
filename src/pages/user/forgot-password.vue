<template>
    <div class="app-forget-password-form-container" >
        <img src="../../assets/images/forget-password.png" alt="sign-in-image">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="app-forget-password-form-info-input-items"
            :size="formSize"
            status-icon
            >
            <el-form-item >
                <h1>Forget Password</h1>
            </el-form-item>
            <el-form-item label="Email" prop="email">
                <el-input v-model="ruleForm.email" placeholder="Please enter email" ></el-input>
            </el-form-item>
            
            <el-form-item class="sendEmailButton">
                <el-button type="primary" @click="submitForm(ruleFormRef)">
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
import router from '../../router'



interface RuleForm {
  
    email: string
    

  
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

const ruleForm = ref<RuleForm>({
    email: '',
   
})

const rules = reactive<FormRules<RuleForm>>({
    email:  [
        { required: true, message: 'Please input email', trigger: 'blur' },
  ],
    
})

const submitForm = async (formEl: FormInstance | undefined) => {
    
  try{

    await ruleFormRef.value?.validate();
    const requestChangePassword: any = await userApi.requestChangePassword(ruleForm.value.email);
    if (requestChangePassword.code === 0){
        ElMessage.success('Email sent');
    }
  
  }catch(error){

  }
}
</script>





<style scoped>

.app-forget-password-form-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    justify-content: center;
    align-items: center;

}

.app-forget-password-form-info-input-items {
    display: flex;
    justify-content: center;
    flex-direction: column;
    : center;
    width:30vw;
    
}

.sendEmailButton {
    margin-bottom: 0;
}

</style>
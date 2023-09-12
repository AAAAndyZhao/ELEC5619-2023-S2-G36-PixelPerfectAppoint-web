<template>
  <div class="app-reset-password-form-container" >
      <img src="../../assets/images/reset-password.png" alt="sign-in-image">
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="140px"
          class="app-reset-password-form-info-input-items"
          :size="formSize"
          status-icon
          >
          <el-form-item >
              <h1>Reset Password</h1>
          </el-form-item>
          <el-form-item label="New password" prop="newPassword">
              <el-input v-model="ruleForm.newPassword" placeholder="Please enter new password" ></el-input>
          </el-form-item>
          
          <el-form-item class="sendNewPasswordButton">
              <el-button type="primary" @click="submitForm(ruleFormRef)">
                  Reset Password
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

  newPassword: string
  


}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

const ruleForm = ref<RuleForm>({
  newPassword: '',
 
})

const rules = reactive<FormRules<RuleForm>>({
  newPassword:  [
      { required: true, message: 'Please input your new password', trigger: 'blur' },
],
  
})

const submitForm = async (formEl: FormInstance | undefined) => {
  
try{

  await ruleFormRef.value?.validate();
  const requestChangePassword: any = await userApi.changePassword(ruleForm.value.email);
  if (requestChangePassword.code === 0){
      ElMessage.success('change password success!');
  }

}catch(error){

}
}
</script>





<style scoped>

.app-reset-password-form-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  display: flex;
  justify-content: center;
  align-items: center;

}

.app-reset-password-form-info-input-items {
  display: flex;
  justify-content: center;
  flex-direction: column;
  : center;
  width:30vw;
  
}

.sendNewPasswordButton {
  margin-bottom: 0;
}

</style>
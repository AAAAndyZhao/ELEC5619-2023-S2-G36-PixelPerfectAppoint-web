<template>
    <div class="app-sign-in-form-container" >
        <h2>Sign In</h2>
        <div class="app-user-sign-in">
            <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                :rules="rules"
                label-width="120px"
                class="app-sign-in-form-info-input-items"
                :size="formSize"
                status-icon
                >
                <el-form-item label="Email" prop="email">
                    <el-input v-model="ruleForm.email" placeholder="Please enter email" ></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="ruleForm.password" placeholder="Please enter password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                        Login
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="app-sign-in-form-to-forget-password">
            <p>Forget Password? <router-link to="/forgetpassword">forget</router-link></p>
        </div>
    </div>
    
</template>



<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  
  email: string
  password: string

  
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

const ruleForm = ref<RuleForm>({
  email: '',
  password: '',
})

const rules = reactive<FormRules<RuleForm>>({
    email:  [
    { required: true, message: 'Please input user name', trigger: 'blur' },
    
  ],
    password:  [
    { required: true, message: 'Please input user name', trigger: 'blur' },
    
  ],



})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>





<style scoped>
.app-sign-in-form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    width: 100%;
    height: 100%;
    padding: 0 20px;
}

   

</style>
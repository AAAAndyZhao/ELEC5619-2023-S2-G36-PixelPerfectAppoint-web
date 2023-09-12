<template>
    <div class="app-sign-in-form-container" >
        <img src="../../assets/images/sign-in.png" alt="sign-in-image">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="app-sign-in-form-info-input-items"
            :size="formSize"
            status-icon
            >
            <el-form-item >
                <h1>Sign In</h1>
            </el-form-item>
            <el-form-item label="Email" prop="email">
                <el-input v-model="ruleForm.email" placeholder="Please enter email" ></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
                <el-input v-model="ruleForm.password" placeholder="Please enter password" type="password"></el-input>
            </el-form-item>
            <el-form-item class="loginButton">
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    Login
                </el-button>
            </el-form-item>
        </el-form>  
    </div>
    <div class="app-sign-in-form-to-forget-password">
        <p>Forget Password? <router-link to="/forgetpassword">forget</router-link></p>
    </div>
</template>



<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import userApi from '../../services/user-api'
import router from '../../router'


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

const rules = reactive <FormRules<RuleForm>> ({
    email:  [
        { required: true, message: 'Please input user name', trigger: 'blur' },
  ],
    password:  [
        { required: true, message: 'Please input user name', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    
  try{
    const signInData = {
        email : ruleForm.value.email,
        password: ruleForm.value.password,

    }
    await ruleFormRef.value?.validate();
    const userloginStatus: any = await userApi.userLogin(signInData)
    if ( userloginStatus.code === 0 ){
        let usertoken = userloginStatus.data[0].token;
        localStorage.setItem('token',usertoken);
        console.log(usertoken)
        router.push('/main')
  }
  
  } catch ( error ){

  }
}
</script>





<style scoped>

.app-sign-in-form-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    justify-content: center;
    align-items: center;

}

.app-sign-in-form-info-input-items {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width:30vw;
    
}

.loginButton {
    margin-bottom: 0;
}

.app-sign-in-form-to-forget-password {
    position: absolute;
   top:80%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}


</style>
<template>
  <div class="app-sign-up-form-container">
      <h2>Create an Account</h2>
      <div class="app-user-sign-up">
          <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              label-width="120px"
              class="app-sign-up-form-info-input-items"
              :size="formSize"
              status-icon
           >
              <el-form-item label="Full name" required >
                  <el-col :span="11">
                      <el-form-item prop="first_name">
                          <el-input v-model="ruleForm.first_name" placeholder="firstname" />
                      </el-form-item>
                  </el-col>
                  <el-col class="text-center" :span="2">
                      <span class="text-gray-500"></span>
                  </el-col>
                  <el-col :span="11">
                      <el-form-item prop="last_name">
                          <el-input v-model="ruleForm.last_name" placeholder="lastname" />
                      </el-form-item>
                  </el-col>
              </el-form-item>
              <el-form-item label="Alias" prop="alias">
                  <el-input v-model="ruleForm.alias"></el-input>
              </el-form-item>
              <el-form-item label="User name" prop="user_name">
                  <el-input v-model="ruleForm.user_name"></el-input>
              </el-form-item>
              <el-form-item label="Email" prop="email">
                  <el-input v-model="ruleForm.email"></el-input>
              </el-form-item>
              <el-form-item label="Phone Number" prop="phone_number">
                  <el-input v-model="ruleForm.phone_number"></el-input>
              </el-form-item>
              <el-form-item label="Birth day" prop="birthday">
                  <el-date-picker
                          v-model="ruleForm.birthday"
                          type="date"
                          label="Pick a date"
                          placeholder="Pick a date"
                          style="width: 100%"
                  />
              </el-form-item>
              <el-form-item label="Gender" prop="gender">
                  <el-select v-model="ruleForm.gender" placeholder="choose gender">
                      <el-option label="male" value="male" />
                      <el-option label="female" value="female" />
                      <el-option label="prefer not to disclose" value="not" />
                  </el-select>
              </el-form-item>
              <el-form-item label="Professional" prop="professional">
                  <el-checkbox-group v-model="ruleForm.professional">
                      <el-checkbox label="Photographer" name="professional" border/>
                      <el-checkbox label="Model" name="professional" border/>
                  </el-checkbox-group>
              </el-form-item>
              <el-form-item label="Password" prop="new_password">
                  <el-input v-model="ruleForm.new_password" placeholder="Please enter password" ></el-input>
              </el-form-item>
              <el-form-item label="Confirm" prop="check_password">
                  <el-input v-model="ruleForm.check_password" placeholder="Please enter password again" ></el-input>
              </el-form-item>

          
              <el-form-item>
                  <el-button type="primary" @click="submitForm(ruleFormRef)">
                  Create
                  </el-button>
                  <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
              </el-form-item>
          </el-form>
      </div>
      <div class="app-sign-up-form-to-login-form">
          <p>Already have an account? <router-link to="/signin">Sign in</router-link></p>
      </div>
  </div>  
</template>


<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules, valueEquals } from 'element-plus'
import userApi from '../../services/user-api';
import { ElMessage, ElLoading } from 'element-plus';
import router from '../../router'


interface RuleForm {
first_name: string
last_name: string
alias: string
user_name: string
email: string
phone_number: string
birthday: string
gender: string
professional: string[]
new_password: string
check_password: string

}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<RuleForm>({
first_name: '',
last_name: '',
alias: '',
user_name: '',
email: '',
phone_number: '',
birthday: '',
gender: '',
professional: [],
new_password: '',
check_password: '',
})

const checkEmail = (rule: any, value:any, callback: any) => {
  const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (regEmail.test(value)) {
      return callback();
    }
    callback(new Error("Please input right email!"))

  }

const checkNumber = (rule: any, value:any, callback: any) => {
  const number = parseInt(value);
  if (!Number.isInteger(number)) {
    callback(new Error('Please input digits'))
  }else{
      if(value.length!==10){
          callback(new Error('Please input 9 number'))}
  }
  return callback();
}

  

const rules = reactive<FormRules<RuleForm>>({
first_name: [
  { required: true, message: 'Please input First name', trigger: 'blur' },
  { min: 3, max: 10, message: 'Length should be 3 to 5', trigger: 'blur' },
],
last_name:  [
  { required: true, message: 'Please input Last name', trigger: 'blur' },
  { min: 3, max: 10, message: 'Length should be 3 to 5', trigger: 'blur' },
],
alias:  [
  { required: true, message: 'Please input alias name', trigger: 'blur' },
  { min: 3, max: 15, message: 'Length should be 3 to 5', trigger: 'blur' },
],
user_name:  [
  { required: true, message: 'Please input user name', trigger: 'blur' },
  { min: 3, max: 15, message: 'Length should be 3 to 5', trigger: 'blur' },
],
email:  [
  { required: true, message: 'Please input user name', trigger: 'blur' },
  { validator:checkEmail, trigger: 'blur' },
],
phone_number:  [
  { required: true, message: 'Please input user name', trigger: 'blur' },
  { validator:checkNumber, trigger: 'blur' },
],
birthday: [
  {
    type: 'date',
    required: true,
    message: 'Please pick a date',
    trigger: 'change',
  },
],
gender: [
  {
    required: true,
    message: 'Please select Activity zone',
    trigger: 'change',
  },
],

professional: [
  {
    type: 'array',
    required: true,
    message: 'Please select at least one activity type',
    trigger: 'change',
  },
],

new_password:  [
  { required: true, message: 'Please input password', trigger: 'blur' },
  {
      trigger: 'blur',
      validator: (rule, value, callback) =>{
        var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}/
        if (!passwordreg.test(value)) {
          callback(new Error('Password must be a combination of numbers, letters and special characters, please enter 8-16 digits.'))
        }else{
          return callback()
        }
      } 
  },
],

    check_password:  [
    { required: true, message: 'Please input password', trigger: 'blur' },
    {
            validator: (rule: any, value: any, callback: any) => {
                if (value === '') {
                    callback(new Error('Please input password again'));
                } else if (value !== ruleForm.value.new_password) {
                    callback(new Error('Two passwords are inconsistent!'));
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        }
            
    ],
    })

    const submitForm = async (formEl: FormInstance | undefined) => {
        try {
        // check form validation
        await ruleFormRef.value?.validate();

        let gender_code;
        if(ruleForm.value.gender== 'male'){
            gender_code = 0
        }else if(ruleForm.value.gender== 'female') {
            gender_code = 1
        }else if(ruleForm.value.gender== 'not'){
            gender_code = 2
        }
        let professional_code;
        if(ruleForm.value.professional.includes('Photographer')==false){
            professional_code = 1
        }else if(ruleForm.value.professional.includes('Model')==false) {
            professional_code = 2
        }else if(ruleForm.value.professional.includes('Model')&&ruleForm.value.professional.includes('Model')==true){
            professional_code = 3
        }


        const userDate = {
            user_name : ruleForm.value.user_name,
            email: ruleForm.value.email,
            alias: ruleForm.value.alias,
            avatar_url: "https://www.example.com",
            password: ruleForm.value.check_password,
            phone_code: "1",
            phone_number: ruleForm.value.phone_number,
            first_name: ruleForm.value.first_name,
            last_name: ruleForm.value.last_name,
            birthday: "2000-11-01",
            gender: gender_code,
            description: "I am a test user",
            professional: 1
        }
        console.log("gender"+gender_code)
        console.log("profe"+professional_code)

        const userRegStatus: any = await userApi.userRegister(userDate)
        if(userRegStatus.code === 0) {
            router.push('/signin')
        } else {
            ElMessage.error(userRegStatus.msg);
        }
    } catch (error) {
        if (error.checkPwd) {
            ElMessage.error('Two passwords are inconsistent!');
        } else if (error.pwd) {
            ElMessage.error('Invalid password!');            
        } else if (error.email) {
            ElMessage.error('Invalid email address!');
        } else if (error.firstName) {
            ElMessage.error('Invalid first name!');
        } else if (error.lastname) {
            ElMessage.error('Invalid last name!');
        } else {
            ElMessage.error('Unknown error!');
        }
        
    }
};

 
        



const resetForm = (formEl: FormInstance | undefined) => {
if (!formEl) return
formEl.resetFields()
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
value: `${idx + 1}`,
label: `${idx + 1}`,
}))
</script>

<style scoped>

.app-sign-up-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
}

.app-user-sign-up {
  margin: 0 auto;
  padding: 60px;
  width: 600px;
}
</style>

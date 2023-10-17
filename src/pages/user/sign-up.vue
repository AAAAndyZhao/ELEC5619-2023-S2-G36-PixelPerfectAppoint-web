<template>
    <div class="app-sign-up-form-container">
        <el-card class="app-sign-up-card">
            <h2>Create an Account</h2>
            <div class="app-user-sign-up">
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="150px"
                    class="app-sign-up-form-info-input-items" :size="formSize" status-icon>
                    <el-form-item label="Full name" required>
                        <el-col :span="11">
                            <el-form-item prop="firstName">
                                <el-input v-model="ruleForm.firstName" placeholder="firstname" />
                            </el-form-item>
                        </el-col>
                        <el-col class="text-center" :span="2">
                            <span class="text-gray-500"></span>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item prop="lastName">
                                <el-input v-model="ruleForm.lastName" placeholder="lastname" />
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="Alias" prop="alias">
                        <el-input v-model="ruleForm.alias"></el-input>
                    </el-form-item>
                    <el-form-item label="User name" prop="userName">
                        <el-input v-model="ruleForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="ruleForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="Phone" prop="phone">
                        <el-select v-model="ruleForm.phone.phoneCode" class="app-phone-code-select">
                            <el-option v-for="country in allCountries" :key="country.iso2" :label="`+ ${country.dialCode}`" :value="country.dialCode">
                                <span :class="['flag-icon', `flag-icon-${country.iso2}`]"></span>
                                {{ `${country.name} +(${country.dialCode})` }}
                            </el-option>
                        </el-select>
                        <el-input v-model="ruleForm.phone.phoneNumber" class="app-phone-number-input"></el-input>
                    </el-form-item>
                    <el-form-item label="Birthday" prop="birthday" class="app-birthday-picker">
                        <el-date-picker v-model="ruleForm.birthday" type="date" label="Pick a date"
                            placeholder="Pick a date" style="width: 100%"
                            :disabled-date="disabledDateOfBirthday"/>
                    </el-form-item>
                    <el-form-item label="Gender" prop="gender">
                        <el-select v-model="ruleForm.gender" placeholder="choose gender">
                            <el-option label="Male" :value="0" />
                            <el-option label="Female" :value="1" />
                            <el-option label="Prefer not to disclose" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Professional" prop="professional">
                        <el-checkbox-group v-model="ruleForm.professional">
                            <el-checkbox label="Photographer" name="professional" border />
                            <el-checkbox label="Model" name="professional" border />
                            <el-checkbox label="Others" name="professional" border />
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="Password" prop="newPassword" class="app-password-input">
                        <el-input type="password" v-model="ruleForm.newPassword" placeholder="Please enter password"
                        show-password></el-input>
                    </el-form-item>
                    <el-form-item label="Confirm Password" prop="checkPassword" class="app-password-input">
                        <el-input type="password" v-model="ruleForm.checkPassword" placeholder="Please enter password again" show-password></el-input>
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" @click="submitForm"
                        :disabled="submitButtonDisabled"
                        :loading="submitButtonLoading">
                            Create
                        </el-button>
                        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="app-sign-up-form-to-login-form">
                <p>Already have an account? <router-link to="/sign-in">Sign in</router-link></p>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import userApi from '../../services/user-api';
import { ElMessage } from 'element-plus';
import router from '../../router';
import moment from "moment";
import { allCountries } from 'country-telephone-data';
import MenuUtils from '../../utils/menu';

declare const $MENU: any;

interface Phone {
    phoneCode: string,
    phoneNumber: string
}

interface RuleForm {
    firstName: string
    lastName: string
    alias: string
    userName: string
    email: string
    phone: Phone
    birthday: string
    gender: number | null
    professional: string[]
    newPassword: string
    checkPassword: string
}

onMounted(() => {
    
})
const submitButtonDisabled = ref(false)
const submitButtonLoading = ref(false)
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<RuleForm>({
    firstName: '',
    lastName: '',
    alias: '',
    userName: '',
    email: '',
    phone: {
        phoneCode: '61',
        phoneNumber: '',
    },
    birthday: '',
    gender: null,
    professional: [],
    newPassword: '',
    checkPassword: '',
})

const disabledDateOfBirthday = (time: Date) => {
  return time.getTime() > Date.now()
}

const checkEmail = (_rule: any, value: any, callback: any) => {
    const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (regEmail.test(value)) {
        return callback();
    }
    callback(new Error("Please input right email!"))
}

const checkPhone = (_rule: any, value: Phone, callback: any) => {
    const regPhoneCode = /^\d{1,4}$/;
    const regPhoneNumber = /^\d{9,11}$/;
    if (regPhoneCode.test(value.phoneCode) && regPhoneNumber.test(value.phoneNumber)) {
        return callback();
    }else if (!regPhoneCode.test(value.phoneCode)) {
        callback(new Error("Please input right phone code! 1-4 digits"))
    }else if (!regPhoneNumber.test(value.phoneNumber)) {
        callback(new Error("Please input right phone number! 9-11 digits"))
    }
    callback(new Error("Please input right phone number and code!"))
}

const checkEmailExist = (_rule: any, value: any, callback: any) => {
    setTimeout(() => {
        userApi.checkUserEmailExist(value).then((res: any) => {
            if (res.code === 1) {
                callback(new Error("Email already exists!"))
            } else {
                callback()
            }
        })
    }, 1000)
}

const checkUserNameExist = (_rule: any, value: any, callback: any) => {
    setTimeout(() => {
        userApi.checkUserNameExist(value).then((res: any) => {
            if (res.code === 1) {
                callback(new Error("User name already exists!"))
            } else {
                callback()
            }
        })
    }, 1000)
}

const rules = reactive<FormRules<RuleForm>>({
    firstName: [
        { required: true, message: 'Please input first name', trigger: 'blur' },
        { min: 1, max: 32, message: 'Length should be less than 32', trigger: 'blur' },
    ],
    lastName: [
        { required: true, message: 'Please input last name', trigger: 'blur' },
        { min: 1, max: 32, message: 'Length should be less than 32', trigger: 'blur' },
    ],
    alias: [
        { required: true, message: 'Please input alias', trigger: 'blur' },
        { min: 6, max: 32, message: 'Length should be 6 to 32', trigger: 'blur' },
    ],
    userName: [
        { required: true, message: 'Please input user name', trigger: 'blur' },
        { min: 6, max: 16, message: 'Length should be 6 to 16', trigger: 'blur' },
        { validator: checkUserNameExist, trigger: 'blur'}
    ],
    email: [
        { required: true, message: 'Please input email address', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' },
        { validator: checkEmailExist, trigger: 'blur'},
    ],
    phone: [
        { required: true, message: 'Please input phone number', trigger: 'blur' },
        { validator: checkPhone, trigger: 'blur' },
    ],
    birthday: [
        {
            required: true,
            message: 'Please pick a date',
            trigger: 'change',
        },
    ],
    gender: [
        {
            required: true,
            message: 'Please select your gender',
            trigger: 'change',
        },
    ],
    professional: [
        {
            type: 'array',
            required: true,
            message: 'Please select at least one professional',
            trigger: 'change',
        },
    ],
    newPassword: [
        { required: true, message: 'Please input password', trigger: 'blur' },
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
    checkPassword: [
        { required: true, message: 'Please input confirmed password', trigger: 'blur' },
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
    submitButtonDisabled.value = true;
    submitButtonLoading.value = true;
    try {
        // check form validation
        await ruleFormRef.value?.validate();
        let professionalCode = MenuUtils.getMultiMenuCode($MENU['USER_PROFESSIONAL'], ruleForm.value.professional)

        const birthday = moment(ruleForm.value.birthday).format("YYYY-MM-DD")

        const userDate = {
            user_name: ruleForm.value.userName,
            email: ruleForm.value.email,
            alias: ruleForm.value.alias,
            password: ruleForm.value.checkPassword,
            phone_code: ruleForm.value.phone.phoneCode,
            phone_number: ruleForm.value.phone.phoneNumber,
            first_name: ruleForm.value.firstName,
            last_name: ruleForm.value.lastName,
            birthday: birthday,
            gender: ruleForm.value.gender,
            description: "I am a test user",
            professional: professionalCode
        }
        const userRegStatus: any = await userApi.userRegister(userDate)
        if (userRegStatus.code === 0) {
            ElMessage.success("Register successfully!")
            router.push(`/sign-up-success?alias=${userDate.alias}`)
        } else {
            if (!userRegStatus.data || userRegStatus.data.length === 0) {
                ElMessage.error(`Send email failed: ${userRegStatus.msg}`);
            }else{
                const errorMsg = `Send email failed: ${userRegStatus.data.join(', ')}`;
                ElMessage.error(errorMsg);
            }
        }
    } catch (error) {
        console.error(error)
        ElMessage.error("Register failed! Some error occurred!");
    } finally {
        setTimeout(() => {
            submitButtonDisabled.value = false;
            submitButtonLoading.value = false;
        }, 1000)
    }
};

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
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
    box-sizing: border-box;
    position: relative;
    background-image: url(src/assets/images/sign-up-background.jpg);
    background-size: cover;
    background-position: center;
}
.app-sign-up-card {
    margin: auto auto;
    width: 100%px;
    opacity: 0.9;
}
.app-user-sign-up {
    margin: 0 auto;
    padding: 60px;
    width: 600px;
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

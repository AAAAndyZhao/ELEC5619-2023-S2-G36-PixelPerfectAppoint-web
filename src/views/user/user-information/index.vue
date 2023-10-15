<template>
    <div class="app-user-information">
        <div class="app-title-container">
            <div class="app-title">My Profile</div>
            <button id="edit-profile-btn" class="btn-primary" @click="toggle_edit_mode">Edit</button>
        </div>
        <div id="profile-view-container">
            <div class="profile-data"><img v-bind:src="profileData.avatarUrl == 'default' ? 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' : profileData.avatarUrl"/></div>
            <div class="profile-label">First Name</div>
            <div class="profile-data">{{profileData.firstName}}</div>
            <div class="profile-label">Last Name</div>
            <div class="profile-data">{{profileData.lastName}}</div>
            <div class="profile-label">Alias</div>
            <div class="profile-data">{{profileData.alias}}</div>
            <div class="profile-label">User Name</div>
            <div class="profile-data">{{profileData.userName}}</div>
            <div class="profile-label">Email</div>
            <div class="profile-data">{{profileData.email}}</div>
            <div class="profile-label">Birthday</div>
            <div class="profile-data">{{profileData.birthday}}</div>
            <div class="profile-label">Description</div>
            <div class="profile-data">{{profileData.description}}</div>
            <div class="profile-label">Gender</div>
            <div class="profile-data">{{profileData.gender}}</div>
            <div class="profile-label">Phone Code</div>
            <div class="profile-data">+{{profileData.phoneCode}}</div>
            <div class="profile-label">Phone Number</div>
            <div class="profile-data">{{profileData.phoneNumber}}</div>
        </div>
        <div id="profile-edit-container">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="150px"
                class="app-sign-up-form-info-input-items" :size="formSize" status-icon>
                <el-form-item label="Full name" required>
                    <el-col :span="11">
                        <el-form-item prop="firstName">
                            <el-input v-model="ruleForm.firstName" v-bind:value="profileData.firstName" placeholder="firstname" />
                        </el-form-item>
                    </el-col>
                    <el-col class="text-center" :span="2">
                        <span class="text-gray-500"></span>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="lastName">
                            <el-input v-model="ruleForm.lastName" v-bind:value="profileData.lastName" placeholder="lastname" />
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="Alias" prop="alias">
                    <el-input v-model="ruleForm.alias" v-bind:value="profileData.alias"></el-input>
                </el-form-item>
                <el-form-item label="User name" prop="userName">
                    <el-input v-model="ruleForm.userName" v-bind:value="profileData.userName"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="ruleForm.email" v-bind:value="profileData.email"></el-input>
                </el-form-item>
                <el-form-item label="Phone" prop="phone">
                    <el-select v-model="ruleForm.phone.phoneCode" class="app-phone-code-select">
                        <el-option v-for="country in allCountries" :key="country.iso2" :label="`+ ${country.dialCode}`" :value="country.dialCode">
                            <span :class="['flag-icon', `flag-icon-${country.iso2}`]"></span>
                            {{ `${country.name} +(${country.dialCode})` }}
                        </el-option>
                    </el-select>
                    <el-input v-model="ruleForm.phone.phoneNumber" v-bind:value="profileData.phoneNumber" class="app-phone-number-input"></el-input>
                </el-form-item>
                <el-form-item label="Birthday" prop="birthday" class="app-birthday-picker">
                    <el-date-picker v-model="ruleForm.birthday" type="date" label="Pick a date"
                        placeholder="Pick a date" style="width: 100%"
                        :disabled-date="disabledDateOfBirthday"/>
                </el-form-item>
                <el-form-item label="Gender" prop="gender">
                    <el-select id="gender-select" v-model="ruleForm.gender" placeholder="choose gender">
                        <el-option label="Male" :value="0"/>
                        <el-option label="Female" :value="1"/>
                        <el-option label="Prefer not to disclose" :value="2"/>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm"
                    :disabled="submitButtonDisabled"
                    :loading="submitButtonLoading">
                        Save
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import postApi from '@/services/user-api';
import userApi from '@/services/user-api';
import { ElMessage } from 'element-plus';
import router from '@/router';
import moment from "moment";
import { allCountries } from 'country-telephone-data';
import MenuUtils from '@/utils/menu';

const loading = ref(false);
const profileData = ref({});

function toggle_edit_mode() {
    var button = document.getElementById('edit-profile-btn');
    var edit_container = document.getElementById('profile-edit-container');
    var view_container = document.getElementById('profile-view-container');
    if (button?.textContent == 'Edit') {
        if (edit_container != null) {
            edit_container.style.display = 'block';
        }
        if (view_container != null) {
            view_container.style.display = 'none';
        }
        button.textContent = 'Save';
    } else if (button?.textContent == 'Save') {
        submitForm();
        if (edit_container != null) {
            edit_container.style.display = 'none';
        }
        if (view_container != null) {
            view_container.style.display = 'block';
        }
        button.textContent = 'Edit';
        fetchProfileData();
    }
}

const fetchProfileData = async () => {
    loading.value = true;
    try{
        const res = await postApi.getUserProfile();
        if (res.code === 0){
            profileData.value = res.data[0];
            var gender_select = document.getElementById("gender-select");
            if (gender_select != null) {
                gender_select.value = profileData.value.gender;
            }
            
        }else{
            ElMessage.error('Failed to get profile data');
        }
    }catch(err){
        console.log(err);
        ElMessage.error('Failed to get profile data');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

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
    fetchProfileData();
});

const submitButtonDisabled = ref(false)
const submitButtonLoading = ref(false)
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

const ruleForm = ref<RuleForm>({
    firstName: profileData.firstName,
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

        const birthday = moment(ruleForm.value.birthday).format("YYYY-MM-DD")

        const userDate = {
            user_name: ruleForm.value.userName,
            email: ruleForm.value.email,
            alias: ruleForm.value.alias,
            phone_code: ruleForm.value.phone.phoneCode,
            phone_number: ruleForm.value.phone.phoneNumber,
            first_name: ruleForm.value.firstName,
            last_name: ruleForm.value.lastName,
            birthday: birthday,
            gender: ruleForm.value.gender
        }
        const userRegStatus: any = await userApi.userSave(userDate)
        if (userRegStatus.code === 0) {
            ElMessage.success("User information saved successfully!");
            toggle_edit_mode();
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
        ElMessage.error("Save failed! Some error occurred!");
    } finally {
        setTimeout(() => {
            submitButtonDisabled.value = false;
            submitButtonLoading.value = false;
        }, 1000)
    }
};

</script>

<style scoped>
.app-user-information {
    height: 100%;
    min-height: 100%;
}

.app-title-container {
    text-align: left;
    display: flex;
    align-items: center;
}

.app-title {
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    text-align: left;
    font-weight: bold;
}

.edit-profile-btn {
    margin-left: 25px;
}

#profile-edit-container {
    display: none;
}

.profile-label {
    font-size: 18px;
    text-align: left;
    font-weight: bold;
}

.profile-data {
    font-size: 16px;
    text-align: left;
    margin-bottom: 10px;
}
</style>
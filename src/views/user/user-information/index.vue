<template>
    <div class="app-user-information" v-loading="loading">
        <div class="app-title-container">
            <div class="app-title">My Profile</div>
        </div>
        <div class="app-info-form-container">
            <div class="app-avatar-container">
                <div class="app-user-avatar-cover" @click="handleClickAvatar"></div>
                <UserAvatar class="app-user-avatar"
                :size="150" :user="profileData" /> 
            </div>
            <el-form ref="userFormRef" :model="profileData" :rules="rules" label-width="150px"
                class="app-info-form" size="default"
                :disabled="!isEdit">
                <el-form-item label="Full name" required>
                    <el-col :span="11">
                        <el-form-item prop="firstName">
                            <el-input v-model="profileData.firstName" placeholder="firstname" />
                        </el-form-item>
                    </el-col>
                    <el-col class="text-center" :span="2">
                        <span class="text-gray-500"></span>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="lastName">
                            <el-input v-model="profileData.lastName" placeholder="lastname" />
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="Alias" prop="alias">
                    <el-input v-model="profileData.alias"></el-input>
                </el-form-item>
                <el-form-item label="User name" prop="userName">
                    <el-input v-model="profileData.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="profileData.email" disabled></el-input>
                </el-form-item>
                <el-form-item label="Phone" prop="phone">
                    <el-select v-model="profileData.phoneCode" class="app-phone-code-select">
                        <el-option v-for="country in allCountries" :key="country.iso2" :label="`+ ${country.dialCode}`" :value="country.dialCode">
                            <span :class="['flag-icon', `flag-icon-${country.iso2}`]"></span>
                            {{ `${country.name} +(${country.dialCode})` }}
                        </el-option>
                    </el-select>
                    <el-input v-model="profileData.phoneNumber" class="app-phone-number-input"></el-input>
                </el-form-item>
                <el-form-item label="Birthday" prop="birthday" class="app-birthday-picker">
                    <el-date-picker v-model="profileData.birthday" type="date" label="Pick a date"
                        placeholder="Pick a date" style="width: 100%"
                        :disabled-date="disabledDateOfBirthday"/>
                </el-form-item>
                <el-form-item label="Gender" prop="gender">
                    <el-select v-model="profileData.gender" placeholder="choose gender">
                        <el-option label="Male" :value="0" />
                        <el-option label="Female" :value="1" />
                        <el-option label="Prefer not to disclose" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Professional" prop="professional">
                    <el-checkbox-group v-model="profileData.professional">
                        <el-checkbox label="Photographer" name="professional" border />
                        <el-checkbox label="Model" name="professional" border />
                        <el-checkbox label="Others" name="professional" border />
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="app-buttons-container">
                <el-button v-if="isEdit" type="primary" @click="submitForm"
                    :loading="submitButtonLoading">
                    Submit
                </el-button>
                <el-button v-if="isEdit" @click="cancelEdit">
                    Cancel
                </el-button>
                <el-button v-if="!isEdit" type="primary" @click="toEdit">
                    Edit
                </el-button>
            </div>
        </div>
        <UserUploadAvatarDialog :show="showUploadAvatarDialog"
        v-if="showUploadAvatarDialog"
        @upload-success="handleAvatarUploadSuccess"/>
        
    </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import userApi from '@/services/user-api';
import { ElMessage, ElLoading } from 'element-plus';
import router from '@/router';
import moment from "moment";
import { allCountries } from 'country-telephone-data';
import MenuUtils from '@/utils/menu';
import UserAvatar from '@/components/user/user-avatar.vue';
import UserUploadAvatarDialog from '@/components/user/user-upload-avatar-dialog.vue'

const loading = ref(false);
const submitButtonDisabled = ref(false)
const submitButtonLoading = ref(false)
const profileData = ref({});
const showUploadAvatarDialog = ref(false);
const userFormRef = ref(null);
const isEdit = ref(false);


const checkPhone = (_rule, value, callback) => {
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
const rules = {
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
}

const disabledDateOfBirthday = (time) => {
  return time.getTime() > Date.now()
}

const fetchProfileData = async () => {
    loading.value = true;
    try{
        const res = await userApi.getUserProfile();
        if (res.code === 0 && res.data !== null && res.data.length > 0){
            const userObj = res.data[0];
            profileData.value = {
                ...userObj,
                professional: MenuUtils.getMultiMenuSelectedArray($MENU['USER_PROFESSIONAL'], userObj.professional)
                    .map(item => item.value),
            }
        }else{
            ElMessage.error('Failed to get profile data');
        }
    }catch(err){
        console.error(err);
        ElMessage.error('Failed to get profile data');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

const handleClickAvatar = () => {
    showUploadAvatarDialog.value = false;
    nextTick(() => {
        showUploadAvatarDialog.value = true;
    })
}

const handleAvatarUploadSuccess = async (uploadRes) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Updating avatar...',
        background: 'rgba(255, 255, 255, 0.7)',
    })
    try{
        if (uploadRes.code === 0 && uploadRes.data.length > 0){
            const res = await userApi.updateAvatar(uploadRes.data[0].id);
            if (res.code === 0){
                ElMessage.success('Update avatar successfully');
                await fetchAvatar();
                showUploadAvatarDialog.value = false;
                loading.close();
            }else{
                ElMessage.error('Failed to update avatar');
            }
            showUploadAvatarDialog.value = false;
            console.log('finally', showUploadAvatarDialog.value)
        }else{
            ElMessage.error('Failed to upload avatar');
        }
    }catch(err){
        console.error(err);
        ElMessage.error('Failed to update avatar');
    }finally{
        setTimeout(() => {
            showUploadAvatarDialog.value = false;
            loading.close();
        }, 10000);
    }
}

const fetchAvatar = async () => {
    try{
        const res = await userApi.getUserProfile();
        if (res.code === 0 && res.data !== null && res.data.length > 0){
            profileData.value.avatarUrl = res.data[0].avatarUrl;
        }else{
            ElMessage.error('Failed to get avatar data');
        }
    }catch(err){
        console.error(err);
        ElMessage.error('Failed to get avatar data');
    }
}
const toEdit = () => {
    isEdit.value = true;
}

const submitForm = async () => {
    loading.value = true;
    try{
        const res = await userApi.updateUserProfile(profileData.value);
        if (res.code === 0){
            ElMessage.success('Update profile successfully');
            isEdit.value = false;
            await fetchProfileData();
        }else{
            ElMessage.error('Failed to update profile');
        }
    }catch(err){
        console.error(err);
        ElMessage.error('Failed to update profile');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}
const cancelEdit = () => {
    isEdit.value = false;
    fetchProfileData();
}

onMounted(() => {
    fetchProfileData();
});

</script>

<style scoped>
.app-user-information {
    min-height: calc(100vh - 100px);
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
.app-info-form-container{
    min-height: calc(100vh - 160px);
    text-align: left;
}
.app-avatar-container,
.app-buttons-container {
    box-sizing: border-box;
    margin-top: 30px;
    padding-left: 70px;
}
.app-user-avatar{
    cursor: pointer;
}

.app-info-form{
    width: 30%;
    min-width: 600px;
}
.app-info-form .el-form-item {
    margin-top: 20px;
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
.app-user-avatar-cover{
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1;
}
.app-user-avatar-cover:hover {
    border: 1px solid #409eff;
    transition: all 0.2s;
}

</style>
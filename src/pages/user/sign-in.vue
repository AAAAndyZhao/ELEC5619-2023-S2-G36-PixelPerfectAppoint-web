<template>
    <div class="app-sign-in">
        <img src="../../assets/images/sign-in.png" alt="app-sign-in-image">
        <div class="app-sign-in-form-container">
            <h1>Welcome to Pixel Perfect Appoint!</h1>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px"
            class="app-sign-in-form-info-input-form" :size="formSize">
                <el-form-item label="Email" prop="email">
                    <el-input v-model="ruleForm.email" placeholder="Please enter email"
                    size="large" clearable></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="ruleForm.password" placeholder="Please enter password" type="password"
                    size="large" show-password @keyup.enter.native="submitForm"></el-input>
                </el-form-item>
                <p class="app-note">Forget Password? <router-link to="/forget-password">Forget</router-link></p>
                <el-form-item>
                    <el-button class="app-login-button" type="primary" @click="submitForm"
                    :disabled="signInButtonDisabled" :loading="signInButtonLoading">
                        Sign In
                    </el-button>
                </el-form-item>
            </el-form>
            <el-divider class="app-divider" border-style="dashed"> OR </el-divider>
            <!-- <img class="app-google-login-button" src="/img/google/2x/btn_google_signin_dark_normal_web@2x.png" @click="signInByGoogle"/> -->
            <p class="app-note">Don't have an account? <router-link to="/sign-up">Sign up</router-link></p>
        </div>
    </div>
</template>



<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import userApi from '../../services/user-api'
import router from '../../router'

const props = defineProps({
    redirect: {
        type: String,
        default: '',
    },
})

interface RuleForm {
    email: string
    password: string
}

let needRedirect: boolean = false;
let needPush: boolean = false; 
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const signInButtonLoading = ref(false)
const signInButtonDisabled = ref(false)
const ruleForm = ref<RuleForm>({
    email: '',
    password: '',
})
const rules = reactive<FormRules<RuleForm>>({
    email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Please input password', trigger: 'blur' },
    ],
})

const submitForm = async () => {
    signInButtonLoading.value = true;
    signInButtonDisabled.value = true;
    try {
        const signInData = {
            email: ruleForm.value.email,
            password: ruleForm.value.password,
        }
        await ruleFormRef.value?.validate();
        const userloginStatus: any = await userApi.userLogin(signInData);
        if (userloginStatus.code === 0) {
            ElMessage.success('Sign in successfully!');
            const usertoken = userloginStatus.data[0].token;
            const userId = userloginStatus.data[0].id;
            localStorage.setItem('token', usertoken);
            localStorage.setItem('userId', userId);

            if (needRedirect){
                setTimeout(() => {
                    window.location.href = props.redirect;
                }, 1000);
            }else if (needPush){
                setTimeout(() => {
                    router.push(props.redirect);
                }, 1000);
            }else{
                setTimeout(() => {
                    router.push('/main');
                }, 1000);
            }
        }else{
            ElMessage({
                message: userloginStatus.msg,
                type: 'error',
            })
        }
    } catch (error) {
        console.error(error);
        ElMessage({
            message: 'Sign in failed, some error occurred',
            type: 'error',
        })
    }finally{
        setTimeout(() => {
            signInButtonLoading.value = false;
            signInButtonDisabled.value = false;
        }, 1000);
    }
}

// const signInByGoogle = async () => {
//     try {
        
//     } catch (error) {
//         console.error(error);
//     }
// }

const checkRedirect = () => {
    if (!props.redirect) return;
    console.log(props.redirect)
    const regPathFormat = /^\/[\w- .\/?%&=]*$/;
    if (props.redirect && props.redirect.startsWith('http://')) {
        needRedirect = true;
    }else if(props.redirect && regPathFormat.test(props.redirect)){
        needPush = true;
    }
    console.log(needRedirect, needPush)
}

onBeforeMount(async () => {
    checkRedirect()
    if (!props.redirect) return;
    if (!localStorage.getItem('token')) return;
    try{
        const verifyTokenRes: any = await userApi.userLoginVerify();
        if (verifyTokenRes.code === 0) {
            ElMessage.success('You have already logged in!');
            if (needRedirect){
                setTimeout(() => {
                    window.location.href = props.redirect;
                }, 1000);
            }else if (needPush){
                setTimeout(() => {
                    router.push(props.redirect);
                }, 1000);
            }else{
                setTimeout(() => {
                    router.push('/main');
                }, 1000);
            }
        }
    }catch(error){
        console.error(error);
    }
})
</script>

<style scoped>
.app-sign-in {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.app-sign-in-form-container{
    width: 50%;
    height: 50%;
}
.app-sign-in-form-info-input-form {
    margin: 80px auto;
    margin-bottom: 0;
    width: 40%;
}
.app-sign-in-form-info-input-form .el-form-item{
    width: 100%;
}
.app-sign-in-form-info-input-form .app-note{
    text-align: left;
    box-sizing: border-box;
    padding-left: 100px;
}
.app-login-button {
    height: 44px;
    width: 100%;
}
.app-google-login-button {
    height: 44px;
    cursor: pointer;
}
.app-divider{
    margin: 30px auto;
    width: 40%;
}
</style>
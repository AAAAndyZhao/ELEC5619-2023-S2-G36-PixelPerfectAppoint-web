<template>
    <div class="app-sign-out" v-loading="loading">
        <img src="/img/logo.png"/>
        <h1>{{ titleText }}</h1>
        <h3>{{ subTitleText }}</h3>        
    </div>
</template>

<script setup>
import userApi from '@/services/user-api';
import router from '@/router';
import { ElLoading, ElMessage } from 'element-plus';
import { onBeforeMount, ref } from 'vue';
import { Loading } from '@icon-park/vue-next';

const loading = ref(false)

const signingOut = {
    title: 'Signing out...',
    subTitle: 'Please wait...',
}
const hasNotSignedIn = {
    title: 'You have not signed in yet.',
    subTitle: 'Redirecting to sign in page...',
}
const successfullySignOut = {
    title: 'You have successfully signed out.',
    subTitle: 'Redirecting to sign in page...',
}
const failedToSignOut = {
    title: 'Failed to sign out.',
    subTitle: 'Redirecting to sign in page...',
}

const titleText = ref(signingOut.title);
const subTitleText = ref(signingOut.subTitle);

const signOut = async () => {
    loading.value = true;
    try{
        if (!localStorage.getItem('token')) {
            ElMessage.warning('You have not signed in yet.');
            titleText.value = hasNotSignedIn.title;
            subTitleText.value = hasNotSignedIn.subTitle;
        }else{
            const signOutRes = await userApi.signOut();
            if (signOutRes.code === 0) {
                ElMessage.success('Sign out successfully!');
                titleText.value = successfullySignOut.title;
                subTitleText.value = successfullySignOut.subTitle;
            }else{
                ElMessage.error(`Sign out failed: ${signOutRes.msg}`);
                titleText.value = failedToSignOut.title;
                subTitleText.value = failedToSignOut.subTitle;
            }
        }
        
    }catch(error){
        ElMessage.error(`Sign out failed: ${error.message}`);
        titleText.value = failedToSignOut.title;
        subTitleText.value = failedToSignOut.subTitle;
    }finally{
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setTimeout(() => {
            loading.value = false;
        }, 500);
        setTimeout(() => {
            router.push('/sign-in');
        }, 3000);
    }
}

onBeforeMount(() => {
    signOut();
})
</script>

<style scoped>
.app-sign-out {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
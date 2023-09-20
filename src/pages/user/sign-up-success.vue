<template>
    <div class="app-sign-up-success">
        <img src="/img/logo.png"/>
        <h1>Thanks for signing up, {{ shownUserAlias }}!</h1>
        <h3>A confirmation email has been sent to your email address.</h3>
        <h3>Please click the link in the email to activate your account.</h3>
        <router-link to="/sign-in">To Sign In</router-link>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const router = useRoute()
// get user alias from url query string
const userAlias = router.query.alias
const shownUserAlias = userAlias ? `${userAlias}` : ''
</script>

<style scoped>
.app-sign-up-success {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>

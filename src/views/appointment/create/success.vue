<template>
    <div class="app-appointment-create-success">
        <img src="/img/logo.png"/>
        <h1>You have successfully create an appointment!</h1>
        <h3>Confirmation emails have been sent to other participants</h3>
        <h3>You can check it in your appointment list</h3>
        <router-link to="/user/profile">Check</router-link>
    </div>
</template>

<script setup>

</script>

<style scoped>
.app-appointment-create-success {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
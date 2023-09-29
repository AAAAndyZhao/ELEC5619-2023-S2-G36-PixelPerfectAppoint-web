<template>
    <div class = "user-info-container">
        <div class = "user-info" >
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="70"></el-avatar>
            <el-descriptions title="123456" >
                <el-descriptions-item> @ftest </el-descriptions-item> 
            </el-descriptions>
        </div>
        <el-button type="primary" icon="User">Follow</el-button>
    </div>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'
// define props
const props = defineProps({
    // define props here
    // userID
    userId: {
        type: String,
        required: true
    },
})
</script>

<style scoped>
.user-info{
    display: flex;
    
}
.user-info-container{
    display: flex;
    align-items: center; 
    
    justify-content: space-between;
}

.follow{
    justify-content: flex-end
}


</style>
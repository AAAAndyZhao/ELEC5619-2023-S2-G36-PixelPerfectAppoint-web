<template>
    <el-card class="app-portfolio-card" body-class="app-portfolio-card-body" shadow="hover">
        <div class="app-portfolio-card-cover-pics" @click="openPortfolio">
            <div class="app-portfolio-cover-pic-main">
                <PhotoImage v-if="portfolio.coverPhoto && portfolio.coverPhoto.url" :src="portfolio.coverPhoto.url" alt="cover"
                    style="height: 100%;width: 100%;object-fit: cover;" />
            </div>
            <el-divider direction="vertical" style="margin: 0 2px;height: 100%;" />
            <div class="app-portfolio-cover-pic-subs"></div>
        </div>
        <el-divider style="margin: 2px 0;" />
        <div class="app-portfolio-info">
            <div class="app-portfolio-name">{{ portfolio.title }}</div>
            <div class="app-portfolio-category">{{ portfolio.category.name }}</div>
            <div class="app-portfolio-date-button-container">
                <div class="app-portfolio-publish-date">Created at: {{ portfolio.createDatetime }}</div>
                <div class="app-portfolio-delete-hide-button">
                    <el-button type="text" @click="delectPortfolio">
                        <el-icon size="medium">
                            <Delete />
                        </el-icon>
                    </el-button>
                    <el-button type="text" @click="toggleVisibility">
                        <el-icon size="medium">
                            <Hide v-if="portfolio.hidden" />
                            <View v-else />
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { watch, computed, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PhotoImage from '@/components/photo/photo-image.vue';

const emits = defineEmits(['customClick']);
const props = defineProps({
    portfolio: {
        type: Object,
        required: false,
        default: () => ({
            id: 'unknown',
            owner: 'unknown',
            title: 'unknown',
            createDatetime: 'unknown',
            category: {
                name: 'unknown',
            },
            coverPhoto: {
                url: 'unknown',
                thumbnailUrl: 'unknown',
            },
            hidden: 'unknown',
        })
    },

});
const openPortfolio = () => {
    emits('customClick');
}

const toggleVisibility = () => {
    const message = props.portfolio.hidden
        ? 'Do you want to change this portfolio to public?'
        : 'Do you want to change this portfolio to private?';
    ElMessageBox.confirm(message, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
    }).then(() => {
        props.portfolio.hidden = !props.portfolio.hidden;
        // ElMessage({
        //     type: 'success',
        //     message: 'Change visibility successfully!'
        // });
        console.log(props.portfolio.hidden);
        emits('customClick', { id: props.portfolio.id , hidden: props.portfolio.hidden });
    }).catch(() => {
        // do nothing
    });
}
const delectPortfolio = () => {
    ElMessageBox.confirm('Do you want to delete this portfolio? (This will not delete the photos in this portfolio.)', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
    }).then(() => {
        ElMessage({
            type: 'success',
            message: 'Delete successfully!'
        });
    }).catch(() => {
        // do nothing
    });
}

</script>

<style scoped>
.app-portfolio-card {
    width: 30vh;
    height: 30vh;
    border-radius: 8px;
    box-sizing: border-box;
    margin: 0;
    float: left;
    overflow: hidden;
    border: 1px solid #E4E7ED;
    background-color: #f1f1f1;
}

.app-portfolio-card-cover-pics {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100% /3 * 2);
    box-sizing: border-box;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.app-portfolio-cover-pic-main {
    height: 100%;
    width: 67%;
    box-sizing: border-box;
    /* background-color: rgb(87, 10, 243); */
}

.app-portfolio-cover-pic-subs {
    height: 100%;
    box-sizing: border-box;
    flex: 1;
    /* background-color: rgb(243, 10, 10); */
}

.app-portfolio-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    flex: 1;
    box-sizing: border-box;
    padding: 2% 2%;
    gap: 3px;
}

.app-portfolio-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: #f1f1f1;
    font-size: 14px;
    font-weight: bold;
    color: #000;
}

.app-portfolio-category {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: #f1f1f1;
    font-size: 14px;
    color: #000;
}

.app-portfolio-date-button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 21px;
}

.app-portfolio-publish-date {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: #f1f1f1;
    font-size: 10px;
    color: #000;
}

.app-portfolio-delete-hide-button {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 2%;
}

:deep(.app-portfolio-card-body) {
    display: flex;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    flex-direction: column;

}
</style>
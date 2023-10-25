<template>
    <el-card class="app-portfolio-card" body-class="app-portfolio-card-body" shadow="hover">
        <PhotoImage class="app-portfolio-cover-img" v-if="portfolio.coverPhoto && portfolio.coverPhoto.thumbnailUrl"
            @click="openPortfolio" :src="portfolio.coverPhoto.thumbnailUrl" alt="cover image" />
        <el-divider style="margin: 2px 0;" />
        <div class="app-portfolio-info">
            <div class="app-portfolio-name">{{ portfolio.title }}</div>
            <div class="app-portfolio-category" @click="openPortfolio">{{ portfolio.category.name }}</div>
            <div class="app-portfolio-date-button-container">
                <div class="app-portfolio-publish-date">Created at: {{ portfolio.createDatetime }}</div>
                <div class="app-portfolio-delete-hide-button">
                    <el-button link @click="delectPortfolio">
                        <el-icon size="medium">
                            <Delete />
                        </el-icon>
                    </el-button>
                    <el-button link @click="toggleVisibility">
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
import { Windows } from '@icon-park/vue-next';
import router from '@/router';

const emits = defineEmits(['update-portfolio-visibility', 'delectPortfolio']);
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

const toggleVisibility = () => {
    const message = props.portfolio.hidden
        ? 'Do you want to change this portfolio to public?'
        : 'Do you want to change this portfolio to private?';
    ElMessageBox.confirm(message, 'Warning', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
    }).then(() => {
        console.log(props.portfolio.hidden);
        ElMessageBox.confirm('Do you want update with all the photos?', 'Warning', {
            distinguishCancelAndClose: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
        }).then(() => {
            emits('update-portfolio-visibility', { id: props.portfolio.id, hidden: !props.portfolio.hidden, sync: true });
        }).catch(() => {
            emits('update-portfolio-visibility', { id: props.portfolio.id, hidden: !props.portfolio.hidden, sync: false });
        })
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
        emits('delectPortfolio', { id: props.portfolio.id });
    }).catch(() => {
        // do nothing
    });
}

const jumpToPortfolioEdit = () => {
    router.push({
        path: `../portfolio/update/${props.portfolio.id}`,
    }).then(() => {
        Windows.location.reload();
    });
}

const openPortfolio = () => {
    router.push({
        path: `../portfolio/photos-inside/${props.portfolio.id}`,
    });
}

</script>

<style scoped>
.app-portfolio-card {
    width: 320px;
    height: 300px;
    border-radius: 10px;
    box-sizing: border-box;
    float: left;
    overflow: hidden;
    border: 1px solid #E4E7ED;
    background-color: #f1f1f1;
}

.app-portfolio-card-cover-pics {
    display: flex;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.app-portfolio-cover-pic-main-container {
    width: 140px;
    height: 120px;
    box-sizing: border-box;
}

.app-portfolio-cover-img {
    height: 100%;
    border-radius: 10px;
}

:deep(.app-portfolio-cover-img .el-image .el-image__inner) {
    height: 180px;
    width: 100%;
    object-fit: cover;
    margin: auto;
}

:deep(.el-image) {
    width: 100%;
    border-radius: 10px;
}

.app-portfolio-cover-empty {
    width: 100%;
    height: 100%;
    transform: scale(0.5);
    transform-origin: center;
}

.app-portfolio-cover-pic-subs {
    height: 100%;
    box-sizing: border-box;
    flex: 1;
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
    position: relative;
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
    /* gap: 2%; */
}

:deep(.app-portfolio-card-body) {
    display: flex;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    flex-direction: column;
    padding: 10px;
}
</style>
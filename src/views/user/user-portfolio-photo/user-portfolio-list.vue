<template>
    <div class="app-user-portfolios-list">
        <PortfolioCard v-for="portfolio in data" :key="portfolio.id" :portfolio="portfolio"
            @update-portfolio-visibility="updatePortfolioVisibility" 
            @delectPortfolio="handleDeletePortfolio" ></PortfolioCard>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { Search } from '@icon-park/vue-next';
import userApi from '@/services/user-api';
import { ElMessage, ElMessageBox } from 'element-plus';
import PortfolioCard from '@/components/photo/portfolio-card.vue';

const emits = defineEmits(['update-portfolio-visibility', 'delectPortfolio']);
const props = defineProps({
    data: {
        type: Array,
        required: false,
        default: () => []
    }
})

const updatePortfolioVisibility = (portfolioData) => {
    emits('update-portfolio-visibility', portfolioData);
}
const handleDeletePortfolio = (portfolioData) => {
    emits('delectPortfolio', portfolioData);
}

</script>

<style scoped>
.app-user-portfolios-list {
    width: 100%;
    display: flex;
    gap: 10px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    min-height: calc(100% - 170px);
}
</style>
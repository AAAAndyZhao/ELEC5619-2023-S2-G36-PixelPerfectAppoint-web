<template>
    <div class="app-user-post">
        <div class="app-title">My Posts</div>
        <div class="app-filter-container">
            <el-input class="app-filter app-search-input"
            :prefix-icon="Search" placeholder="Search posts"
            v-model="filterProps.searchText"
            @keyup.enter.native="fetchPostsData(true)"/>
            <el-date-picker
            class="app-filter app-date-range-picker"
            v-model="filterProps.dateRange"
            type="daterange"
            :shortcuts="dateRangeShortcuts"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"/>
            <el-button type="primary" @click="fetchPostsData(true)">Search</el-button>
            <div class="app-sort-select-container">
                <label>Sorted by</label>
                <el-select v-model="filterProps.sortedBy" class="app-filter app-sort-select" placeholder="Select" size="large"
                @change="handleSortChange">
                    <el-option
                    v-for="item in sortOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <el-divider></el-divider>
        <div class="app-posts-container" v-loading="loading">
            <PostsList :data="postData" @remove="handleRemovePost" @edit="handleEditPost"/>
            <el-pagination layout="prev, pager, next"
            :total="postsPaginationProps.total"
            :current-page="postsPaginationProps.currentPage"
            :page-size="postsPaginationProps.pageSize"
            @update:current-page="postsPaginationProps.handleCurrentPageChange"/>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Search } from '@icon-park/vue-next';
import PostsList from './posts-list.vue';
import postApi from '@/services/post-api';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

const loading = ref(false);
const postData = ref([]);
const sortOptions = ref([{
    label: 'Newest',
    value: 'newest',
    sort: {
        sortedBy: 'latest',
        order: 'desc'
    }
}, {
    label: 'Oldest',
    value: 'oldest',
    sort: {
        sortedBy: 'latest',
        order: 'asc'
    }
}, {
    label: 'Most liked',
    value: 'likes',
    sort: {
        sortedBy: 'likes',
        order: 'desc'
    }
}]);
const dateRangeShortcuts = [{
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
}, {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
}, {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
},]

const filterProps = ref({
    searchText: '',
    sortedBy: 'newest',
    dateRange: []
});

const postsPaginationProps = ref({
    currentPage: 1,
    pageSize: 30,
    total: 0,
    handleCurrentPageChange: (page) => {
        postsPaginationProps.value.currentPage = page;
        fetchPostsData();
    }
});

const fetchPostsData = async (isReload = false) => {
    loading.value = true;
    if (isReload){
        postsPaginationProps.value.currentPage = 1;
    }
    const sortedOption = sortOptions.value.find(item => item.value === filterProps.value.sortedBy);
    let startDateStr;
    let endDateStr;
    if (filterProps.value.dateRange && filterProps.value.dateRange.length === 2){
        startDateStr = dayjs(filterProps.value.dateRange[0]).format('YYYY-MM-DD');
        endDateStr = dayjs(filterProps.value.dateRange[1]).format('YYYY-MM-DD');
    }
    try{
        const res = await postApi.getUserPosts(
            postsPaginationProps.value.currentPage,
            postsPaginationProps.value.pageSize,
            {
                ...sortedOption.sort,
                searchText: filterProps.value.searchText,
                dateRange: filterProps.value.dateRange,
                start: startDateStr,
                end: endDateStr
            }
        );
        if (res.code === 0){
            postData.value = res.data;
            postsPaginationProps.total = res.totalCount;
        }else{
            ElMessage.error('Failed to get posts data: ' + res.msg);
            postData.value = [];
            postsPaginationProps.total = 0;
        }
    }catch(err){
        console.error(err);
        ElMessage.error('Failed to get posts data');
    }finally{
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

const handleSortChange = (value) => {
    filterProps.sortedBy = value;
    fetchPostsData(true);
}

const handleRemovePost = async (postId) => {
    loading.value = true;
    try{
        const res = await postApi.deleteSinglePost(postId);
        if (res.code === 0){
            ElMessage.success('Post deleted successfully');
            fetchPostsData(true);
        }else{
            ElMessage.error('Failed to delete post: ' + res.msg);
        }
    }catch(err){
        console.error(err);
        ElMessage.error('Failed to delete post');
    }
}

const handleEditPost = (postId) => {
    // todo: to edit post page
}

onMounted(() => {
    fetchPostsData(true);
});
</script>

<style scoped>
.app-user-post{
    height: 100%;
    min-height: 100%;
}
.app-title {
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    text-align: left;
    font-weight: bold;
}
.app-filter-container {
    height: 60px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 20px;
}
:deep(.app-filter-container .app-filter) {
    height: 40px;
    width: 300px;
    box-sizing: border-box;
}
.app-filter-container .app-filter.app-search-input {
    width: 300px;
}
:deep(.app-filter-container .app-filter.app-date-range-picker) {
    width: 400px;
    flex-grow: unset;
}
.app-filter-container .app-filter.app-sort-select {
    width: 200px;
}
.app-posts-container {
    height: calc(100% - 160px);
    width: 100%;
    box-sizing: border-box;
    padding: 20px 20px;
    overflow-y: auto;
}
.app-sort-select-container{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    flex: 1;
}
.app-posts-container .el-pagination {
    justify-content: center
}

</style>
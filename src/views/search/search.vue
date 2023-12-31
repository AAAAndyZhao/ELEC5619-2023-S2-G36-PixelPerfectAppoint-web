<template>
    <div class="app-search" v-loading.fullscreen.lock="loading">
        <el-card class="app-search-filter">
            <div class="app-search-filter-basic">
                <el-input class="app-searchbox" size="large" v-model="searchForm.searchText"
                    :placeholder="searchBoxPlaceHolder" @keyup.enter.native="search(true)">
                    <template #prepend>
                        <el-select v-model="searchForm.searchType" placeholder="Select" size="large"
                            class="app-search-type-select">
                            <el-option label="User" value="user"></el-option>
                            <el-option label="Post" value="post"></el-option>
                            <el-option label="Photo" value="photo"></el-option>
                        </el-select>
                    </template>
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                    <template #append>
                        <el-button @click="search(true)" size="large" type="primary">Search</el-button>
                    </template>
                </el-input>
                <div class="app-only-show-following-wrapper">
                    <el-checkbox v-model="searchForm.onlyShowFollowing" size="large">Only show following</el-checkbox>
                </div>
                <el-switch style="margin-left: 40px;" v-model="searchForm.hasAdvancedParams" active-text="Advanced"
                    size="large" />
                <div class="app-sorted-by-wrapper">
                    <span>Sorted by: </span>
                    <el-select v-model="searchForm.sortedBy" size="large" class="app-sorted-by-select">
                        <el-option v-for="item in searchTypeToSortedByOptionsMap[searchForm.searchType]" :key="item.value"
                            :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
            </div>
            <div v-if="searchForm.hasAdvancedParams" class="app-search-filter-advance">
                <el-form-item label="Camera model">
                    <el-select v-model="searchForm.photoParams.camMaker" class="app-cam-maker-select">
                        <el-option v-for="item in camMakerOptions" :key="item.code" :label="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </div>

        </el-card>
        <div class="app-search-result">
            <UserSearchResult v-if="resultDisplayProps.user" :data="userData" />
            <PostSearchResult v-if="resultDisplayProps.post" :data="postData" />
            <PhotoSearchResult v-if="resultDisplayProps.photo" :data="photoData" />
            <el-pagination layout="prev, pager, next" :total="pageProps.total" :current-page="pageProps.page"
                :page-size="pageProps.size" @update:current-page="pageProps.handleCurrentPageChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import UserSearchResult from '@/views/search/user-search-result.vue';
import PostSearchResult from '@/views/search/post-search-result.vue';
import PhotoSearchResult from '@/views/search/photo-search-result.vue';
import userApi from '@/services/user-api';
import postApi from '@/services/post-api';
import photoApi from '@/services/photo-api';
import router from '@/router';

const props = defineProps({
    keyword: {
        type: String,
        default: ''
    },
    searchType: {
        type: String,
        default: 'photo'
    }
});

const searchTypeToSortedByOptionsMap = {
    user: [{
        label: 'Most relevance',
        value: 'relevance'
    }, {
        label: 'Most followers',
        value: 'most_followers'
    }],
    post: [{
        label: 'Most relevance',
        value: 'relevance'
    }, {
        label: 'Latest',
        value: 'latest'
    }, {
        label: 'Most likes',
        value: 'most_likes'
    }],
    photo: [{
        label: 'Latest',
        value: 'latest'
    }, {
        label: 'Most likes',
        value: 'most_likes'
    }],
}
const loading = ref(false);
const searchForm = ref({
    searchText: '',
    searchType: 'photo',
    sortedBy: '', // init value will be set in onMounted
    hasAdvancedParams: false,
    photoParams: {
        camMaker: 'All',
        camModel: '', // TODO: not implemented yet
        lens: '', // TODO: not implemented yet
    }
});
const resultDisplayProps = ref({
    user: false,
    post: false,
    photo: true,
});

const pageProps = ref({
    page: 1,
    size: 30,
    total: 0,
    handleCurrentPageChange: (page) => {
        pageProps.value.page = page;
        search();
    }
});
const camMakerOptions = [{ code: $PUBLIC.INF_INT, value: 'All' }].concat($MENU['CAM_MAKER'])

const userData = ref([]);
const photoData = ref([]);
const postData = ref([]);

const searchBoxPlaceHolder = computed(() => {
    switch (searchForm.value.searchType) {
        case 'user':
            return 'Search user';
        case 'post':
            return 'Search post';
        case 'photo':
            return 'Search photo';
        default:
            return 'Search';
    }
});

const switchResult = (active) => {
    console.log(active)
    if (resultDisplayProps.value[active]) {
        return;
    }

    resultDisplayProps.value.user = false;
    resultDisplayProps.value.post = false;
    resultDisplayProps.value.photo = false;

    resultDisplayProps.value[active] = true;
    searchForm.value.searchType = active;
}

const search = (reload = false) => {
    loading.value = true;
    if (reload) {
        pageProps.value.page = 1;
    }
    try {
        switch (searchForm.value.searchType) {
            case 'user':
                searchUser();
                break;
            case 'post':
                searchPost();
                break;
            case 'photo':
                searchPhoto();
                break;
            default:
                break;
        }
    } catch (e) {
        console.error(e);
        ElMessage.error('Failed to search: ' + e.message);
    } finally {
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}
const syncKeywordAndTypeToUrl = () => {
    // add keyword and searchType to url but not reload
    router.push({
        path: '/search',
        query: {
            keyword: searchForm.value.searchText,
            type: searchForm.value.searchType
        }
    }, undefined, { shallow: true });
}
const searchUser = async () => {
    switchResult('user');
    syncKeywordAndTypeToUrl();
    try {
        const res = await userApi.searchUser(
            searchForm.value.searchText,
            pageProps.value.page,
            pageProps.value.size,
            searchForm.value.sortedBy,
            searchForm.value.onlyShowFollowing,
        );
        console.log(res);
        if (res.code === 0) {
            pageProps.value.total = res.totalCount;
            userData.value = res.data;
        } else {
            userData.value = [];
        }
    } catch (e) {
        console.error(e);
        ElMessage.error('Failed to search user');
    }
}

const searchPost = async () => {
    switchResult('post');
    syncKeywordAndTypeToUrl();
    try {
        const res = await postApi.searchPosts(
            searchForm.value.searchText,
            pageProps.value.page,
            pageProps.value.size,
            searchForm.value.sortedBy,
            'desc'
        );
        if (res.code === 0) {
            pageProps.value.total = res.totalCount;
            postData.value = res.data;
        } else {
            postData.value = [];
        }
    } catch (e) {
        console.error(e);
        ElMessage.error('Failed to search post');
    }
}

const searchPhoto = async () => {
    switchResult('photo');
    syncKeywordAndTypeToUrl();
    try {
        const res = await photoApi.searchPhotos(
            searchForm.value.searchText,
            pageProps.value.page,
            pageProps.value.size,
            $PUBLIC.INF_INT,
            searchForm.value.sortedBy,
            'desc',
            searchForm.value.hasAdvancedParams
                ? {
                    camMaker: searchForm.value.photoParams.camMaker && searchForm.value.photoParams.camMaker !== 'All'
                        ? searchForm.value.photoParams.camMaker
                        : '',
                    // camModel: searchForm.value.photoParams.camModel,
                    // lens: searchForm.value.photoParams.lens,
                }
                : {}
        );
        if (res.code === 0) {
            pageProps.value.total = res.totalCount;
            photoData.value = res.data;
        } else {
            photoData.value = [];
        }
    } catch (e) {
        console.error(e);
        ElMessage.error('Failed to search photo');
    }
}

watch(() => searchForm.value.searchType, () => {
    searchForm.value.sortedBy = searchTypeToSortedByOptionsMap[searchForm.value.searchType][0].value;
})

onMounted(async() => {
    if(props.keyword) {
        searchForm.value.searchText = props.keyword;
        searchForm.value.searchType = props.searchType;
        searchForm.value.sortedBy = searchTypeToSortedByOptionsMap[searchForm.value.searchType][0].value;
        search(true);
    }
})
</script>

<style scoped>
.app-search {
    min-height: calc(100vh - 100px);
    box-sizing: border-box;
    padding: 20px;

    .app-search-result {
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
    }
}

.app-search-filter {
    min-height: 100px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;

    .app-search-filter-basic {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;
        flex: 1;
    }

    .app-search-filter-advance {
        margin-top: 10px;
        min-height: 40px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;
        flex: 1;

        .app-cam-maker-select {
            width: 150px;
        }
    }

    .app-searchbox {
        width: 500px;
    }

    .app-search-type-select {
        width: 110px;
    }

    .app-sorted-by-wrapper {
        width: 280px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        flex: 1;

        .app-sorted-by-select {
            width: 180px;
        }
    }

    .app-only-show-following-wrapper {
        margin-left: 20px;
    }
}

:deep(.app-search-filter>.el-card__body) {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
}

.app-search-result .el-pagination {
    margin-top: 20px;
    justify-content: center
}
</style>
<template>
    <div class="app-search" v-loading.fullscreen.lock="loading">
        <el-card class="app-search-filter">
            <el-input class="app-searchbox" size="large" v-model="searchForm.searchText" :placeholder="searchBoxPlaceHolder"
                @keyup.enter.native="search(true)">
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
            </el-input>
            <div class="app-only-show-following-wrapper">
                <el-checkbox v-model="searchForm.onlyShowFollowing" size="large">Only show following</el-checkbox>
            </div>
            <div class="app-sorted-by-wrapper">
                <span>Sorted by: </span>
                <el-select v-model="searchForm.sortedBy" size="large" class="app-sorted-by-select">
                    <el-option v-for="item in searchTypeToSortedByOptionsMap[searchForm.searchType]" :key="item.value"
                        :label="item.label" :value="item.value"></el-option>
                </el-select>
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
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import UserSearchResult from '@/views/search/user-search-result.vue';
import PostSearchResult from '@/views/search/post-search-result.vue';
import PhotoSearchResult from '@/views/search/photo-search-result.vue';
import userApi from '@/services/user-api';
import postApi from '@/services/post-api';

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
        label: 'Most relevance',
        value: 'relevance'
    }, {
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
    sortedBy: 'relevance',
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

const userData = ref([]);
const photoData = ref([
        {
            "id": "aefa5b97-ec21-45e1-ad81-dd4674059406",
            "owner": {
                "id": "ff34d5ce-c025-4810-b49a-c38864574972",
                "userName": "andyzhaocccc",
                "alias": "AAAAndyZ",
                "avatarUrl": "default",
                "description": "I am a test user",
                "professional": 3,
                "followerCount": 0,
                "following": false,
                "followed": false
            },
            "name": "gcx1",
            "description": "gcx1",
            "uploadDatetime": "2023-10-13 19:03:28.0",
            "location": null,
            "hidden": false,
            "deleted": false,
            "url": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/344a5e8e-5a6d-4dc2-9153-44bfeabf493a",
            "thumbnailUrl": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/344a5e8e-5a6d-4dc2-9153-44bfeabf493a_thumbnail",
            "photoParamId": null,
            "photoCategory": {
                "code": 0,
                "name": "Uncategorized"
            },
            "photoParam": null
        },
        {
            "id": "b90982f6-8960-4555-a246-2b6f6872c8f1",
            "owner": {
                "id": "ff34d5ce-c025-4810-b49a-c38864574972",
                "userName": "andyzhaocccc",
                "alias": "AAAAndyZ",
                "avatarUrl": "default",
                "description": "I am a test user",
                "professional": 3,
                "followerCount": 0,
                "following": false,
                "followed": false
            },
            "name": "gcx2.PNG",
            "description": "gcx2",
            "uploadDatetime": "2023-10-13 19:03:28.0",
            "location": null,
            "hidden": false,
            "deleted": false,
            "url": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/31ccfd82-9d29-4dad-8a63-a8b51bae29ff",
            "thumbnailUrl": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/31ccfd82-9d29-4dad-8a63-a8b51bae29ff_thumbnail",
            "photoParamId": null,
            "photoCategory": {
                "code": 2,
                "name": "Portrait"
            },
            "photoParam": null
        },
        {
            "id": "cb988e30-dbbb-40a0-9a36-b303ee855941",
            "owner": {
                "id": "ff34d5ce-c025-4810-b49a-c38864574972",
                "userName": "andyzhaocccc",
                "alias": "AAAAndyZ",
                "avatarUrl": "default",
                "description": "I am a test user",
                "professional": 3,
                "followerCount": 0,
                "following": false,
                "followed": false
            },
            "name": "gcx.PNG",
            "description": "gcx3",
            "uploadDatetime": "2023-10-13 20:05:34.0",
            "location": null,
            "hidden": false,
            "deleted": false,
            "url": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/b4174eb1-b273-4f87-8ef0-2bf1f73fe0cf",
            "thumbnailUrl": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/b4174eb1-b273-4f87-8ef0-2bf1f73fe0cf_thumbnail",
            "photoParamId": null,
            "photoCategory": {
                "code": 2,
                "name": "Portrait"
            },
            "photoParam": {
                "id": "9e204e42-569b-4eeb-870e-3fb6a23b530d",
                "camMaker": null,
                "camModel": null,
                "lens": null,
                "focalLength": null,
                "exposureTime": null,
                "iso": null,
                "resolutionX": 7339,
                "resolutionY": 5504,
                "fnumber": null
            }
        },
        {
            "id": "aefa5b97-ec21-45e1-ad81-dd4674059406",
            "owner": {
                "id": "ff34d5ce-c025-4810-b49a-c38864574972",
                "userName": "andyzhaocccc",
                "alias": "AAAAndyZ",
                "avatarUrl": "default",
                "description": "I am a test user",
                "professional": 3,
                "followerCount": 0,
                "following": false,
                "followed": false
            },
            "name": "gcx1",
            "description": "gcx1",
            "uploadDatetime": "2023-10-13 19:03:28.0",
            "location": null,
            "hidden": false,
            "deleted": false,
            "url": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/344a5e8e-5a6d-4dc2-9153-44bfeabf493a",
            "thumbnailUrl": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/344a5e8e-5a6d-4dc2-9153-44bfeabf493a_thumbnail",
            "photoParamId": null,
            "photoCategory": {
                "code": 0,
                "name": "Uncategorized"
            },
            "photoParam": null
        },
        {
            "id": "b90982f6-8960-4555-a246-2b6f6872c8f1",
            "owner": {
                "id": "ff34d5ce-c025-4810-b49a-c38864574972",
                "userName": "andyzhaocccc",
                "alias": "AAAAndyZ",
                "avatarUrl": "default",
                "description": "I am a test user",
                "professional": 3,
                "followerCount": 0,
                "following": false,
                "followed": false
            },
            "name": "gcx2.PNG",
            "description": "gcx2",
            "uploadDatetime": "2023-10-13 19:03:28.0",
            "location": null,
            "hidden": false,
            "deleted": false,
            "url": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/31ccfd82-9d29-4dad-8a63-a8b51bae29ff",
            "thumbnailUrl": "https://objectstorage.ap-sydney-1.oraclecloud.com/p/7qynybiKqne3SrXORgpDM70fVLwCnSl-bveQ-LCZDfs8VxDt-_LfaxAG-JTCCjQ8/n/sdhdhqcmzyxg/b/ppa-photo-bucket/o/31ccfd82-9d29-4dad-8a63-a8b51bae29ff_thumbnail",
            "photoParamId": null,
            "photoCategory": {
                "code": 2,
                "name": "Portrait"
            },
            "photoParam": null
        }
    ]);
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

const searchUser = async () => {
    switchResult('user');
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
    console.log(searchForm.value)
    console.log(resultDisplayProps.value)
    try {
        const res = await postApi.searchPosts(
            searchForm.value.searchText,
            pageProps.value.page,
            pageProps.value.size,
            searchForm.value.sortedBy,
            searchForm.value.onlyShowFollowing,
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
</script>

<style scoped>
.app-search {
    min-height: calc(100vh - 100px);
    box-sizing: border-box;
    padding: 20px;

    .app-search-filter {
        height: 100px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
    }

    .app-search-result {
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
    }
}

.app-search-filter {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

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
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    display: flex;
}

.app-search-result .el-pagination {
    justify-content: center
}
</style>
/*
This is the post api service, which is used to communicate with the backend server.
All the api calls should be defined here.
*/

import axios from "../utils/axios.js";

const getUserPosts = async (page, limit, filterProps, userId) => {
    userId = userId || localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {
        return axios.post(`/post/get_of_user?uid=${userId}`, {
            uid: userId,
            search_text: filterProps.searchText,
            page: page,
            size: limit,
            sorted_by: filterProps.sortedBy,
            order: filterProps.order,
            start: filterProps.start,
            end: filterProps.end
        })
    } catch (error) {
        console.error('Error during requesting user posts: ', error);
        throw error;
    }
}
const uploadPost = async (post) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {
        return await axios.post('/post/add', post, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {

        throw error;
    }

}

const searchPosts = async (searchText, page = 1, size = 30, sortedBy, order, onlyFollowing = false) => {
    try {
        return axios.post('/post/search', {
            search_text: searchText,
            page: page,
            size: size,
            sorted_by: sortedBy,
            order: order
            // onlyFollowing not implemented yet
        });
    } catch (error) {
        console.error('Error during searching posts: ', error);
        throw error;
    }
}

const deleteSinglePost = async (postId) => {
    return await deletePosts([postId]);
}

const deletePosts = async (postIds) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {
        return axios.post(`/post/delete`, {
            uid: userId,
            post_ids: postIds
        }, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {
        console.error('Error during deleting post: ', error);
        throw error;
    }
}
const getPostDetail = async (postId) => {
    try {

        return axios.get(`/post/get/${postId}`);
    } catch (error) {
        console.error('Error during getting post detail: ', error);
        throw error;
    }
}
const updatePostDetail = async (postId, postData) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {

        return axios.post(`/post/update/${postId}`, postData, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {
        console.error('Error during getting post detail: ', error);
        throw error;
    }
}

const likePost = async (data) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {

        return axios.post(`/post/like`, data, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {
        console.error('Error during liking post : ', error);
        throw error;
    }
}

const unlikePost = async (data) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {

        return axios.post(`/post/unlike`, data, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {
        console.error('Error during unliking post : ', error);
        throw error;
    }
}

const checkLikePost = async (data) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {

        return axios.post(`/post/check_like`, data, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {
        console.error('Error during unliking post : ', error);
        throw error;
    }
}


export default {
    getUserPosts,
    uploadPost,
    searchPosts,
    searchPosts,
    deleteSinglePost,
    deletePosts,
    getPostDetail,
    updatePostDetail,
    likePost,
    unlikePost,
    checkLikePost

}

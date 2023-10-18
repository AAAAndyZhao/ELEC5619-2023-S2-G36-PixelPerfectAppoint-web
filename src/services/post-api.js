/*
This is the post api service, which is used to communicate with the backend server.
All the api calls should be defined here.
*/
import axios from "../utils/axios.js";

const getUserPosts = async (page, limit, filterProps) => {
    const userId = localStorage.getItem('userId');
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

export default {
    getUserPosts,
    searchPosts
}

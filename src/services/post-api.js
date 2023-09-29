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
    try{
        return {
            code: 0,
            msg: 'OK',
            data: [],
            totalCount: 0,
            totalPages: 0,
        }
    }catch (error) {
        console.error('Error during requesting user posts: ', error);
        throw error;
    }
}

export default {
    getUserPosts
}

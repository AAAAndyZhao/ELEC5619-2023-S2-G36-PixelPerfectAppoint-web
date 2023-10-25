import axios from "../utils/axios.js";

const addReview = async (review) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {
        return axios.post(`/post/review/add`,review,{
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {
        console.error('Error during adding review: ', error);
        throw error;
    }
}

const getReviewList = async (data) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {

        return axios.post(`post/review/find`,data);
    } catch (error) {
        console.error('Error during getting review: ', error);
        throw error;
    }
}

export default {
    addReview,
    getReviewList
}
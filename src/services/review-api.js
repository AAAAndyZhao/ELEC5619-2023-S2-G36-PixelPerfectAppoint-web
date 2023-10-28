import axios from "../utils/axios.js";

const addPostReview = async (review) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {
        return axios.post(`/post/review/add`, review, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {
        console.error('Error during adding review: ', error);
        throw error;
    }
}

const getPostReviewList = async (data) => {
    try {
        return axios.post(`post/review/find`, data);
    } catch (error) {
        console.error('Error during getting review: ', error);
        throw error;
    }
}

const addPhotoReview = async (review) => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {
        return axios.post(`/photo/review/add`, review, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {
        console.error('Error during adding review: ', error);
        throw error;
    }
}
const getPhotoReviewList = async ({ photoId, parentReviewNo, page, size}) => {
    try {
        return axios.post(`photo/review/find`, {
            photo_id: photoId,
            parent_review_no: parentReviewNo,
            page,
            size
        }, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });
    } catch (error) {
        console.error('Error during getting review: ', error);
        throw error;
    }
}

export default {
    addPostReview,
    getPostReviewList,
    addPhotoReview,
    getPhotoReviewList
}
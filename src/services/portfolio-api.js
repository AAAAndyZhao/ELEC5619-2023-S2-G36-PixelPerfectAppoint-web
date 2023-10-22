/*
This is the portfolio api service, which is used to communicate with the backend server.
All the api calls should be defined here.
*/
import axios from "../utils/axios.js";

const getUserPortfolio = async (userId, token, page, size) => {
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    if (!token) {
        throw new Error('Token is invalid');
    }
    if (isNaN(page) || page === null || page === undefined || page === ''
        || page < 1) {
        throw new Error('Page is invalid');
    }
    if (isNaN(size) || size === null || size === undefined || size === ''
        || size < 1) {
        throw new Error('Size is invalid');
    }
    try {
        return await axios.get(`/portfolio/get_of_user?uid=${userId}&page=${page}&size=${size}`, {
            headers: {
                'authorization': token
            }
        });
    }
    catch (error) {
        console.error('Error during requesting user info: ', error);
        throw error;
    }
}
const changePortfolioVisibility = async (uid, token, portfolioId, hidden, syncAll) => {
    if (!uid) {
        throw new Error('User id is invalid');
    }
    if (!token) {
        throw new Error('Token is invalid');
    }
    if (!portfolioId) {
        throw new Error('Portfolio id is invalid');
    }
    if (hidden === null || hidden === undefined) {
        throw new Error('Hidden is invalid');
    }
    if (syncAll === null || syncAll === undefined) {
        throw new Error('Sync all is invalid');
    }
    try {
        return await axios.post('/portfolio/change_hidden_status', {
            uid: uid,
            portfolio_id: portfolioId,
            hidden: hidden,
            sync_all: syncAll
        }, {
            headers: {
                'authorization': token
            }
        });
    } catch (error) {
        console.error('Error during changing portfolio visibility: ', error);
        throw error;
    }
}


const createPortfolio = async (portfolio) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        throw new Error("No userId, please login first.");
    }
    const portfolioBody = {
        uid: userId,
        title: portfolio.title,
        description: portfolio.description,
        category_code: portfolio.categoryCode,
        photo_ids: portfolio.photoIds,
        cover_photo_id: portfolio.coverPhotoId,
        public: portfolio.isPublic,
    }
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token, please login first.");
    }
    return axios.post("/portfolio/add", portfolioBody, {
        headers: {
            "authorization": token
        }
    })
}

const getPortfolioById = async (portfolioId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token, please login first.");
    }
    return axios.get(`/portfolio/get/${portfolioId}`, {
        headers: {
            "authorization": token
        }
    })
}

const updatePortfolio = async (portfolio, portfolioId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        throw new Error("No userId, please login first.");
    }
    const portfolioBody = {
        uid: userId,
        title: portfolio.title,
        description: portfolio.description,
        category_code: portfolio.categoryCode,
        photo_ids: portfolio.photoIds,
        cover_photo_id: portfolio.coverPhotoId,
        public: portfolio.isPublic,
    }
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token, please login first.");
    }
    return axios.post(`/portfolio/update/${portfolioId}`, portfolioBody, {
        headers: {
            "authorization": token
        }
    })
}

export default {
    createPortfolio,
    getPortfolioById,
    updatePortfolio,
    getUserPortfolio,
    changePortfolioVisibility,
}

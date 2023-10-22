import axios from "../utils/axios.js";  

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
}

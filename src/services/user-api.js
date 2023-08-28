/*
This is the user api service, which is used to communicate with the backend server.
All the api calls should be defined here.
*/

import axios from "../utils/axios.js";

const getUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    try {
        // return a fake user info response
        return {
            code: 0,
            data: [
                {
                    id: 1,
                    email: 'test@gmail.com',
                    firstname: 'test',
                    lastname: 'test',
                }
            ]
        }
    } catch (error) {
        console.error('Error during requesting user info: ', error);
        throw error;
    }
}

const userLogin = async (email, password) => {
    return {
        code: 0,
        msg: 'success',
    }
}


export default {
    getUserProfile,
    userLogin,
}
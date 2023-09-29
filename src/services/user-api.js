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


const userRegister = async (userData) => {
    try {
        return await axios.post('/user/sign_up', userData,);
    } catch (error) {
        throw error;
    }
}

const userLogin = async (signInData) => {
    try {
        return await axios.post("/user/sign_in", signInData);
    } catch (error) {
        throw error;
    }
}

const requestChangePassword = async (email) => {
    try {
        return await axios.get(`/user/request_change_password?email=${email}`);
    } catch (error) {
        throw error;
    }
}

const changePassword = async (uid, token, newPassword) => {
    if (!uid) {
        throw new Error('No User id');
    }
    if (!token) {
        throw new Error('No Change Password token');
    }
    if (!newPassword) {
        throw new Error('No New Password Submitted');
    }
    try {
        return await axios.post(`/user/change_password`, {
            uid: uid,
            new_password: newPassword
        }, {
            headers: {
                authorization: token
            }
        });
    } catch (error) {
        throw error;
    }
}

const userLoginVerify = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token) {
        throw new Error('No User token');
    }
    if (!userId) {
        throw new Error('No User id');
    }
    try {
        return await axios.get(`/user/verify_token/access?uid=${userId}`, {
            headers: {
                authorization: token
            }
        })
    } catch (error) {
        console.error('Error during user login verification: ', error);
        throw error;
    }
}

const checkUserEmailExist = async (email) => {
    if (!email) {
        throw new Error('No User email');
    }
    try {
        return await axios.get(`/user/check_email_exist?email=${email}`)
    } catch (error) {
        console.error('Error during user email verification: ', error);
        throw error;
    }
}
const checkUserNameExist = async (userName) => {
    if (!userName) {
        throw new Error('No User Name');
    }
    try {
        return await axios.get(`/user/check_user_name_exist?user_name=${userName}`)
    } catch (error) {
        console.error('Error during user name verification: ', error);
        throw error;
    }
}

const signOut = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token) {
        throw new Error('No User token');
    }
    if (!userId) {
        throw new Error('No User id');
    }
    try {
        return await axios.post(`/user/sign_out?uid=${userId}`, {}, {
            headers: {
                authorization: token
            }
        })
    } catch (error) {
        console.error('Error during user sign out: ', error);
        throw error;
    }
}

const verifyResetPasswordToken = async (token, userId) => {
    if (!token) {
        throw new Error('No User token');
    }
    if (!userId) {
        throw new Error('No User id');
    }
    try {
        return await axios.get(`/user/verify_token/change_password?uid=${userId}`, {
            headers: {
                authorization: token
            }
        })
    } catch (error) {
        console.error('Error during user sign out: ', error);
        throw error;
    }
}

export default {
    getUserProfile,
    userLogin,
    userRegister,
    requestChangePassword,
    changePassword,
    userLoginVerify,
    checkUserEmailExist,
    checkUserNameExist,
    signOut,
    verifyResetPasswordToken
}
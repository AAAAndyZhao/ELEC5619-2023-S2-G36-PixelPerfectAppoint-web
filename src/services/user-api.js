/*
This is the user api service, which is used to communicate with the backend server.
All the api calls should be defined here.
*/

import axios from "../utils/axios.js";

const axiosInstance = axios.create({
    baseURL: 'http://152.67.96.80:9090', // 设置基本的API URL
  });

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
      const response = await axiosInstance.post('/user/sign_up', userData,);
      return response.data; // 返回响应数据
    } catch (error) {
      throw error; // 抛出错误，由调用方处理
    }
  }

const userLogin = async (signInData) => {
    try{
        const response = await axiosInstance.post("/user/sign_in",signInData);
        return response.data;
    }catch(error){
        throw error;
    }
}

const requestChangePassword = async (email) => {
    try {
        const response = await axiosInstance.get(`user/request_change_password?email=${email}`);
        return response.data; // 返回响应数据
    } catch (error) {
      throw error; // 抛出错误，由调用方处理
    }
  }

  const changePassword = async (email) => {
    try {
        const response = await axiosInstance.get(`user/request_change_password?email=${email}`);
        return response.data; // 返回响应数据
    } catch (error) {
      throw error; // 抛出错误，由调用方处理
    }
  }

export default {
    getUserProfile,
    userLogin,
    userRegister,
    requestChangePassword,
    changePassword
    
}
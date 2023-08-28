/*
By vuex
This is the user module, which is used to manage the user state.
*/
import userApi from '@/services/user-api';
export default {
    namespaced: true,
    state: {
        userInfo: {},
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        }
    },
    actions: {
        async setUserInfo({ commit }) {
            try{
                const res = await userApi.getUserProfile();
                if (res && res.code === 0){
                    commit('setUserInfo', res.data[0]);
                }else{
                    commit('setUserInfo', {});
                }
            }catch(error){
                if (error.message === 'User is not logged in') {
                    commit('setUserInfo', {});
                    return;
                }
                throw error;
            }
        }
    },
    getters: {
        getUserInfo: state => state.userInfo,
    }
};
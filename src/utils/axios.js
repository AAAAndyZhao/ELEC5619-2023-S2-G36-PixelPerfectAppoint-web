import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000"; // dev
// errorHandle
const errorHandle = (status, other) => {
    switch (status) {
        case 400:
            console.log("Bad Request");
            break;
        case 401:
            console.log("Unauthorized");
            break;
        case 403:
            console.log("Forbidden");
            break;
        case 404:
            console.log("Not Found");
            break;
        case 500:
            console.log("Internal Server Error");
            break;
        case 503:
            console.log("Service Unavailable");
            break;
        default:
            console.log(other);
    }
};

axios.interceptors.request.use((request) => {
    // loading
    console.log("loading");
    return request;
}, (error) => {
    return Promise.reject(error);
});


axios.interceptors.response.use((response) => {
    return response.status === 200 ? response.data : Promise.reject(response);
}, (error) => {
    const { response } = error;
    if (response) {
        errorHandle(response.status, response.data.message);
        return Promise.reject(response);
    } else {
        console.log("Network Error");
    }
});

export default axios;
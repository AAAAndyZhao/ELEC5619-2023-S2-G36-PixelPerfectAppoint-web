import axios from "axios";
axios.defaults.baseURL = "https://server.pixelperfectappoint.cc/api"; // dev
// axios.defaults.baseURL = "http://localhost:8080/api"; // dev

// CORS
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
axios.defaults.headers.common["Access-Control-Allow-Headers"] = "Origin, Accept, Content-Type, Authorization";

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
    console.log("loading " + request.url);
    return request;
}, (error) => {
    return Promise.reject(error);
});


axios.interceptors.response.use((response) => {
    // if response is blob type, return response directly
    if (response.data instanceof Blob) {
        return response.status === 200 ? response : Promise.reject(response);
    }
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
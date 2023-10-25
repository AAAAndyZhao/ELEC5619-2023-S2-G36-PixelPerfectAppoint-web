/*
This is the photo api service, which is used to communicate with the backend server.
*/
import axios from "../utils/axios.js";
const hasCamParam = (field) => {
    return field != null && field != undefined && field != ""
}
const uploadPhoto = async (photo) => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
        throw new Error("No userId, please login first.")
    }
    const body = {
        uid: userId,
        image_id: photo.imageId,
        name: photo.name,
        description: photo.description,
        category_code: photo.categoryCode,
        hidden: !photo.public,
    }
    if (hasCamParam(photo.camMaker)
        || hasCamParam(photo.camModel)
        || hasCamParam(photo.exposureTime)
        || hasCamParam(photo.fNumber)
        || hasCamParam(photo.iso)
        || hasCamParam(photo.focalLength)
        || hasCamParam(photo.lens)) {
        body.param = {};
        if (hasCamParam(photo.camMaker)) {
            body.param.camMaker = photo.camMaker;
        }
        if (hasCamParam(photo.camModel)) {
            body.param.camModel = photo.camModel;
        }
        if (hasCamParam(photo.exposureTime)) {
            body.param.exposure_time = photo.exposureTime;
        }
        if (hasCamParam(photo.fNumber)) {
            body.param.f_number = photo.fNumber;
        }
        if (hasCamParam(photo.iso)) {
            body.param.iso = photo.iso;
        }
        if (hasCamParam(photo.focalLength)) {
            body.param.focal_length = photo.focalLength;
        }
        if (hasCamParam(photo.lens)) {
            body.param.lens = photo.lens;
        }
    }
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("No token, please login first.")
    }
    return axios.post("/photo/add", body, {
        headers: {
            "authorization": localStorage.getItem("token")
        }
    })
}

const uploadPhotoList = (photoList) => {
    return new Promise((resolve, reject) => {
        if (!photoList || photoList.length == 0) {
            reject("photo-api.js: uploadPhotoList: photoList is empty.")
        }
        axios.all(photoList.map(photo => uploadPhoto(photo)))
            .then(axios.spread((...responses) => {
                console.log("photo-api.js: uploadPhotoList: responses: ", responses)
                resolve(responses)
            }))
            .catch(errors => {
                console.log("photo-api.js: uploadPhotoList: errors: ", errors)
                reject(errors)
            })
    })
}

const searchPhotos = async (
    searchText, page = 1, size = 30,
    categoryCode, sortedBy, order,
    photoParamProps
) => {
    try {
        const body = {
            search_text: searchText,
            page: page,
            size: size,
            category_code: categoryCode,
            sorted_by: sortedBy,
            order: order
        }
        if (photoParamProps?.camMaker){
            body.cam_maker = photoParamProps.camMaker
        }
        if (photoParamProps?.camModel){
            body.cam_model = photoParamProps.camModel
        }
        if (photoParamProps?.lens){
            body.lens = photoParamProps.lens
        }

        return axios.post("/photo/search", body);
    } catch (error) {
        console.error("Error during searching photos: ", error.message)
        throw error
    }
}

const getPhotoByOwnerId = async () => {
    if(!localStorage.getItem("userId")){
        throw new Error("No userId, please login first.")
    }
    try {
        let userId = localStorage.getItem("userId")
        let token = localStorage.getItem("token")
        const body = {
            owner_id: userId
        }
        return axios.post("/photo/search", body, {
            headers: {
                "authorization": token
            }
        })
    } catch (error) {
        console.error("Error during getting photos by owner id: ", error.message)
        throw error
    }
}

const getPublicPhotoByOwnerId = async ({
    ownerId,
    page = 1,
    size = 30,
    sortedBy,
    order
}) => {
    try {
        const body = {
            owner_id: ownerId,
            page: page,
            size: size,
            sorted_by: sortedBy,
            order: order
        }
        return axios.post("/photo/search", body);
    } catch (error) {
        console.error("Error during getting photos by owner id: ", error.message)
        throw error
    }
}

export default {
    uploadPhoto,
    uploadPhotoList,
    searchPhotos,
    getPhotoByOwnerId,
    getPublicPhotoByOwnerId
}
import dayjs from "dayjs";
import axios from "@/utils/axios";

const createAppointment = async (appointment) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    // check appointment data
    if (appointment.title === null
        || appointment.title === undefined
        || appointment.title === '') {
        throw new Error('Appointment title is empty');
    }
    if (appointment.description === null
        || appointment.description === undefined
        || appointment.description === '') {
        throw new Error('Appointment description is empty');
    }
    if (appointment.appointmentDate === null
        || appointment.appointmentDate === undefined
        || appointment.appointmentDate === '') {
        throw new Error('Appointment date is empty');
    }
    if (appointment.appointmentTime === null
        || appointment.appointmentTime === undefined
        || appointment.appointmentTime === '') {
        throw new Error('Appointment time is empty');
    }
    if (appointment.estimatedDuration === null
        || appointment.estimatedDuration === undefined
        || appointment.estimatedDuration === '') {
        throw new Error('Appointment estimated duration is wrong');
    }
    if (appointment.location.streetName === null
        || appointment.location.streetName === undefined
        || appointment.location.streetName === '') {
        throw new Error('Appointment streetName is wrong');
    }
    if (appointment.location.city === null
        || appointment.location.city === undefined
        || appointment.location.city === '') {
        throw new Error('Appointment city is wrong');
    }
    if (appointment.location.state === null
        || appointment.location.state === undefined
        || appointment.location.state === '') {
        throw new Error('Appointment state is wrong');
    }
    if (appointment.location.stateCode === null
        || appointment.location.stateCode === undefined
        || appointment.location.stateCode === '') {
        throw new Error('Appointment stateCode is wrong');
    }
    if (appointment.location.country === null
        || appointment.location.country === undefined
        || appointment.location.country === '') {
        throw new Error('Appointment country is wrong');
    }
    if (appointment.location.countryCode === null
        || appointment.location.countryCode === undefined
        || appointment.location.countryCode === '') {
        throw new Error('Appointment countryCode is wrong');
    }
    if (appointment.location.zipCode === null
        || appointment.location.zipCode === undefined
        || appointment.location.zipCode === '') {
        throw new Error('Appointment zipCode is wrong');
    }
    if (appointment.location.latitude === null
        || appointment.location.latitude === undefined
        || appointment.location.latitude === '') {
        throw new Error('Appointment latitude is wrong');
    }
    if (appointment.location.longitude === null
        || appointment.location.longitude === undefined
        || appointment.location.longitude === '') {
        throw new Error('Appointment longitude is wrong');
    }
    if (appointment.location.googleMapPlaceId === null
        || appointment.location.googleMapPlaceId === undefined
        || appointment.location.googleMapPlaceId === '') {
        throw new Error('Appointment googleMapPlaceId is empty');
    }
    const requestBody = {
        uid: userId,
        title: appointment.title,
        description: appointment.description,
        appoint_datetime: `${dayjs(appointment.appointmentDate).format('YYYY-MM-DD')} ${dayjs(appointment.appointmentTime).format('HH:mm:ss')}`,
        estimate_duration: appointment.estimatedDuration,
        is_end_time_tomorrow: appointment.isEndTimeTomorrow,
        location: {
            apartment_no: appointment.location.apartmentNo,
            street_no: appointment.location.streetNo,
            street_name: appointment.location.streetName,
            city: appointment.location.city,
            state: appointment.location.state,
            state_code: appointment.location.stateCode,
            country: appointment.location.country,
            country_code: appointment.location.countryCode,
            zip_code: appointment.location.zipCode,
            latitude: appointment.location.latitude,
            longitude: appointment.location.longitude,
            google_map_place_id: appointment.location.googleMapPlaceId
        },
        participants: appointment.participants
    }
    try {
        return await axios.post('/appointment/add', requestBody, {
            headers: {
                authorization: token
            }
        });
    } catch (error) {
        console.error('Error during requesting create appointment: ', error.message);
        throw error;
    }
}

const getAppointmentByUser = async (filterProps) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    try {
        return await axios.post(`/appointment/get_of_user`, {
            uid: userId,
            search_text: filterProps.searchText,
            page: filterProps.page,
            size: filterProps.size,
            sorted_by: filterProps.sortedBy,
            order: filterProps.order,
            start: filterProps.start,
            end: filterProps.end,
            not_completed_first: filterProps.notCompletedFirst
        }, {
            headers: {
                authorization: token
            }
        });
    } catch (error) {
        console.error('Error during requesting get appointment by user: ', error.message);
        throw error;
    }
}

const changeAppointmentStatusByCreator = async (appointmentId, status) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    try {
        return await axios.post(`/appointment/change_status`, {
            uid: userId,
            appointment_id: appointmentId,
            status: status
        }, {
            headers: {
                authorization: token
            }
        });
    } catch (error) {
        console.error('Error during requesting change appointment status by creator: ', error.message);
        throw error;
    }
}

const quitAppointment = async (appointmentId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId === null
        || userId === undefined
        || userId === '') {
        throw new Error('User id is invalid');
    }
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    try {
        return await axios.post(`/appointment/quit`, {
            uid: userId,
            appointment_id: appointmentId
        }, {
            headers: {
                authorization: token
            }
        });
    } catch (error) {
        console.error('Error during requesting quit appointment: ', error.message);
        throw error;
    }
}

const getAppointmentById = async (appointmentId) => {
    if (appointmentId === null
        || appointmentId === undefined
        || appointmentId === '') {
        throw new Error('Appointment id is invalid');
    }
    const token = localStorage.getItem('token');
    if (token === null
        || token === undefined
        || token === '') {
        throw new Error('User token is invalid');
    }
    try{
        return await axios.get(`/appointment/get/${appointmentId}`, {
            headers: {
                authorization: token
            }
        });
    }catch (error) {
        console.error('Error during requesting get appointment by id: ', error.message);
        throw error;
    }
}

const updateAppointmentFunctionMap = {
    title: async (appointmentId, value) => {
        if (!appointmentId || typeof appointmentId !== 'string') {
            throw new Error('Appointment id is invalid');
        }
        const token = localStorage.getItem('token');
        if (token === null
            || token === undefined
            || token === '') {
            throw new Error('User token is invalid');
        }
        try {
            return await axios.post(`/appointment/update/title/${appointmentId}`, {
                title: value
            }, {
                headers: {
                    authorization: token
                }
            });
        } catch (error) {
            console.error('Error during requesting update appointment title: ', error.message);
            throw error;
        }
    },
    description: async (appointmentId, value) => {
        if (!appointmentId || typeof appointmentId !== 'string') {
            throw new Error('Appointment id is invalid');
        }
        const token = localStorage.getItem('token');
        if (token === null
            || token === undefined
            || token === '') {
            throw new Error('User token is invalid');
        }
        try {
            return await axios.post(`/appointment/update/desc/${appointmentId}`, {
                description: value
            }, {
                headers: {
                    authorization: token
                }
            });
        } catch (error) {
            console.error('Error during requesting update appointment title: ', error.message);
            throw error;
        }
    },
    time: async (appointmentId, appointDatetime, estimatedDuration) => {
        if (!appointmentId || typeof appointmentId !== 'string') {
            throw new Error('Appointment id is invalid');
        }
        const token = localStorage.getItem('token');
        if (token === null
            || token === undefined
            || token === '') {
            throw new Error('User token is invalid');
        }
        try {
            return await axios.post(`/appointment/update/time/${appointmentId}`, {
                appoint_datetime: appointDatetime,
                estimate_duration: estimatedDuration
            }, {
                headers: {
                    authorization: token
                }
            });
        } catch (error) {
            console.error('Error during requesting update appointment title: ', error.message);
            throw error;
        }
    },
    location: async (appointmentId, location) => {
        if (!appointmentId || typeof appointmentId !== 'string') {
            throw new Error('Appointment id is invalid');
        }
        const token = localStorage.getItem('token');
        if (token === null
            || token === undefined
            || token === '') {
            throw new Error('User token is invalid');
        }
        if (location.streetName === null
            || location.streetName === undefined
            || location.streetName === '') {
            throw new Error('Appointment streetName is wrong');
        }
        if (location.city === null
            || location.city === undefined
            || location.city === '') {
            throw new Error('Appointment city is wrong');
        }
        if (location.state === null
            || location.state === undefined
            || location.state === '') {
            throw new Error('Appointment state is wrong');
        }
        if (location.stateCode === null
            || location.stateCode === undefined
            || location.stateCode === '') {
            throw new Error('Appointment stateCode is wrong');
        }
        if (location.country === null
            || location.country === undefined
            || location.country === '') {
            throw new Error('Appointment country is wrong');
        }
        if (location.countryCode === null
            || location.countryCode === undefined
            || location.countryCode === '') {
            throw new Error('Appointment countryCode is wrong');
        }
        if (location.zipCode === null
            || location.zipCode === undefined
            || location.zipCode === '') {
            throw new Error('Appointment zipCode is wrong');
        }
        if (location.latitude === null
            || location.latitude === undefined
            || location.latitude === '') {
            throw new Error('Appointment latitude is wrong');
        }
        if (location.longitude === null
            || location.longitude === undefined
            || location.longitude === '') {
            throw new Error('Appointment longitude is wrong');
        }
        if (location.googleMapPlaceId === null
            || location.googleMapPlaceId === undefined
            || location.googleMapPlaceId === '') {
            throw new Error('Appointment googleMapPlaceId is empty');
        }
        try {
            return await axios.post(`/appointment/update/location/${appointmentId}`, {
                apartment_no: location.apartmentNo,
                street_no: location.streetNo,
                street_name: location.streetName,
                city: location.city,
                state: location.state,
                state_code: location.stateCode,
                country: location.country,
                country_code: location.countryCode,
                zip_code: location.zipCode,
                latitude: location.latitude,
                longitude: location.longitude,
                google_map_place_id: location.googleMapPlaceId
            }, {
                headers: {
                    authorization: token
                }
            });
        } catch (error) {
            console.error('Error during requesting update appointment title: ', error.message);
            throw error;
        }
        
    },
    participant: {
        role: async (appointmentId, participantId, role) => {
            const token = localStorage.getItem('token');
            if (token === null
                || token === undefined
                || token === '') {
                throw new Error('User token is invalid');
            }
            try{
                return await axios.post(`/appointment/change_role`, {
                    uid: participantId,
                    appointment_id: appointmentId,
                    role: role
                }, {
                    headers: {
                        authorization: token
                    }
                });
            }catch(error) {
                console.error('Error during requesting update appointment title: ', error.message);
                throw error;
            }
        }
    },
    all: async (appointment) => {

    },
}


const removeParticipant = async (appointmentId, participantId) => {
    try{
        const token = localStorage.getItem('token');
        if (token === null
            || token === undefined
            || token === '') {
            throw new Error('User token is invalid');
        }
        return await axios.post(`/appointment/remove_participant`, {
            participant_id: participantId,
            appointment_id: appointmentId
        }, {
            headers: {
                authorization: token
            }
        });
    }catch(error) {
        console.error('Error during requesting remove participant: ', error.message);
        throw error;
    }
}

const inviteParticipant = async (appointmentId, participantId) => {
    try{
        const token = localStorage.getItem('token');
        if (token === null
            || token === undefined
            || token === '') {
            throw new Error('User token is invalid');
        }
        return await axios.post(`/appointment/invite_participant`, {
            participant_id: participantId,
            appointment_id: appointmentId
        }, {
            headers: {
                authorization: token
            }
        });
    }catch(error) {
        console.error('Error during requesting invite participant: ', error.message);
        throw error;
    }
}

export default {
    createAppointment,
    getAppointmentByUser,
    changeAppointmentStatusByCreator,
    quitAppointment,
    getAppointmentById,
    removeParticipant,
    inviteParticipant,
    updateAppointmentFunctionMap,

}
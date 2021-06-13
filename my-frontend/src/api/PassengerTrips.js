import {
    ERROR_MSG_API_DELETE_DRIVER,
    ERROR_MSG_API_GET_ACTIVE_TRANSPORTS,
    ERROR_MSG_API_GET_TRANSPORTS,
    ERROR_MSG_API_POST_TRANSPORT,
    ERROR_MSG_API_PUT_TRANSPORT,
    ERROR_MSG_API_PUT_TRANSPORT_VALIDATE_ROUTE_DEPENDENCE,
    ERROR_MSG_INTERNET
} from "../const/messages";

import {BACKEND_URL} from "../const/config";
import axios from 'axios';

export const getPassengerTrips = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/my-trips/custom/user/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const response = await instance.get();
        return response;
    } catch (error) {
        if (error.response?.status) {
            return error.response;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`${ERROR_MSG_API_GET_TRANSPORTS} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};
import {
    ERROR_MSG_API_CANCEL_PASSENGER_TRIP,
    ERROR_MSG_API_GET_TRIPS,
    ERROR_MSG_INTERNET
} from '../const/messages';

import {BACKEND_URL} from "../const/config";
import axios from 'axios';

export const getPassengerTrips = async (id, token) => {
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

            console.log(`${ERROR_MSG_API_GET_TRIPS} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const cancelPassengerTrip = async (id) => {
    const token = localStorage.getItem('token');
    console.log(token)
    try {
        let response = await axios.put(`${BACKEND_URL}/my-trips/custom/trip/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response;
    } catch (error) {
        if (error.response?.status) {
            return error.response;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`${ERROR_MSG_API_CANCEL_PASSENGER_TRIP} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}
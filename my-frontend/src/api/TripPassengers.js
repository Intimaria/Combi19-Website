import axios from 'axios';
import {BACKEND_URL} from "../const/config";

import {
    ERROR_MSG_API_GET_TRIP_PASSENGERS, ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET,
    ERROR_MSG_INTERNET
} from "../const/messages";


export const getPassengersByTrip = async (tripId) => {
    const token = localStorage.getItem('token');

    try {
        let response = await axios.get(`${BACKEND_URL}/tripPassengers/getPassengersByTrip/${tripId}`,
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

            console.log(`${ERROR_MSG_API_GET_TRIP_PASSENGERS} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const absentPassengersByTrip = async (tripId) => {
    const token = localStorage.getItem('token');

    try {
        let response = await axios.put(`${BACKEND_URL}/tripPassengers/absentPassengersByTrip/${tripId}`,
            {},
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

            console.log(`${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

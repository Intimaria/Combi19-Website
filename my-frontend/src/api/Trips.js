import axios from 'axios';
import {BACKEND_URL} from "../const/config";

import {
    ERROR_MSG_API_DELETE_DRIVER,
    ERROR_MSG_API_GET_TRIPS,
    ERROR_MSG_API_POST_TRIP,
    ERROR_MSG_API_PUT_TRIP,
    ERROR_MSG_API_VALIDATE_TRIP_TICKET_DEPENDENCE,
    ERROR_MSG_INTERNET
} from "../const/messages";



export const getTrips = async () => {
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/trips`,
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

export const getTripDependenceById = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.get(`${BACKEND_URL}/trips/custom/tripDependenceById/${id}`,
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

            console.log(`${ERROR_MSG_API_VALIDATE_TRIP_TICKET_DEPENDENCE} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const postTrip = async (newTrip) => {
    const token = localStorage.getItem('token');

    let formattedTrip = {
        routeId: newTrip.routeId,
        price: newTrip.price.replace(',', '.'),
        departureDay: newTrip.departureDay
    };

    try {
        let response = await axios.post(`${BACKEND_URL}/trips`,
            formattedTrip,
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

            console.log(`${ERROR_MSG_API_POST_TRIP} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const putTrip = async (trip) => {
    const token = localStorage.getItem('token');

    let formattedTrip = {
        tripId: trip.tripId,
        routeId: trip.routeId,
        price: trip.price.replace(',', '.'),
        departureDay: trip.departureDay
    };

    try {
        let response = await axios.put(`${BACKEND_URL}/trips/${formattedTrip.tripId}`,
            formattedTrip,
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

            console.log(`${ERROR_MSG_API_PUT_TRIP} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const deleteTrip = async (id) => {

    const token = localStorage.getItem('token');
    try {
        let response = await axios.delete(`${BACKEND_URL}/trips/${id}`,
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

            console.log(`${ERROR_MSG_API_DELETE_DRIVER} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

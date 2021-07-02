import axios from 'axios';
import {BACKEND_URL} from "../const/config";

import {
    ERROR_MSG_INTERNET
} from "../const/messages";


export const getRiskyPassengers = async () => {
    const token = localStorage.getItem('token');

    try {
        let response = await axios.get(`${BACKEND_URL}/reports/getRiskyPassengers`,
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

            console.log(`${"Ocurrió un error al obtener los pasajeros de riesgo "} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};
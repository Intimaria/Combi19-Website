import axios from 'axios';
import {BACKEND_URL} from "../const/config";
import {
    ERROR_MSG_API_GET_DRIVERS,
    ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE,
    ERROR_MSG_INTERNET
} from "../const/messages";

export const getDrivers = async () => {
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/drivers`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const response = await instance.get();
        return response.data;
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_DRIVERS} ${error}`);
        return null;
    }
}

export const getAvailableDrivers = async () => {
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/drivers/custom/available`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const response = await instance.get();
        return response;
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE} ${error}`);

        console.log('error.constructor.name', error.constructor.name);
        console.log('error.message', error.message);
        console.log('error.name', error.name);


        if (error.message === 'Network Error') {
            error.message = ERROR_MSG_INTERNET
            return error.message;
        } else {
            return error.message;
        }


    }
}



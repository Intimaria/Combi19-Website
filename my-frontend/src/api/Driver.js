import axios from 'axios';
import {BACKEND_URL} from "../const/config";
import {
    ERROR_MSG_API_GET_DRIVERS,
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
    }
    return
}



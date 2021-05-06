import axios from 'axios';
import {BACKEND_URL} from "../const/config";
import {
    ERROR_MSG_API_GET_TRANSPORTS
} from "../const/messages";


export const getTransports = async () => {
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/transports`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const response = await instance.get();
        return response.data;
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRANSPORTS} ${error}`);
    }
    return
}

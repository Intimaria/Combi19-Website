import axios from 'axios';
import {BACKEND_URL} from "../const/config";

export const getTransports = async () => {
    console.log('entró')
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/transport`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const response = await instance.get();
        return response.data;
    } catch (e) {
        console.log('Ocurrió un error al obtener las combis:', e)
    }
    return
}

import axios from 'axios';
import {BACKEND_URL} from "../const/config";
import {
    ERROR_MSG_API_GET_TRANSPORTS,
    ERROR_MSG_API_POST_TRANSPORT
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

export const postTransport = async (selectedTransport, typeComfortSelected, driverSelected) => {
    const token = localStorage.getItem('token');

    const newTransport = {
        internal_identification: selectedTransport.internal_identification,
        model: selectedTransport.model,
        registration_number: selectedTransport.registration_number,
        seating: selectedTransport.seating,
        id_type_comfort: typeComfortSelected,
        id_driver: driverSelected
    }

    try {
        let response = await axios.post(`${BACKEND_URL}/transports`,
            newTransport,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        console.log('response en try es:', response)
        return response;
    } catch (error) {
        if (error.response.status) {
            return error.response;
        } else {
            console.log(`${ERROR_MSG_API_POST_TRANSPORT} ${error}`);
        }
    }
}

import axios from 'axios';
import {BACKEND_URL} from "../const/config";
import {capitalizeString} from "../helpers/strings";
import {
    ERROR_MSG_API_DELETE_DRIVER,
    ERROR_MSG_API_GET_TRANSPORTS,
    ERROR_MSG_API_POST_TRANSPORT,
    ERROR_MSG_API_PUT_TRANSPORT,
    ERROR_MSG_INTERNET
} from "../const/messages";



export const getTransports = async () => {
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/transports`,
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

export const postTransport = async (selectedTransport, typeComfortSelected, driverSelected) => {
    const token = localStorage.getItem('token');

    const newTransport = {
        internal_identification: selectedTransport.internal_identification.toUpperCase(),
        registration_number: selectedTransport.registration_number.toUpperCase(),
        model: capitalizeString(selectedTransport.model),
        seating: selectedTransport.seating,
        id_type_comfort: typeComfortSelected,
        id_driver: driverSelected
    };

    try {
        let response = await axios.post(`${BACKEND_URL}/transports`,
            newTransport,
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

            console.log(`${ERROR_MSG_API_POST_TRANSPORT} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const putTransport = async (selectedTransport, typeComfortSelected, driverSelected) => {
    const token = localStorage.getItem('token');

    const newTransport = {
        internal_identification: selectedTransport.internal_identification.toUpperCase(),
        registration_number: selectedTransport.registration_number.toUpperCase(),
        model: selectedTransport.model,
        seating: selectedTransport.seating,
        id_type_comfort: typeComfortSelected,
        id_driver: driverSelected
    };

    try {
        let response = await axios.put(`${BACKEND_URL}/transports/${selectedTransport.transport_id}`,
            newTransport,
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

            console.log(`${ERROR_MSG_API_PUT_TRANSPORT} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const deleteTransport = async (id) => {
    console.log(id);
    const token = localStorage.getItem('token');
    try {
        let response = await axios.delete(`${BACKEND_URL}/transports/${id}`,
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

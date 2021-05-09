import axios from 'axios';
import { BACKEND_URL } from "../const/config";
import {
    ERROR_MSG_API_GET_DRIVERS,
    ERROR_MSG_API_POST_DRIVER,
    ERROR_MSG_API_PUT_DRIVER,
    ERROR_MSG_API_DELETE_DRIVER,
    ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE,
    ERROR_MSG_INTERNET
} from "../const/messages";

export const getDrivers = async () => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.get(`${BACKEND_URL}/drivers`,
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

            console.log(`${ERROR_MSG_API_GET_DRIVERS} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const postDrivers = async (driverData) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.post(`${BACKEND_URL}/drivers`,
        driverData,
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

            console.log(`${ERROR_MSG_API_POST_DRIVER} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const putDrivers = async (driverData, id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.put(`${BACKEND_URL}/drivers/${id}`,
        driverData,
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

            console.log(`${ERROR_MSG_API_PUT_DRIVER} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const deleteDrivers = async (id) => {
    console.log(id);
    const token = localStorage.getItem('token');
    try {
        let response = await axios.delete(`${BACKEND_URL}/drivers/${id}`,
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

        if (error.message === 'Network Error') {
            error.message = ERROR_MSG_INTERNET
            return error.message;
        } else {
            return error.message;
        }


    }
}



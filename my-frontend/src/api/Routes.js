import axios from 'axios';
import { BACKEND_URL } from "../const/config";
import {
    ERROR_MSG_API_GET_ROUTES,
    ERROR_MSG_API_POST_ROUTES,
    ERROR_MSG_API_PUT_ROUTES,
    ERROR_MSG_API_DELETE_ROUTES,
    ERROR_MSG_INTERNET,
    ERROR_MSG_API_ROUTE_VALIDATE_TRIP_DEPENDENCE,
    ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE
} from "../const/messages";

export const getRoutes = async () => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.get(`${BACKEND_URL}/routes`,
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

            console.log(`${ERROR_MSG_API_GET_ROUTES} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const postRoutes = async (routesData, idPlaceDeparture, idPlaceDestination, idTransport) => {
    const token = localStorage.getItem('token');
    const newRoute = {
        idPlaceDeparture,
        idPlaceDestination,
        idTransport,
        duration : routesData.duration,
        km: routesData.km
    }
    try {
        let response = await axios.post(`${BACKEND_URL}/routes`,
        newRoute,
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

            console.log(`${ERROR_MSG_API_POST_ROUTES} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const putRoutes = async (routesData, idPlaceDeparture, idPlaceDestination, idTransport,id) => {
    const token = localStorage.getItem('token');
    const modifyRoute = {
        idPlaceDeparture,
        idPlaceDestination,
        idTransport,
        duration : routesData.duration,
        km: routesData.km
    };
    try {
        let response = await axios.put(`${BACKEND_URL}/routes/${id}`,
        modifyRoute,
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

            console.log(`${ERROR_MSG_API_PUT_ROUTES} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};
// Falta implementar en el backend
export const deleteRoutes = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.delete(`${BACKEND_URL}/routes/${id}`,
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

            console.log(`${ERROR_MSG_API_DELETE_ROUTES} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const getRouteDependenceById = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.get(`${BACKEND_URL}/routes/custom/routeDependenceById/${id}`,
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

            console.log(`${ERROR_MSG_API_ROUTE_VALIDATE_TRIP_DEPENDENCE} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const getAvailableRoutes = async () => {
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/routes/custom/available`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const response = await instance.get();
        return response;
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE} ${error}`);

        if (error.message === 'Network Error') {
            error.message = ERROR_MSG_INTERNET;
            return error.message;
        } else {
            return error.message;
        }
    }
};

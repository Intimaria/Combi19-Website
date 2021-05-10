import {
  ERROR_MSG_API_DELETE_ROUTE,
  ERROR_MSG_API_GET_ROUTES,
  ERROR_MSG_API_POST_ROUTE,
  ERROR_MSG_API_PUT_ROUTE,
  ERROR_MSG_INTERNET,
  OK_MSG_API_ROUTE_POST
} from "../const/messages";

import { BACKEND_URL } from "../const/config";
import axios from 'axios';

export const getRouteById= async (id) => {
}

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
}

export const postRoutes = async (routeData) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.post(`${BACKEND_URL}/routes`,
        routeData,
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

            console.log(`${ERROR_MSG_API_POST_ROUTE} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const putRoutes = async (routeData, id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.put(`${BACKEND_URL}/routes/${id}`,
        routeData,
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

            console.log(`${ERROR_MSG_API_PUT_ROUTE} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const deleteRoutes = async (id) => {
    console.log(id);
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

            console.log(`${ERROR_MSG_API_DELETE_ROUTE} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}


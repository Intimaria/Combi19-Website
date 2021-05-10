<<<<<<< HEAD
import axios from 'axios';
import { BACKEND_URL } from "../const/config";
import {
    ERROR_MSG_API_GET_ROUTES,
    ERROR_MSG_API_POST_ROUTES,
    ERROR_MSG_API_PUT_ROUTES,
    ERROR_MSG_API_DELETE_ROUTES,
    ERROR_MSG_INTERNET
} from "../const/messages";
//Falta implementar en el backend
=======
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

>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
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

<<<<<<< HEAD
export const postRoutes = async (routesData, idPlaceDeparture, idPlaceDestination, idTransport) => {
    const token = localStorage.getItem('token');
    const newRoute = {
        idPlaceDeparture,
        idPlaceDestination,
        idTransport,
        duration : routesData.duration,
        km: routesData.kmDistance
    }
    try {
        let response = await axios.post(`${BACKEND_URL}/routes`,
        newRoute,
=======
export const postRoutes = async (routeData) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.post(`${BACKEND_URL}/routes`,
        routeData,
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
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

<<<<<<< HEAD
            console.log(`${ERROR_MSG_API_POST_ROUTES} ${error}`);
=======
            console.log(`${ERROR_MSG_API_POST_ROUTE} ${error}`);
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

<<<<<<< HEAD
export const putRoutes = async (routesData, idPlaceDeparture, idPlaceDestination, idTransport,id) => {
    const token = localStorage.getItem('token');
    const newRoute = {
        idPlaceDeparture,
        idPlaceDestination,
        idTransport,
        duration : routesData.duration,
        km: routesData.kmDistance
    }
    try {
        let response = await axios.put(`${BACKEND_URL}/routes/${id}`,
        newRoute,
=======
export const putRoutes = async (routeData, id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.put(`${BACKEND_URL}/routes/${id}`,
        routeData,
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
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

<<<<<<< HEAD
            console.log(`${ERROR_MSG_API_PUT_ROUTES} ${error}`);
=======
            console.log(`${ERROR_MSG_API_PUT_ROUTE} ${error}`);
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}
<<<<<<< HEAD
// Falta implementar en el backend
=======

>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
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

<<<<<<< HEAD
            console.log(`${ERROR_MSG_API_DELETE_ROUTES} ${error}`);
=======
            console.log(`${ERROR_MSG_API_DELETE_ROUTE} ${error}`);
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
<<<<<<< HEAD
}
=======
}

>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25

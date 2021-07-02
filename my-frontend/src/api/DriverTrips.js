import {
  ERROR_MSG_API_GET_TRIPS,
  ERROR_MSG_API_FINISH_TRIP,
  ERROR_MSG_INTERNET
} from '../const/messages';

import {BACKEND_URL} from "../const/config";
import axios from 'axios';


export const getPassangerStatus = async (id, url) => {
    console.log("checking passanger status")
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/${url}/custom/passenger/${id}`,
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
  
            console.log(`Ocurrió un error en obtener el estado de los pasajeros: ${error}`);
  
            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
  };


 export const getDriverTrips = async (id, url, status) => {
  const token = localStorage.getItem('token');
  try {

      const instance = axios.create({
          baseURL: `${BACKEND_URL}/${url}/custom/user/${id}/${status}`,
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

          console.log(`${ERROR_MSG_API_GET_TRIPS} ${error}`);

          if (error.message === 'Network Error') {
              error.message = ERROR_MSG_INTERNET;
              return error.message;
          } else {
              return error.message;
          }
      }
  }
};

export const finishTrip = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.put(`${BACKEND_URL}/pendingTrips/custom/trip/${id}`,
        {},
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

            console.log(`${ERROR_MSG_API_FINISH_TRIP} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const cancelTrip = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.put(`${BACKEND_URL}/pendingTrips/custom/canceltrip/${id}`,
        {},
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

            console.log(`${ERROR_MSG_API_FINISH_TRIP} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}
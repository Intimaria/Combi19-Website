import {
    ERROR_MSG_API_DELETE_PLACES,
    ERROR_MSG_API_GET_PLACES,
    ERROR_MSG_API_GET_PROVINCES,
    ERROR_MSG_API_POST_PLACES,
    ERROR_MSG_API_PUT_PLACES,
    ERROR_MSG_INTERNET
} from "../const/messages";

import {BACKEND_URL} from "../const/config";
import axios from 'axios';

export const getPlaces = async () => {
  const token = localStorage.getItem('token');
    try {
        let response = await axios.get(`${BACKEND_URL}/places`,
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

            console.log(`${ERROR_MSG_API_GET_PLACES} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}
export const getPlace = async () => {
  const token = localStorage.getItem('token');
  try {
      const instance = axios.create({
          baseURL: `${BACKEND_URL}/place/:id`,
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
      const response = await instance.get();
      return response.data;
  } catch (error) {
      console.log(`${ERROR_MSG_API_GET_PLACES} ${error}`);
      return null;
  }
}

export const getProvinces = async () => {
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
      console.log(`${ERROR_MSG_API_GET_PROVINCES} ${error}`);

      console.log('error.constructor.name', error.constructor.name);
      console.log('error.message', error.message);
      console.log('error.name', error.name);


      if (error.message === 'Network Error') {
          error.message = ERROR_MSG_INTERNET
          return error.message;
      } else {
          return error.message;
      }


  }
}

export const postPlace = async (selectedPlaces, provinceSelected) => {
    const token = localStorage.getItem('token');

    const newPlace = {
        city_name: selectedPlaces.city_name,
        id_province: provinceSelected
    };

    try {
        let response = await axios.post(`${BACKEND_URL}/places`,
            newPlace,
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

            console.log(`${ERROR_MSG_API_POST_PLACES} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const putPlace = async (selectedPlaces, provinceSelected) => {
  const token = localStorage.getItem('token');

  const modifiedPlace = {
      cityName: selectedPlaces.name,
      id_provincer: provinceSelected
  };

  try {
      let response = await axios.post(`${BACKEND_URL}/places`,
          modifiedPlace,
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

          console.log(`${ERROR_MSG_API_PUT_PLACES} ${error}`);

          if (error.message === 'Network Error') {
              error.message = ERROR_MSG_INTERNET;
              return error.message;
          } else {
              return error.message;
          }
      }
  }
};

export const deletePlace = async (selectedPlaces, provinceSelected) => {
  const token = localStorage.getItem('token');

  const deletedPlace = {
      cityName: selectedPlaces.name,
      id_provincer: provinceSelected,
      active: 0
  };

  try {
      let response = await axios.post(`${BACKEND_URL}/places`,
      deletedPlace,
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

          console.log(`${ERROR_MSG_API_DELETE_PLACES} ${error}`);

          if (error.message === 'Network Error') {
              error.message = ERROR_MSG_INTERNET;
              return error.message;
          } else {
              return error.message;
          }
      }
  }
};

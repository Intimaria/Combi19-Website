import {BACKEND_URL} from "../const/config";
import axios from 'axios';
import {
    ERROR_MSG_INTERNET
} from "../const/messages";

export const updateUserDataValues = async () => {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
    try {
        let response = await axios.get(`${BACKEND_URL}/getPassangersValues/${userData.userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        if (response?.status === 200) {
            let newUserData = response.data.userData;
            newUserData.userRoleId = userData.userRoleId;
            localStorage.setItem('userData', JSON.stringify(newUserData));
            return true;
        }
        else if (response?.status === 400 || response?.status === 500) {
            console.log(response.data);
            return false;
        }
        else if (response?.status === 401 || response?.status === 403) {
            console.log('Usted no posee permiso para realizar tal operación');
            return false;
        }
    } catch (error) {
        if (error.response?.status) {
            return error.response;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`Ocurrió un error al actualizar los datos del usuario ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const userConfigurationWithNewPassword = async (userData, id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.put(`${BACKEND_URL}/userConfiguration/withNewPassword/${id}`,
        userData,
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

            console.log(`Hubo un error ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

export const userConfigurationWitoutNewPassword = async (userData, id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.put(`${BACKEND_URL}/userConfiguration/witoutNewPassword/${id}`,
        userData,
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

            console.log(`Hubo un error ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

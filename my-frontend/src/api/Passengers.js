import {BACKEND_URL} from "../const/config";
import axios from 'axios';
import {
    ERROR_MSG_API_PUT_GOLD_MEMBERSHIP,
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
        } else if (response?.status === 400 || response?.status === 500) {
            console.log(response.data);
            return false;
        } else if (response?.status === 401 || response?.status === 403) {
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

export const login = async (email, password, path) => {
    try {
        let response = await axios.post(`${BACKEND_URL}/${path}`,
            {
                email,
                password
            })
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

export const register = async (dataToRegister) => {
    try {
        let response = await axios.post(`${BACKEND_URL}/register`,
            dataToRegister
        );

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

export const verifyToken = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${BACKEND_URL}/authorization/passangers`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response?.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response?.status) {
            return false;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`Ha ocurrido un error ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};


export const putGoldMembership = async (userId, automaticDebit) => {
    const token = localStorage.getItem('token');

    try {
        let response = await axios.put(`${BACKEND_URL}/goldMembership/${userId}`,
            {automaticDebit},
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

            console.log(`${ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} ${error}`);
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

export const getEmailToRecoverPassword = async (email) => {
    try {
        let body = {
            email
        };

        let response = await axios.post(`${BACKEND_URL}/recoverPassword/getEmail/`, body);
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

export const postNewRecoveredPassword = async (email, passwordRevocered1, passwordRevocered2) => {
    try {
        let body = {
            email,
            passwordRevocered1,
            passwordRevocered2
        };

        let response = await axios.put(`${BACKEND_URL}/recoverPassword/postNewPassword/`, body);
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

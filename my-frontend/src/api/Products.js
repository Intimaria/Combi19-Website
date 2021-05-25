import axios from 'axios';
import { BACKEND_URL } from "../const/config";
import {
    ERROR_MSG_API_GET_PRODUCTS,
    ERROR_MSG_API_POST_PRODUCT,
    ERROR_MSG_API_PUT_PRODUCT,
    ERROR_MSG_API_DELETE_PRODUCT,
    ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE,
    ERROR_MSG_INTERNET,
    ERROR_MSG_API_PUT_PRODUCT_VALIDATE_CLIENT_DEPENDENCE
} from "../const/messages";

export const getProducts = async () => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.get(`${BACKEND_URL}/products`,
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

            console.log(`${ERROR_MSG_API_GET_PRODUCTS}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const postProducts = async (productData, typeProduct) => {
    const token = localStorage.getItem('token');
    const newProduct = {
        typeProduct,
        name : productData.name,
        price: productData.price
    }
    try {
        let response = await axios.post(`${BACKEND_URL}/products`,
        newProduct,
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

            console.log(`${ERROR_MSG_API_POST_PRODUCT}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const putProducts = async (productData, typeProduct ,id) => {
    const token = localStorage.getItem('token');
    const newProduct = {
        typeProduct,
        name : productData.name,
        price: productData.price
    }
    try {
        let response = await axios.put(`${BACKEND_URL}/products/${id}`,
        newProduct,
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

            console.log(`${ERROR_MSG_API_PUT_PRODUCT} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const deleteProducts = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.delete(`${BACKEND_URL}/products/${id}`,
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

            console.log(`${ERROR_MSG_API_DELETE_PRODUCT} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const getAvailableProducts = async () => {
    const token = localStorage.getItem('token');
    try {
        const instance = axios.create({
            baseURL: `${BACKEND_URL}/products/custom/available`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const response = await instance.get();
        return response;
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE} ${error}`);

        if (error.message === 'Network Error') {
            error.message = ERROR_MSG_INTERNET
            return error.message;
        } else {
            return error.message;
        }


    }
}

export const getProductDependenceById = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.get(`${BACKEND_URL}/products/custom/productDependenceById/${id}`,
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

            console.log(`${ERROR_MSG_API_PUT_PRODUCT_VALIDATE_CLIENT_DEPENDENCE} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};
import axios from 'axios';
import {BACKEND_URL} from "../const/config";

import {
    ERROR_MSG_API_PUT_PASSENGER_TRIP,
    ERROR_MSG_INTERNET
} from "../const/messages";

export const putPassengerTrip = async (cartId, cardId, userId) => {
    const token = localStorage.getItem('token');

    let formattedPassengerTrip = {
        cartId,
        cardId,
        userId
    };

    try {
        let response = await axios.put(`${BACKEND_URL}/my-trips/custom/cartConfirmation/${formattedPassengerTrip.cartId}`,
            formattedPassengerTrip,
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

            console.log(`${ERROR_MSG_API_PUT_PASSENGER_TRIP} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};

import axios from 'axios';
import {BACKEND_URL} from "../const/config";

import {
    ERROR_MSG_API_PUT_PASSENGER_TRIP,
    ERROR_MSG_INTERNET
} from "../const/messages";

export const postPassengerTrip = async (cart, cardId, userId, isUserGold) => {
    const token = localStorage.getItem('token');

    let formattedPassengerCart = {
        cart,
        cardId,
        userId,
        isUserGold
    };

    try {
        let response = await axios.post(`${BACKEND_URL}/my-trips/custom/cartConfirmation`,
            formattedPassengerCart,
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

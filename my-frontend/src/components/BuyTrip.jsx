import React from 'react'
import { useHistory } from "react-router-dom";

const BuyTrip = () => {
    const history = useHistory();

    // Verify that the user is not risky
    const expirationRisk = JSON.parse(localStorage.getItem('userData')).expirationRisk;
    if (expirationRisk && expirationRisk >= new Date().toISOString().substring(0, 10)) {
        history.push("/tripsResults");
    }

    // Get selected trip id
    const tripToBuy = JSON.parse(localStorage.getItem("tripToBuy"));

    // Redirect in case a trip has not been selected
    if (!tripToBuy) {
        history.push("/tripsResults");
    }

    return (
        <div>
            <h2 className="text-light">{"Selecciono el viaje con origen: " + tripToBuy.departure}</h2>
            <h2 className="text-light">{"y destino: " + tripToBuy.destination}</h2>
        </div>
    )
}

export default BuyTrip

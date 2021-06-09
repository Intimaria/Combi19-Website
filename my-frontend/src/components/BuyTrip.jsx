import React from 'react'
import { useHistory } from "react-router-dom";
import { Ticket } from '../components/Ticket';

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
            <Ticket tripToBuy={tripToBuy}/>
        </div>
    )
}

export default BuyTrip

import React, {useEffect} from 'react'
import { useHistory } from "react-router-dom";
import { Ticket } from '../components/Ticket';
import moment from "moment";

const BuyTrip = () => {
    const history = useHistory();
    // Get selected trip id
    const tripToBuy = JSON.parse(localStorage.getItem("tripToBuy"));

    // Verify that the user is not risky
    const verifyExpirationRisk = () => {
        const expirationRisk = JSON.parse(localStorage.getItem('userData')).expirationRisk;
        if (expirationRisk && moment(expirationRisk).isAfter(moment())) {
            history.push("/tripsResults");
        }
    }
    // Redirect in case a trip has not been selected
    const verifyTrip = () => {
        if (!tripToBuy) {
            history.push("/tripsResults");
        }
    }

    useEffect(() => {
        verifyTrip();
        verifyExpirationRisk();
    }, [])
    
    return (
        <div>
            <Ticket tripToBuy={tripToBuy}/>
        </div>
    )
}

export default BuyTrip

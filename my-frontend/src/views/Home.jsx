import PassengerTrips from '../components/PassengerTrips';
import React, {useEffect} from 'react'
import {Message} from "../components/Message";
import moment, { now } from 'moment';
import RiskyPassenger from "../components/RiskyPassenger.jsx";
document.title = `Home`;

const Home = (props) => {
    localStorage.removeItem("tripIdToBuy");
    
    const covidRisk = localStorage.getItem('expirationRisk');
    const userData = JSON.parse(localStorage.getItem('userData'));

    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});
    const [open, setOpen] = React.useState(true);


    useEffect(() => {
        if (props.successMessage && props.showSuccessMessage) {
            setOptions({
                ...options, open: true, type: 'success',
                message: props.successMessage
            });
            props.setShowSuccessMessage(false);
        }
    }, []);

    return (
        <div>
            {
                props.successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <h1 className="text-light text-center"> Bienvenido {userData.userName} {userData.userSurname}</h1>
            {moment(covidRisk).isAfter(moment()) && <RiskyPassenger covidRisk={covidRisk} />}       
            {userData.userRoleId.includes(3) && <PassengerTrips/>}
        </div>
    )
}

export default Home

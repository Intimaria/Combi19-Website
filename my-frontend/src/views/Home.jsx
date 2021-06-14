import PassengerTrips from '../components/PassengerTrips';
import React, {useEffect} from 'react'
import {Message} from "../components/Message";

document.title = `Home`;

const Home = (props) => {
    localStorage.removeItem("tripIdToBuy");


    const userData = JSON.parse(localStorage.getItem('userData'));

    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

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
            {userData.userRoleId.includes(3) && <PassengerTrips/>}
        </div>
    )
}

export default Home

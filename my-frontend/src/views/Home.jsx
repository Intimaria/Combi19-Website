import PassengerTrips from '../components/PassengerTrips';
import React from 'react'
document.title = `Home`;

const Home = () => {
    localStorage.removeItem("tripIdToBuy");

    const userData = JSON.parse(localStorage.getItem('userData'));

    return (     
        <div>
            <h1 className="text-light text-center"> Bienvenido {userData.userName} {userData.userSurname}</h1>
            {userData.userRoleId.includes(3) && <PassengerTrips />}
        </div>
    )
}

export default Home

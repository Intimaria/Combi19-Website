import React from 'react'
import { useHistory } from "react-router-dom";
document.title = `Home`;

const Home = () => {
    const history = useHistory();

        const userData = JSON.parse(localStorage.getItem('userData'));

    return (     
        <div>
            <h1 className="text-light"> Hola {userData.userName} {userData.userSurname}</h1>
        </div>
    )
}

export default Home

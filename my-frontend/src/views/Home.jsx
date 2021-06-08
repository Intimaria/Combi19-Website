import React from 'react'
document.title = `Home`;

const Home = () => {
    localStorage.removeItem("tripIdToBuy");

    const userData = JSON.parse(localStorage.getItem('userData'));

    return (     
        <div>
            <h1 className="text-light text-center"> Bienvenido {userData.userName} {userData.userSurname}</h1>
        </div>
    )
}

export default Home

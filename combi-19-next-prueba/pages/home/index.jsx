import React from 'react'
const axios = require("axios");

const Home = () => {

    const verifyToken = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/api/authorization',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log("You have authorization to see this page");
            })
            .catch((error) => {
                console.log("You don't have authorization to see this page");
                if (token) localStorage.removeItem('token');
            });
    }
    return (     
        <div>
            <div className="text-center">
                <input type="button" value="Autorizar" className="btn btn-secondary mt-3 w-50" onClick={verifyToken} />
            </div>
        </div>
    )
}

export default Home

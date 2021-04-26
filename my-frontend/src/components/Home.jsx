import React from 'react'
import { useHistory } from "react-router-dom";
const axios = require("axios");
document.title = `Home`;

const Home = () => {
    const history = useHistory();

    const verifyToken = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3001/authorization',
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
                history.push("/");
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

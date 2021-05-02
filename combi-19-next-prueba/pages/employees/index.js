import React from 'react';
import {useRouter} from 'next/router';
const axios = require("axios");


const Login = ({path}) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState(null);

    const handleEmail = (newValue) => {
        setEmail(newValue.target.value);
        setLoginError(null);
    }

    const handlePassword = (newValue) => {
        setPassword(newValue.target.value);
        setLoginError(null);
    }

    const mySubmitHandler = (event) => {
        event.preventDefault();

        getRequest();
        return true;
    }
    const getRequest = () => {
        axios.post(`http://localhost:3000/api/${path}`, {
            email,
            password
        })
            .then((response) => {
                console.log("The session was successful");
                setLoginError(null);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.userData));
                router.push('/home');
            })
            .catch((error) => {
                console.log("There was an error in the submitted entries");
                setLoginError(error.response.data);
            });
    }
    return (
        <div className="container w-50 bg-dark pb-3 rounded">
            <h2 className="text-light">Iniciar sesión</h2>
            <form onSubmit={mySubmitHandler}>
                <div className="row">
                    <div className="col-md">
                        <input id="inpEmail" type="email" className="form-control mt-3" placeholder="Correo electrónico"
                               maxLength="70"
                               onChange={newValue => handleEmail(newValue)}/>
                    </div>
                    <div className="col-md">
                        <input id="inpPassword" type="password" className="form-control mt-3" placeholder="Contraseña"
                               maxLength="30"
                               onChange={newValue => handlePassword(newValue)}/>
                    </div>
                    {
                        loginError ? <span className="text-danger small">{loginError}</span> :
                            <span className="text-danger small">&nbsp;</span>
                    }
                    <div className="w-100"></div>
                    <div className="text-center">
                        <input id="btnLogin" type="submit" value="Iniciar sesión"
                               className="btn btn-primary confirm-button w-50 mt-3"/>
                    </div>
                </div>
            </form>
        </div>

    );
}


export default Login;

import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import { useHistory } from "react-router-dom";
import {
    ERROR_MSG_API_LOGIN,
    ERROR_MSG_INTERNET
} from "../const/messages";
import { Message } from "./Message";

const axios = require("axios");

const Login = ({ path }) => {
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const history = useHistory();
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
        console.log(showPassword);
    }

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
        axios.post(`http://localhost:3001/${path}`, {
            email,
            password
        })
            .then((response) => {
                console.log("The session was successful");
                setLoginError(null);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.userData));
                history.push("/home");

                setSuccessMessage(`Sesión iniciada correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Sesión iniciada correctamente`
                });
            })
            .catch((error) => {
                console.log("There was an error in the submitted entries");
                if (error.response?.status) {
                    setLoginError(error.response.data);
                } else {
                    // In this situation, is NOT an axios handled error

                    console.log(`${ERROR_MSG_API_LOGIN} ${error}`);

                    if (error.message === 'Network Error') {
                        error.message = ERROR_MSG_INTERNET;

                    }
                    setSuccessMessage(`${ERROR_MSG_API_LOGIN} ${error.message}`);
                    setOptions({
                        ...options, open: true, type: 'error',
                        message: `${ERROR_MSG_API_LOGIN} ${error.message}`
                    });
                    return error.message;

                }
            });
    }
    return (
        <div className="container w-50 bg-dark pb-3 rounded">
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }
            <h2 className="text-light">Iniciar sesión</h2>
            <form onSubmit={mySubmitHandler}>
                <div className="row">
                    <div className="col-md">
                        <input id="inpEmail" type="email" className="form-control mt-3" placeholder="Correo electrónico"
                            maxLength="70"
                            onChange={newValue => handleEmail(newValue)} />
                    </div>
                    <div className="col-md">
                        <input id="inpPassword" type={showPassword ? "text" : "password"} className="form-control mt-3" placeholder="Contraseña"
                            maxLength="30"
                            onChange={newValue => handlePassword(newValue)} />
                    </div>
                    <div className="w-100"></div>
                    {
                        loginError ? <span className="text-danger small w-50">{loginError}</span> :
                            <span className="text-danger small w-50">&nbsp;</span>
                    }
                    <label className="text-light w-50">
                        Mostrar Contraseña: <input type="checkbox" key="inpPassword" onChange={() => handleShowPassword()}/>
                    </label>
                    <div className="w-100"></div>
                    <div className="text-center">
                        <input id="btnLogin" type="submit" value="Iniciar sesión"
                            className="btn btn-primary confirm-button w-50 mt-3" />
                    </div>
                </div>
            </form>
        </div>

    );
}


export default Login;

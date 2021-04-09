import React from 'react';
import { useHistory } from "react-router-dom";

const axios = require("axios");

const Login = ({path}) => {
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState(null);

    const mySubmitHandler = (event) => {
        event.preventDefault();

        getRequest();
        return true;
    }
    const getRequest = () => {
        axios.post(`http://localhost:3001/login/${path}`, {
            email,
            password
        })
            .then((response) => {
                console.log("The session was successful");
                setLoginError(null);
                console.log(response.data.token);
                localStorage.setItem('token',response.data.token);
                history.push("/home");
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
                    {
                        loginError ? <span className="text-danger">{loginError}</span> : null
                    }
                    <div className="col-md">
                        <input type="email" className="form-control mb-3" placeholder="Ingrese Correo" onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="col-md">
                        <input type="password" className="form-control mb-3" placeholder="Ingrese Contraseña" onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="w-100"></div>
                    <div className="text-center">
                        <input type="submit" value="Iniciar Sesion" className="btn btn-secondary w-50" />
                    </div>
                </div>
            </form>
        </div>

    );
}


export default Login;
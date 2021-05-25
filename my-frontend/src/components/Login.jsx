import React from 'react';
import {useHistory} from "react-router-dom";

import {TextField, Button} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {useStyles} from '../const/modalStyle';
import IconButton from "@material-ui/core/IconButton";

import {
    ERROR_MSG_API_LOGIN,
    ERROR_MSG_INTERNET
} from "../const/messages";
import {Message} from "./Message";


const axios = require("axios");

const Login = ({path}) => {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const history = useHistory();
    const styles = useStyles();
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
        console.log(showPassword);
    };

    const handleEmail = (newValue) => {
        setEmail(newValue.target.value);
        setLoginError(null);
    };

    const handlePassword = (newValue) => {
        setPassword(newValue.target.value);
        setLoginError(null);
    };

    const mySubmitHandler = (event) => {
        event.preventDefault();

        getRequest();

        return true;
    };

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
    };

    return (
        <div className={styles.modal}>
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <h2 align={'center'}>Iniciar sesión</h2>

            <form onSubmit={mySubmitHandler}>

                <TextField className={styles.inputMaterial} label="Correo electrónico" name="email"
                           onChange={handleEmail}
                           required
                           inputProps={{maxLength: 70}}
                           autoComplete='off'
                />
                <br/>
                <FormControl className={styles.inputMaterial}
                             required
                             error={loginError}>
                    <InputLabel htmlFor="password">Contraseña</InputLabel>
                    <Input
                        id="password"
                        required
                        inputProps={{maxLength: 100}}
                        autoComplete='off'
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        onChange={handlePassword}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>{(loginError) ? loginError : ' '}</FormHelperText>
                </FormControl>
                <br/><br/>


                <Button style={{width: '100%'}}
                        variant="contained"
                        size="large"
                        color="primary"
                        id="btnLogin"
                        type="submit"
                >INICIAR SESIÓN</Button>
            </form>
        </div>

    );
};


export default Login;

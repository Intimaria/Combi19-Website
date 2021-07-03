import React, { Fragment, useEffect } from 'react';
import { useHistory, NavLink } from "react-router-dom";

import { TextField, Button } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useStyles } from '../const/componentStyles';
import IconButton from "@material-ui/core/IconButton";
import { Message } from '../components/Message';
import { login } from "../api/Passengers.js";
import moment from 'moment';

const axios = require("axios");

const Login = (props) => {

    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    const history = useHistory();
    const styles = useStyles();
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState(null);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleEmail = (newValue) => {
        setEmail(newValue.target.value);
        setLoginError(null);
    };

    const handlePassword = (newValue) => {
        setPassword(newValue.target.value);
        setLoginError(null);
    };

    const mySubmitHandler = async (event) => {
        event.preventDefault();

        await postRequest();

        return true;
    };

    const postRequest = async () => {
        let postRequest = await login(email, password, props.path);
        if (postRequest?.status === 200) {
            console.log("The session was successful");
            setLoginError(null);
            localStorage.setItem('token', postRequest.data.token);
            localStorage.setItem('userData', JSON.stringify(postRequest.data.userData));
            localStorage.setItem('expirationRisk', postRequest.data.userData.expirationRisk);
            history.push(props.redirectPage);
        }
        else if (postRequest?.status === 400) {
            console.log("There was an error in the submitted entries");
            setLoginError(postRequest.data);
        };
    };
    const setRecoverPasswordProps = () => {
        props.setPath(history.location.pathname);
        history.push("/recoverPassword");
    };

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
        <Fragment>
            {
                props.successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }
            <div className={styles.modal}>
                {props.redirectBoolean ? <h4 align={'center'}>Debes iniciar sesión para continuar</h4> : null}

                <h2 align={'center'}>Iniciar sesión</h2>

                <form onSubmit={mySubmitHandler}>

                    <TextField className={styles.inputMaterial} label="Correo electrónico" name="email"
                        onChange={handleEmail}
                        required
                        inputProps={{ maxLength: 70 }}
                        autoComplete='off'
                    />
                    <br />
                    <FormControl className={styles.inputMaterial}
                        required
                        error={loginError}>
                        <InputLabel htmlFor="password">Contraseña</InputLabel>
                        <Input
                            id="password"
                            required
                            inputProps={{ maxLength: 100 }}
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
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>{(loginError) ? loginError : ' '}</FormHelperText>
                    </FormControl>
                    <br /><br />


                    <Button style={{ width: '100%' }}
                        variant="contained"
                        size="large"
                        color="primary"
                        id="btnLogin"
                        type="submit"
                    >INICIAR SESIÓN</Button>

                    {
                        props.path !== "employee/login" ?
                            <div>
                                <h6 align={'center'}>¿Olvidaste tu contraseña? Recuperala <h6 onClick={() => setRecoverPasswordProps()} className="text-primary" role='button'> Aquí </h6></h6>
                                <br />
                                <h5 align={'center'}>¿No tiene una cuenta? Registrate</h5>

                                <Button style={{ width: '100%' }}
                                    variant="contained"
                                    size="large"
                                    color="primary"
                                    id="btnRegister"
                                    type="submit"
                                    onClick={() => history.push("/register")}
                                >REGISTRATE</Button>
                            </div>
                            : null
                    }
                </form>
            </div>

        </Fragment>
    );
};


export default Login;

import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import { useStyles } from '../const/componentStyles';
import { TextField, Button } from '@material-ui/core';
import { Message } from '../components/Message';
import moment from "moment";
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import FormHelperText from '@material-ui/core/FormHelperText';

import {
    getEmailToRecoverPassword,
    postNewRecoveredPassword
} from "../api/Passengers.js";

import {
    ERROR_MSG_EMPTY_EMAIL,
    ERROR_MSG_INVALID_EMAIL,
    ERROR_MSG_EMPTY_PASSWORD,
    ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS,
    ERROR_MSG_EMPTY_REPEAT_PASSWORD,
    ERROR_MSG_PASSWORD_NO_MATCH
} from '../const/messages.js';

import {
    REGEX_EMAIL,
    REGEX_ONLY_NUMBER
} from '../const/regex.js'

const RecoverPassword = (props) => {
    const styles = useStyles();

    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const history = useHistory();

    const [validEmail, setValidEmail] = useState(false);
    const [validCode, setValidCode] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [codeTime, setCodeTime] = useState('');
    const [recoveredPassword1, setRecoveredPassword1] = useState();
    const [recoveredPassword2, setRecoveredPassword2] = useState();
    const [recoveredPassword1Error, setRecoveredPassword1Error] = useState();
    const [recoveredPassword2Error, setRecoveredPassword2Error] = useState();
    const [showPassword1, setShowPassword1] = React.useState(false);
    const [showPassword2, setShowPassword2] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    const handleEmail = (newValue) => {
        setEmail(newValue.target.value);
        setEmailError(null);
    };

    const mySubmitEmailHandler = async (event) => {
        event.preventDefault();

        if (validateEmail(email)) await getEmailRequest();

        return true;
    }

    const validateEmail = (email) => {
        if (!email) {
            setEmailError(ERROR_MSG_EMPTY_EMAIL);
            return false;
        }
        if (!REGEX_EMAIL.test(email)) {
            setEmailError(ERROR_MSG_INVALID_EMAIL);
            return false;
        }

        setEmailError(null);
        return true;
    };

    const getEmailRequest = async () => {
        let getRequest = await getEmailToRecoverPassword(email);
        if (getRequest?.status === 200) {
            if (getRequest.data) {
                setValidEmail(true);
                setCodeTime(moment().add(5, "minutes"));
            }
            else {
                setEmailError("El email ingresado no se encuentra registrado");
            }
        }
        else if (getRequest?.status === 400) {
            setEmailError(getRequest.data.emailError);
        }
        else if (getRequest?.status === 500) {
            setSuccessMessage(getRequest.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: getRequest.data
            });
        };
    }

    const validateEmailToRecoverPassword = (
        <div className={styles.modal}>
            <form onSubmit={mySubmitEmailHandler}>
                <h2 align={'center'}> Recupera tu cuenta </h2>
                <br />
                <h5 align={'center'}> Ingrese su correo electrónico </h5>
                <TextField className={styles.inputMaterial} label="Correo electrónico *" name="email"
                    id="email"
                    type={"email"}
                    inputProps={{ maxLength: 70 }}
                    autoComplete='off'
                    error={(emailError) ? true : false}
                    helperText={(emailError) ? emailError : false}
                    value={email}
                    onChange={newValue => handleEmail(newValue)}
                />
                <br /><br />
                <Button style={{ width: '100%' }}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnRegister"
                    type="submit"
                    onClick={() => ""}
                >Buscar</Button>
            </form>
        </div>
    )

    const handleCode = (newValue) => {
        setCode(newValue.target.value);
        setCodeError(null);
    };

    const mySubmitCodeHandler = async (event) => {
        event.preventDefault();

        if (validateCode(code)) setValidCode(true);

        return true;
    }

    const validateCode = (code) => {
        if (!code) {
            setCodeError("Ingrese el codigo");
            return false;
        }
        if (!REGEX_ONLY_NUMBER.test(code)) {
            setCodeError("* Ingrese un formato de código válido");
            return false;
        }
        if (code.length < 6) {
            setCodeError("* Ingrese un formato de código válido");
            return false;
        }
        if (code === "111111") {
            setCodeError("* El código ingresado es incorrecto");
            return false;
        }
        if (code === "222222" || codeTime.isBefore(moment())) {
            setCodeError("* El código expiró, solicite uno nuevo");
            return false;
        }

        setCodeError(null);
        return true;
    };

    const validateCodeToRecoverPassword = (
        <div className={styles.modal}>
            <form onSubmit={mySubmitCodeHandler}>
                <h6 align={'center'}> Se le envió un código de 6 dígitos a su email </h6>
                <h6 align={'center'}> Ingrese el mismo en los próximos 5 minutos </h6>
                <br />
                <h5 align={'center'}> Ingrese el código </h5>
                <TextField className={styles.inputMaterial} label="Código *" name="code"
                    id="code"
                    type={"text"}
                    inputProps={{ maxLength: 6 }}
                    autoComplete='off'
                    error={(codeError) ? true : false}
                    helperText={(codeError) ? codeError : false}
                    value={code}
                    onChange={newValue => handleCode(newValue)}
                />
                <br /><br />
                <Button style={{ width: '100%' }}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnRegister"
                    type="submit"
                    onClick={() => ""}
                >Confirmar</Button>
                <h6 align={'center'}>¿No te llegó el código? Reenvialo <h6 onClick={() => setCodeTime(moment().add(5, "minutes"))} className="text-primary" role='button'> Aquí </h6></h6>
            </form>
        </div>
    )
    
    const handleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleRecoveredPassword1 = (newValue) => {
        setRecoveredPassword1(newValue.target.value);
        setRecoveredPassword1Error(null);
    };

    const handleRecoveredPassword2 = (newValue) => {
        setRecoveredPassword2(newValue.target.value);
        setRecoveredPassword2Error(null);
    };

    const mySubmitRecoveredPasswordHandler = async (event) => {
        event.preventDefault();

        if (validatePassword(recoveredPassword1) && comparePasswords(recoveredPassword1, recoveredPassword2)) await getPasswordRequest();

        return true;
    };

    const validatePassword = (password1) => {
        if (!password1) {
            setRecoveredPassword1Error(ERROR_MSG_EMPTY_PASSWORD);
            return false;
        } else if (password1.length < 6) {
            setRecoveredPassword1Error(ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS);
            return false;
        }

        setRecoveredPassword1Error(null);
        return true;
    };

    const comparePasswords = (password1, password2) => {
        if (!password2) {
            setRecoveredPassword2Error(ERROR_MSG_EMPTY_REPEAT_PASSWORD);
            return false;
        } else if (password1 !== password2) {
            setRecoveredPassword2Error(ERROR_MSG_PASSWORD_NO_MATCH);
            return false;
        }

        setRecoveredPassword2Error(null);
        return true;
    };

    const getPasswordRequest = async () => {
        let postRequest = await postNewRecoveredPassword(email, recoveredPassword1, recoveredPassword2);
        if (postRequest?.status === 200) {
            props.setSuccessMessage(postRequest.data);
            props.setShowSuccessMessage(true);
            history.push(props.path);
        }
        else if (postRequest?.status === 400) {
            setRecoveredPassword1(postRequest.data.passwordError1);
            setRecoveredPassword2(postRequest.data.passwordError2);
            setEmailError(postRequest.data.emailError);
        }
        else if (postRequest?.status === 500) {
            setSuccessMessage(postRequest.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: postRequest.data
            });
        };
    }

    const validatePasswordToRecover = (
        <div className={styles.modal}>
            <form onSubmit={mySubmitRecoveredPasswordHandler}>
                <h5 align={'center'}> Ingresa una nueva contraseña </h5>
                <FormControl className={styles.inputMaterial}
                    error={(recoveredPassword1Error) ? true : false}>
                    <InputLabel htmlFor="recoveredPassword1">Nueva contraseña *</InputLabel>
                    <Input
                        id="recoveredPassword1"
                        inputProps={{ maxLength: 100 }}
                        autoComplete='off'
                        type={showPassword1 ? 'text' : 'password'}
                        name="recoveredPassword1"
                        value={recoveredPassword1}
                        onChange={newValue => handleRecoveredPassword1(newValue)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleShowPassword1}
                                    edge="end"
                                >
                                    {showPassword1 ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>{(recoveredPassword1Error) ? recoveredPassword1Error : false}</FormHelperText>
                </FormControl>
                <FormControl className={styles.inputMaterial}
                    error={(recoveredPassword2Error) ? true : false}>
                    <InputLabel htmlFor="recoveredPassword2">Repita la nueva contraseña *</InputLabel>
                    <Input
                        id="recoveredPassword2"
                        inputProps={{ maxLength: 100 }}
                        autoComplete='off'
                        type={showPassword2 ? 'text' : 'password'}
                        name="recoveredPassword2"
                        value={recoveredPassword2}
                        onChange={newValue => handleRecoveredPassword2(newValue)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleShowPassword2}
                                    edge="end"
                                >
                                    {showPassword2 ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>{(recoveredPassword2Error) ? recoveredPassword2Error : false}</FormHelperText>
                </FormControl>
                <br /><br />
                <Button style={{ width: '100%' }}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnRegister"
                    type="submit"
                    onClick={() => ""}
                >Confirmar</Button>
            </form>
        </div>
    )

    return (
        <div>
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }
            {!validEmail ? validateEmailToRecoverPassword : null}
            {validEmail && !validCode ? validateCodeToRecoverPassword : null}
            {validEmail && validCode ? validatePasswordToRecover : null}
        </div>
    )
}

export default RecoverPassword

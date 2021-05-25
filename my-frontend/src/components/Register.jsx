import React from 'react';
import {Message} from '../components/Message';
import {TextField, Button} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {useStyles} from '../const/modalStyle';
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import moment from "moment";


import {BACKEND_URL} from '../const/config.js';

import {
    ERROR_MSG_EMPTY_DATE,
    ERROR_MSG_EMPTY_EMAIL,
    ERROR_MSG_EMPTY_NAME,
    ERROR_MSG_EMPTY_PASSWORD,
    ERROR_MSG_EMPTY_REPEAT_PASSWORD,
    ERROR_MSG_EMPTY_SURNAME,
    ERROR_MSG_INVALID_AGE,
    ERROR_MSG_INVALID_DATE,
    ERROR_MSG_INVALID_EMAIL,
    ERROR_MSG_INVALID_NAME,
    ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS,
    ERROR_MSG_PASSWORD_NO_MATCH,
    ERROR_MSG_INVALID_SURNAME
} from '../const/messages.js';

import {
    REGEX_DATE_YYYY_MM_DD,
    REGEX_EMAIL,
    REGEX_ONLY_ALPHABETICAL
} from '../const/regex.js';

import {CustomDatePicker} from '../components/CustomDatePicker';


const axios = require("axios");

function Register() {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };


    const today = new Date().toISOString().slice(0, 10);
    const styles = useStyles();
    const [showPassword1, setShowPassword1] = React.useState(false);
    const [showPassword2, setShowPassword2] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [names, setNames] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [password1, setPassword1] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [birthday, setBirthday] = React.useState(moment()
        .subtract(18, "years")
        .set({hour: 0, minute: 0, second: 0, millisecond: 0})
        .format('YYYY-MM-DD')
    );
    const [emailError, setEmailError] = React.useState(null);
    const [namesError, setNamesError] = React.useState(null);
    const [surnameError, setSurnameError] = React.useState(null);
    const [password1Error, setPassword1Error] = React.useState(null);
    const [password2Error, setPassword2Error] = React.useState(null);
    const [birthdayError, setBirthdayError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const handleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    const mySubmitHandler = (event) => {
        event.preventDefault();

        if (successMessage) setSuccessMessage(null);
        if (!validate()) {
            console.log("the entries have errors, modify them");
            return false;
        }

        postRequest();
        return true;

    };

    const postRequest = () => {
        axios.post(`${BACKEND_URL}/register`, {
            names,
            surname,
            email,
            password1,
            password2,
            birthday
        })
            .then((response) => {
                console.log("The inputs were submitted successfully");
                setDefaultValues();
                setSuccessMessage(response.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: response.data
                });
            })
            .catch((error) => {
                console.log("There was an error in the submitted entries");
                setEmailError(error.response.data.emailError);
                setNamesError(error.response.data.namesError);
                setSurnameError(error.response.data.surnameError);
                setBirthdayError(error.response.data.birthdayError);
                setPassword1Error(error.response.data.passwordError1);
                setPassword2Error(error.response.data.passwordError2);
            });
    };

    const setDefaultValues = () => {
        setEmail('');
        setNames('');
        setSurname('');
        setBirthday(moment()
            .subtract(18, "years")
            .set({hour: 0, minute: 0, second: 0, millisecond: 0})
            .format('YYYY-MM-DD')
        );
        setPassword1('');
        setPassword1('');
        setPassword2('');
    };

    const handleEmail = (newValue) => {
        setEmail(newValue.target.value);
        setSuccessMessage(null);
        setEmailError(null);
    };

    const handleNames = (newValue) => {
        setNames(newValue.target.value);
        setSuccessMessage(null);
        setNamesError(null);
    };

    const handleSurname = (newValue) => {
        setSurname(newValue.target.value);
        setSuccessMessage(null);
        setSurnameError(null);
    };

    const handleBirthday = (newValue) => {
        if (newValue) {
            setBirthday(newValue.format('YYYY-MM-DD'));
            setBirthdayError(null);
        }
        setSuccessMessage(null);
    };

    const handlePassword1 = (newValue) => {
        setPassword1(newValue.target.value);
        setSuccessMessage(null);
        setPassword1Error(null);
    };

    const handlePassword2 = (newValue) => {
        setPassword2(newValue.target.value);
        setSuccessMessage(null);
        setPassword2Error(null);
    };

    const validate = () => {
        return validateEmail() & validateName() & validateSurname() & validatePassword() & comparePasswords() & validateDate();
    };


    const validateEmail = () => {
        if (!email) {
            setEmailError(ERROR_MSG_EMPTY_EMAIL);
            console.log('entró1')
            return false;
        }
        if (!REGEX_EMAIL.test(email)) {
            setEmailError(ERROR_MSG_INVALID_EMAIL);
            console.log('entró2')
            return false;
        }

        setEmailError(null);
        return true;
    };

    const validateName = () => {
        if (!names) {
            setNamesError(ERROR_MSG_EMPTY_NAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(names)) {
            setNamesError(ERROR_MSG_INVALID_NAME);
            return false;
        }

        setNamesError(null);
        return true;
    };

    const validateSurname = () => {
        if (!surname) {
            setSurnameError(ERROR_MSG_EMPTY_SURNAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(surname)) {
            setSurnameError(ERROR_MSG_INVALID_SURNAME);
            return false;
        }

        setSurnameError(null);
        return true;
    };

    const validatePassword = () => {
        if (!password1) {
            setPassword1Error(ERROR_MSG_EMPTY_PASSWORD);
            return false;
        } else if (password1.length < 6) {
            setPassword1Error(ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS);
            return false;
        }

        setPassword1Error(null);
        return true;
    };

    const comparePasswords = () => {
        if (!password2) {
            setPassword2Error(ERROR_MSG_EMPTY_REPEAT_PASSWORD);
            return false;
        } else if (password1 !== password2) {
            setPassword2Error(ERROR_MSG_PASSWORD_NO_MATCH);
            return false;
        }

        setPassword2Error(null);
        return true;
    };

    const validateDate = () => {
        function calculateAge() {
            let birthdayDate = new Date(birthday);
            let todayDate = new Date();

            var age = todayDate.getFullYear() - birthdayDate.getFullYear();
            var differenceOfMonths = todayDate.getMonth() - birthdayDate.getMonth();
            if (differenceOfMonths < 0 || (differenceOfMonths === 0 && (todayDate.getDate() < (birthdayDate.getDate() + 1))))
                age--;
            return age;
        }

        if (birthday === today) {
            setBirthdayError(ERROR_MSG_EMPTY_DATE);
            return false;
        }

        if (!REGEX_DATE_YYYY_MM_DD.test(birthday)) {
            setBirthdayError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const parts = birthday.split("-");
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);

        if (year < (new Date().getFullYear() - 100) || year > (new Date().getFullYear()) || month === 0 || month > 12) {
            setBirthdayError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        if (!(day > 0 && day <= monthLength[month - 1])) {
            setBirthdayError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        if (calculateAge() < 18) {
            setBirthdayError(ERROR_MSG_INVALID_AGE);
            return false;
        }
        setBirthdayError(null);
        return true;
    };

    return (
        <div className={styles.modal}>
            <form onSubmit={mySubmitHandler} encType="multipart/form-data">
                <h2 align={'center'}>Registrarse</h2>
                <div className="row ">
                    {
                        successMessage ?
                            <Message open={options.open} type={options.type} message={options.message}
                                     handleClose={options.handleClose}/>
                            : null
                    }
                    <div>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField className={styles.inputMaterial} label="Correo electrónico" name="email"
                                           id="inpEmail"
                                           type={"email"}
                                           required
                                           inputProps={{maxLength: 70}}
                                           autoComplete='off'
                                           error={(emailError) ? true : false}
                                           helperText={(emailError) ? emailError : false}
                                           value={email}
                                           onChange={newValue => handleEmail(newValue)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial} label="Nombre" name="names" id={"inpName"}
                                           required
                                           inputProps={{maxLength: 45, style: {textTransform: 'capitalize'}}}
                                           style={{paddingRight: '10px'}}
                                           autoComplete='off'
                                           error={(namesError) ? true : false}
                                           helperText={(namesError) ? namesError : false}
                                           value={names}
                                           onChange={newValue => handleNames(newValue)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial} label="Apellido" name="surname"
                                           id="inpSurname"
                                           required
                                           inputProps={{maxLength: 45, style: {textTransform: 'capitalize'}}}
                                           style={{paddingRight: '10px', marginLeft: '10px'}}
                                           autoComplete='off'
                                           error={(surnameError) ? true : false}
                                           helperText={(surnameError) ? surnameError : false}
                                           value={surname}
                                           onChange={newValue => handleSurname(newValue)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomDatePicker
                                    label={'Fecha de nacimiento'}
                                    handleDate={handleBirthday}
                                    invalidDateMessage={birthdayError}
                                    selectedDate={birthday}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={styles.inputMaterial} required
                                             error={(password1Error) ? true : false}>
                                    <InputLabel htmlFor="password1">Contraseña</InputLabel>
                                    <Input
                                        id="password1"
                                        required
                                        inputProps={{maxLength: 100}}
                                        autoComplete='off'
                                        type={showPassword1 ? 'text' : 'password'}
                                        name="password1"
                                        value={password1}
                                        onChange={newValue => handlePassword1(newValue)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleShowPassword1}
                                                    edge="end"
                                                >
                                                    {showPassword1 ? <Visibility/> : <VisibilityOff/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>{(password1Error) ? password1Error : false}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={styles.inputMaterial}
                                             required
                                             error={(password2Error) ? true : false}>
                                    <InputLabel htmlFor="password2">Repita la contraseña</InputLabel>
                                    <Input
                                        id="password2"
                                        required
                                        inputProps={{maxLength: 100}}
                                        autoComplete='off'
                                        type={showPassword2 ? 'text' : 'password'}
                                        name="password2"
                                        value={password2}
                                        onChange={newValue => handlePassword2(newValue)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleShowPassword2}
                                                    edge="end"
                                                >
                                                    {showPassword2 ? <Visibility/> : <VisibilityOff/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>{(password2Error) ? password2Error : false}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <br/><br/>
                                <Button style={{width: '100%'}}
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        id="btnRegister"
                                        type="submit"
                                >REGISTRARSE</Button>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Register

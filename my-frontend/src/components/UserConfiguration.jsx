import React from 'react';
import { Message } from '../components/Message';
import { TextField, Button } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useStyles } from '../const/componentStyles';
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import { CustomDatePicker } from '../components/CustomDatePicker';
import moment from "moment";
import { updateUserDataValues, userConfigurationWithNewPassword, userConfigurationWitoutNewPassword } from '../api/Passengers.js';

import { BACKEND_URL } from '../const/config.js';

import {
    ERROR_MSG_EMPTY_EMAIL,
    ERROR_MSG_INVALID_EMAIL,
    ERROR_MSG_EMPTY_NAME,
    ERROR_MSG_INVALID_NAME,
    ERROR_MSG_EMPTY_SURNAME,
    ERROR_MSG_INVALID_SURNAME,
    ERROR_MSG_EMPTY_DATE,
    ERROR_MSG_INVALID_DATE,
    ERROR_MSG_INVALID_AGE,
    ERROR_MSG_EMPTY_PASSWORD,
    ERROR_MSG_EMPTY_REPEAT_PASSWORD,
    ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS,
    ERROR_MSG_PASSWORD_NO_MATCH,
    ERROR_MSG_EMPTY_ACTUAL_PASSWORD
} from '../const/messages.js';


import {
    REGEX_DATE_YYYY_MM_DD,
    REGEX_EMAIL,
    REGEX_ONLY_ALPHABETICAL,
} from '../const/regex';

import { capitalizeString } from "../helpers/strings";


const axios = require("axios");

function UserConfiguration() {
    let userData = JSON.parse(localStorage.getItem('userData'));
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const styles = useStyles();
    const [email, setEmail] = React.useState(userData.userEmail);
    const [names, setNames] = React.useState(userData.userName);
    const [surname, setSurname] = React.useState(userData.userSurname);
    const [birthday, setBirthday] = React.useState(moment(userData.userBirthday)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .format('YYYY-MM-DD')
    );
    const [newPassword1, setNewPassword1] = React.useState('');
    const [showNewPassword1, setShowNewPassword1] = React.useState(false);
    const [newPassword2, setNewPassword2] = React.useState('');
    const [showNewPassword2, setShowNewPassword2] = React.useState(false);
    const [actualPassword, setActualPassword] = React.useState('');
    const [showActualPassword, setShowActualPassword] = React.useState(false);
    const [emailError, setEmailError] = React.useState(null);
    const [namesError, setNamesError] = React.useState(null);
    const [surnameError, setSurnameError] = React.useState(null);
    const [newPassword1Error, setNewPassword1Error] = React.useState(null);
    const [newPassword2Error, setNewPassword2Error] = React.useState(null);
    const [actualPasswordError, setActualPasswordError] = React.useState(null);
    const [birthdayError, setBirthdayError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    const handleShowNewPassword1 = () => {
        setShowNewPassword1(!showNewPassword1);
    };

    const handleShowNewPassword2 = () => {
        setShowNewPassword2(!showNewPassword2);
    };

    const handleShowActualPassword = () => {
        setShowActualPassword(!showActualPassword);
    };

    const mySubmitHandler = async (event) => {
        event.preventDefault();

        if (successMessage) setSuccessMessage(null);
        if (!validate()) {
            console.log("the entries have errors, y them");
            return false;
        }

        await postRequest();
        return true;

    };

    const postRequest = async () => {
        let putResponse;
        if (!newPassword1 && !newPassword2) {
            putResponse = await userConfigurationWitoutNewPassword({
                names: capitalizeString(names),
                surname: capitalizeString(surname),
                email,
                actualPassword,
                birthday
            },
            userData.userId)
        }
        else {
            putResponse = await userConfigurationWithNewPassword({
                names: capitalizeString(names),
                surname: capitalizeString(surname),
                email,
                newPassword1,
                newPassword2,
                actualPassword,
                birthday
            },
            userData.userId)
        }
        if (putResponse?.status === 200) {
            console.log("The inputs were submitted successfully");
            if (await updateUserDataValues()) {
                setDefaultValues();
            }
            setSuccessMessage(putResponse.data);
            setOptions({
                ...options, open: true, type: 'success',
                message: putResponse.data
            });
        }
        else if (putResponse?.status === 400) {
            console.log("There was an error in the submitted entries");
            setEmailError(putResponse.data.emailError);
            setNamesError(putResponse.data.namesError);
            setSurnameError(putResponse.data.surnameError);
            setBirthdayError(putResponse.data.birthdayError);
            setNewPassword1Error(putResponse.data.passwordError1);
            setNewPassword2Error(putResponse.data.passwordError2);
            setActualPasswordError(putResponse.data.actualPasswordError);
        }
        if (putResponse?.status === 500) {
            setSuccessMessage(putResponse.data);
            setOptions({
                ...options, open: true, type: 'success',
                message: putResponse.data
            });
        }
    };

    const setDefaultValues = () => {
        userData = JSON.parse(localStorage.getItem('userData'));
        setEmail(userData.userEmail);
        setNames(userData.userName);
        setSurname(userData.userSurname);
        setBirthday(moment(userData.userBirthday)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .format('YYYY-MM-DD')
        );
        setNewPassword1('');
        setShowNewPassword1(false);
        setNewPassword2('');
        setShowNewPassword2(false);
        setActualPassword('');
        setShowActualPassword(false);
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
        if (!newValue) {
            setBirthday(null)
        } else {
            let formattedDate = newValue.format('YYYY-MM-DD');
            if (formattedDate === 'Fecha inválida') {
                setBirthday(newValue);
            } else {
                setBirthday(formattedDate);
            }
            setBirthdayError(null);
        }

        setSuccessMessage(null);
    };

    const handleNewPassword1 = (newValue) => {
        setNewPassword1(newValue.target.value);
        setSuccessMessage(null);
        setNewPassword1Error(null);
        setNewPassword2Error(null);
    };

    const handleNewPassword2 = (newValue) => {
        setNewPassword2(newValue.target.value);
        setSuccessMessage(null);
        setNewPassword1Error(null);
        setNewPassword2Error(null);
    };

    const handleActualPassword = (newValue) => {
        setActualPassword(newValue.target.value);
        setSuccessMessage(null);
        setNewPassword2Error(null);
    };

    const validate = () => {
        let validatesResult = validateEmail() & validateName() & validateSurname() & validateBirthday() & validateActualPassword();
        if (!newPassword1 && !newPassword2) {
            return validatesResult;
        }
        else {
            return validatesResult & validatePassword() & comparePasswords();
        }

    };


    const validateEmail = () => {
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
        if (!newPassword1) {
            setNewPassword1Error(ERROR_MSG_EMPTY_PASSWORD);
            return false;
        } else if (newPassword1.length < 6) {
            setNewPassword1Error(ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS);
            return false;
        }

        setNewPassword1Error(null);
        return true;
    };

    const comparePasswords = () => {
        if (!newPassword2) {
            setNewPassword2Error(ERROR_MSG_EMPTY_REPEAT_PASSWORD);
            return false;
        } else if (newPassword1 !== newPassword2) {
            setNewPassword2Error(ERROR_MSG_PASSWORD_NO_MATCH);
            return false;
        }

        setNewPassword2Error(null);
        return true;
    };

    const validateBirthday = () => {
        function calculateAge() {
            let birthdayDate = new Date(birthday);
            let todayDate = new Date();

            var age = todayDate.getFullYear() - birthdayDate.getFullYear();
            var differenceOfMonths = todayDate.getMonth() - birthdayDate.getMonth();
            if (differenceOfMonths < 0 || (differenceOfMonths === 0 && (todayDate.getDate() < (birthdayDate.getDate() + 1))))
                age--;
            return age;
        }

        if (!birthday) {
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

    const validateActualPassword = () => {
        if (!actualPassword) {
            setActualPasswordError(ERROR_MSG_EMPTY_ACTUAL_PASSWORD);
            return false;
        }
        setActualPasswordError(null);
        return true;
    };

    return (
        <div className={styles.root}>
            <form className={styles.form} onSubmit={mySubmitHandler} encType="multipart/form-data">
                <h2 align={'center'}>Editar Datos</h2>
                <div className="row ">
                    {
                        successMessage ?
                            <Message open={options.open} type={options.type} message={options.message}
                                handleClose={options.handleClose} />
                            : null
                    }
                    <div>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField className={styles.inputMaterial} label="Correo electrónico *" name="email"
                                    id="inpEmail"
                                    type={"email"}
                                    inputProps={{ maxLength: 70 }}
                                    autoComplete='off'
                                    error={(emailError) ? true : false}
                                    helperText={(emailError) ? emailError : false}
                                    value={email}
                                    onChange={newValue => handleEmail(newValue)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial} label="Nombre *" name="names" id={"inpName"}
                                    inputProps={{ maxLength: 45, style: { textTransform: 'capitalize' } }}
                                    style={{ paddingRight: '10px' }}
                                    autoComplete='off'
                                    error={(namesError) ? true : false}
                                    helperText={(namesError) ? namesError : false}
                                    value={names}
                                    onChange={newValue => handleNames(newValue)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial} label="Apellido *" name="surname"
                                    id="inpSurname"
                                    inputProps={{ maxLength: 45, style: { textTransform: 'capitalize' } }}
                                    style={{ paddingRight: '10px', marginLeft: '10px' }}
                                    autoComplete='off'
                                    error={(surnameError) ? true : false}
                                    helperText={(surnameError) ? surnameError : false}
                                    value={surname}
                                    onChange={newValue => handleSurname(newValue)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomDatePicker
                                    underlineDisabled={false}
                                    label={'Fecha de nacimiento *'}
                                    handleDate={handleBirthday}
                                    invalidDateMessage={birthdayError}
                                    selectedDate={birthday}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={styles.inputMaterial}
                                    error={(newPassword1Error) ? true : false}>
                                    <InputLabel htmlFor="NewPassword1">Nueva contraseña *</InputLabel>
                                    <Input
                                        id="newPassword1"
                                        inputProps={{ maxLength: 100 }}
                                        autoComplete='off'
                                        type={showNewPassword1 ? 'text' : 'password'}
                                        name="newPassword1"
                                        value={newPassword1}
                                        onChange={newValue => handleNewPassword1(newValue)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleShowNewPassword1}
                                                    edge="end"
                                                >
                                                    {showNewPassword1 ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>{(newPassword1Error) ? newPassword1Error : false}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={styles.inputMaterial}
                                    error={(newPassword2Error) ? true : false}>
                                    <InputLabel htmlFor="newPassword2">Repita la nueva contraseña *</InputLabel>
                                    <Input
                                        id="newPassword2"
                                        inputProps={{ maxLength: 100 }}
                                        autoComplete='off'
                                        type={showNewPassword2 ? 'text' : 'password'}
                                        name="newPassword2"
                                        value={newPassword2}
                                        onChange={newValue => handleNewPassword2(newValue)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleShowNewPassword2}
                                                    edge="end"
                                                >
                                                    {showNewPassword2 ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>{(newPassword2Error) ? newPassword2Error : false}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={styles.inputMaterial}
                                    error={(actualPasswordError) ? true : false}>
                                    <InputLabel htmlFor="actualPassword">Contraseña actual</InputLabel>
                                    <Input
                                        id="actualPassword"
                                        inputProps={{ maxLength: 100 }}
                                        autoComplete='off'
                                        type={showActualPassword ? 'text' : 'password'}
                                        name="actualPassword"
                                        value={actualPassword}
                                        onChange={newValue => handleActualPassword(newValue)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleShowActualPassword}
                                                    edge="end"
                                                >
                                                    {showActualPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>{(actualPasswordError) ? actualPasswordError : false}</FormHelperText>
                                </FormControl>
                                <FormHelperText>
                                    Ingrese su contraseña actual para confirmar los cambios
                                </FormHelperText>
                            </Grid>
                            <Grid item xs={12}>
                                <br /><br />
                                <Button style={{ width: '100%' }}
                                    variant="contained"
                                    size="large"
                                    color="primary"
                                    id="btnRegister"
                                    type="submit"
                                >EDITAR DATOS</Button>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </form>
            <br /><br />
        </div>
    );
}

export default UserConfiguration

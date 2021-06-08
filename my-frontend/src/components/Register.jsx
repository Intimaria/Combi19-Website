import React from 'react';
import { useHistory } from "react-router-dom";
import { Message } from '../components/Message';
import { TextField, Button } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import { Favorite, FavoriteBorder, Visibility, VisibilityOff } from "@material-ui/icons";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useStyles } from '../const/componentStyles';
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Link from '@material-ui/core/Link';
import { green } from '@material-ui/core/colors';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import moment from "moment";

import {
    login,
    register
} from "../api/Passengers.js";

import { CustomDatePicker } from '../components/CustomDatePicker';
import { CardPaymentForm } from '../components/CardPaymentForm';

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
    ERROR_MSG_EMPTY_TYPE_CARD,
    ERROR_MSG_EMPTY_CARD_NUMBER,
    ERROR_MSG_INVALID_CARD_NUMBER,
    ERROR_MSG_DEBIT_CARD,
    ERROR_MSG_DISABLED_CARD,
    ERROR_MSG_INSUFFICIENT_AMOUNT,
    ERROR_MSG_EMPTY_SECURITY_CODE,
    ERROR_MSG_INVALID_SECURITY_CODE,
    ERROR_MSG_WRONG_SECURITY_CODE,
    ERROR_MSG_EMPTY_EXPIRATION_DATE,
    ERROR_MSG_INVALID_EXPIRATION_DATE,
    ERROR_MSG_OVERDUE_EXPIRATION_DATE,
    ERROR_MSG_EMPTY_NAME_SURNAME_CARD_OWNER,
    ERROR_MSG_INVALID_NAME_SURNAME_CARD_OWNER,
    ERROR_MSG_EMPTY_DOCUMENT_NUMBER_CARD_OWNER,
    ERROR_MSG_INVALID_DOCUMENT_NUMBER_CARD_OWNER,
    ERROR_MSG_API_REGISTRATION,
    ERROR_MSG_INTERNET
} from '../const/messages.js';


import {
    REGEX_DATE_YYYY_MM_DD,
    REGEX_DATE_MM_YY,
    REGEX_EMAIL,
    REGEX_ONLY_ALPHABETICAL,
    REGEX_ONLY_NUMBER
} from '../const/regex';

import { capitalizeString } from "../helpers/strings";


const axios = require("axios");

function Register({redirectPage}) {

    const history = useHistory();

    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const styles = useStyles();
    const [email, setEmail] = React.useState('');
    const [names, setNames] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [birthday, setBirthday] = React.useState(moment()
        .subtract(18, "years")
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .format('YYYY-MM-DD')
    );
    const [password1, setPassword1] = React.useState('');
    const [showPassword1, setShowPassword1] = React.useState(false);
    const [password2, setPassword2] = React.useState('');
    const [showPassword2, setShowPassword2] = React.useState(false);
    const [goldCheck, setGoldCheck] = React.useState(false);
    const [typeCardSelected, setTypeCardSelected] = React.useState('');
    const [cardNumber, setCardNumber] = React.useState('');
    const [securityCode, setSecurityCode] = React.useState('');
    const [expirationDate, setExpirationDate] = React.useState(moment().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    }));
    const [nameSurnameCardOwner, setNameSurnameCardOwner] = React.useState('');
    const [documentNumberCardOwner, setDocumentNumberCardOwner] = React.useState('');
    const [emailError, setEmailError] = React.useState(null);
    const [namesError, setNamesError] = React.useState(null);
    const [surnameError, setSurnameError] = React.useState(null);
    const [password1Error, setPassword1Error] = React.useState(null);
    const [password2Error, setPassword2Error] = React.useState(null);
    const [birthdayError, setBirthdayError] = React.useState(null);
    const [typeCardSelectedError, setTypeCardSelectedError] = React.useState(null);
    const [cardNumberError, setCardNumberError] = React.useState(null);
    const [securityCodeError, setSecurityCodeError] = React.useState(null);
    const [expirationDateError, setExpirationDateError] = React.useState(null);
    const [nameSurnameCardOwnerError, setNameSurnameCardOwnerError] = React.useState(null);
    const [documentNumberCardOwnerError, setDocumentNumberCardOwnerError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    const handleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
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
        const DataToRegister = {
            names: capitalizeString(names),
            surname: capitalizeString(surname),
            email,
            password1,
            password2,
            birthday,
            goldCheck,
            typeCardSelected,
            cardNumber,
            securityCode,
            expirationDate: expirationDate.format('MM/YY'),
            nameSurnameCardOwner: nameSurnameCardOwner.toUpperCase(),
            documentNumberCardOwner
        };

        const registerRequest = await register(DataToRegister);

        if (registerRequest?.status === 201) {
            console.log("The inputs were submitted successfully");
            setDefaultValues();
            
            let loginRequest = await login(DataToRegister.email, DataToRegister.password1, 'login');
            if (loginRequest?.status === 200) {
                localStorage.setItem('token', loginRequest.data.token);
                localStorage.setItem('userData', JSON.stringify(loginRequest.data.userData));
                history.push(redirectPage);
            }
            else if (loginRequest?.status === 400) {
                console.log("There was an error in the submitted entries");
            };
        }
        else if (registerRequest?.status === 400) {
            console.log("There was an error in the submitted entries");
            setEmailError(registerRequest.data.emailError);
            setNamesError(registerRequest.data.namesError);
            setSurnameError(registerRequest.data.surnameError);
            setBirthdayError(registerRequest.data.birthdayError);
            setPassword1Error(registerRequest.data.passwordError1);
            setPassword2Error(registerRequest.data.passwordError2);
        }
        else if (registerRequest?.status === 500) {
            setSuccessMessage(`Ha ocurrido un error ${registerRequest}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `Ha ocurrido un error ${registerRequest}`
            });
        }
    };

    const setDefaultValues = () => {
        setEmail('');
        setNames('');
        setSurname('');
        setBirthday(moment()
            .subtract(18, "years")
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .format('YYYY-MM-DD')
        );
        setPassword1('');
        setShowPassword1(false);
        setPassword2('');
        setShowPassword2(false);
        setGoldCheck(false);
        setTypeCardSelected('');
        setCardNumber('');
        setSecurityCode('');
        setExpirationDate(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
        setNameSurnameCardOwner('');
        setDocumentNumberCardOwner('');
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

    const handleGoldCheck = () => {
        setGoldCheck(!goldCheck);
        setSuccessMessage(null);
    };

    const handleBeGold = () => {
        setGoldCheck(true);
        setSuccessMessage(null);
    };

    const handleTypeCard = (newValue) => {
        setTypeCardSelected(newValue.target.value);
        setSuccessMessage(null);
        setTypeCardSelectedError(false);
    };

    const handleCardNumber = (newValue) => {
        setCardNumber(newValue.target.value);
        setSuccessMessage(null);
        setCardNumberError(null);
    };

    const handleSecurityCode = (newValue) => {
        setSecurityCode(newValue.target.value);
        setSuccessMessage(null);
        setSecurityCodeError(null);
    };

    const handleExpirationDate = (newValue) => {
        if (!newValue) {
            setExpirationDate(null)
        } else {
            setExpirationDate(newValue);
            setExpirationDateError(null);
        }

        setSuccessMessage(null);
    };

    const handleNameSurnameCardOwner = (newValue) => {
        setNameSurnameCardOwner(newValue.target.value);
        setSuccessMessage(null);
        setNameSurnameCardOwnerError(null);
    };

    const handleDocumentNumberCardOwner = (newValue) => {
        setDocumentNumberCardOwner(newValue.target.value);
        setSuccessMessage(null);
        setDocumentNumberCardOwnerError(null);
    };

    const validate = () => {
        let resultValidations = validateEmail() & validateName() & validateSurname() & validatePassword() & comparePasswords() & validateBirthday();
        if (goldCheck) {
            return resultValidations & validateCard();
        } else {
            return resultValidations;
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

    const validateCard = () => {
        let resultValidateTypeCard = true,
            resultValidateCardNumber = true,
            resultValidateSecurityCode = true,
            resultValidateExpirationDate = true,
            resultValidateNameSurnameCardOwner = true,
            resultValidateDocumentNumberCardOwner = true;

        if (!typeCardSelected || typeCardSelected === 0) {
            setTypeCardSelectedError(ERROR_MSG_EMPTY_TYPE_CARD);
            resultValidateTypeCard = false;
        }

        if (!cardNumber) {
            setCardNumberError(ERROR_MSG_EMPTY_CARD_NUMBER);
            resultValidateCardNumber = false;
        }

        if (!securityCode) {
            setSecurityCodeError(ERROR_MSG_EMPTY_SECURITY_CODE);
            resultValidateSecurityCode = false;
        }

        if (!expirationDate) {
            setExpirationDateError(ERROR_MSG_EMPTY_EXPIRATION_DATE);
            resultValidateExpirationDate = false;
        }

        if (!nameSurnameCardOwner) {
            setNameSurnameCardOwnerError(ERROR_MSG_EMPTY_NAME_SURNAME_CARD_OWNER);
            resultValidateNameSurnameCardOwner = false;
        }

        if (!documentNumberCardOwner) {
            setDocumentNumberCardOwnerError(ERROR_MSG_EMPTY_DOCUMENT_NUMBER_CARD_OWNER);
            resultValidateDocumentNumberCardOwner = false;
        }

        if (resultValidateTypeCard & resultValidateCardNumber & resultValidateSecurityCode & resultValidateExpirationDate & resultValidateNameSurnameCardOwner & resultValidateDocumentNumberCardOwner) {
            return validateTypeCard() & validateCardNumber() & validateSecurityCode() & validateExpirationDate() & validateNameSurnameCardOwner() & validateDocumentNumberCardOwner();
        } else {
            return false;
        }
    };

    const validateTypeCard = () => {
        setTypeCardSelectedError(null);
        return true;
    };

    const validateCardNumber = () => {
        if (!REGEX_ONLY_NUMBER.test(cardNumber)) {
            setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
            return false;
        }

        if (cardNumber.length < 15) {
            setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
            return false;
        }

        if (typeCardSelected === 1) {
            if (cardNumber.length !== 15) {
                setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
                return false;
            }
            if (securityCode.length !== 4) {
                setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
                return false;
            }
        }

        if (typeCardSelected === 2 || typeCardSelected === 3) {
            if (cardNumber.length !== 16) {
                setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
                return false;
            }
            if (securityCode.length !== 3) {
                setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
                return false;
            }
        }

        if (cardNumber === '1111111111111111') {
            setCardNumberError(ERROR_MSG_DEBIT_CARD);
            return false;
        }

        if (cardNumber === '2222222222222222') {
            setCardNumberError(ERROR_MSG_DISABLED_CARD);
            return false;
        }

        if (cardNumber === '3333333333333333') {
            setCardNumberError(ERROR_MSG_INSUFFICIENT_AMOUNT);
            return false;
        }

        setCardNumberError(null);
        return true;

    };

    const validateSecurityCode = () => {
        if (!REGEX_ONLY_NUMBER.test(securityCode)) {
            setSecurityCodeError(ERROR_MSG_INVALID_SECURITY_CODE);
            return false;
        }

        if (cardNumber === '4444444444444444') {
            setSecurityCodeError(ERROR_MSG_WRONG_SECURITY_CODE);
            return false;
        }

        setSecurityCodeError(null);
        return true;
    };

    const validateExpirationDate = () => {
        if (!REGEX_DATE_MM_YY.test(expirationDate.format('MM/YY'))) {
            setExpirationDateError(ERROR_MSG_INVALID_EXPIRATION_DATE);
            return false;
        }

        if (expirationDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) < moment().set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        })) {
            setExpirationDateError(ERROR_MSG_OVERDUE_EXPIRATION_DATE);
            return false;
        }

        setExpirationDateError(null);
        return true;
    };

    const validateNameSurnameCardOwner = () => {
        if (!REGEX_ONLY_ALPHABETICAL.test(nameSurnameCardOwner)) {
            setNameSurnameCardOwnerError(ERROR_MSG_INVALID_NAME_SURNAME_CARD_OWNER);
            return false;
        }

        if (cardNumber === '5555555555555555') {
            setNameSurnameCardOwnerError(ERROR_MSG_INVALID_NAME_SURNAME_CARD_OWNER);
            return false;
        }

        setNameSurnameCardOwnerError(null);
        return true;
    };

    const validateDocumentNumberCardOwner = () => {
        if (!REGEX_ONLY_NUMBER.test(documentNumberCardOwner)) {
            setDocumentNumberCardOwnerError(ERROR_MSG_INVALID_DOCUMENT_NUMBER_CARD_OWNER);
            return false;
        }

        if (cardNumber === '6666666666666666') {
            setDocumentNumberCardOwnerError(ERROR_MSG_INVALID_DOCUMENT_NUMBER_CARD_OWNER);
            return false;
        }

        setDocumentNumberCardOwnerError(null);
        return true;
    };

    return (
        <div className={styles.root}>
            <form className={styles.form} onSubmit={mySubmitHandler} encType="multipart/form-data">
                <h2 align={'center'}>Registrarse</h2>
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
                                    futureDisabled={true}
                                    pastDisabled={false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={styles.inputMaterial}
                                    error={(password1Error) ? true : false}>
                                    <InputLabel htmlFor="password1">Contraseña *</InputLabel>
                                    <Input
                                        id="password1"
                                        inputProps={{ maxLength: 100 }}
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
                                                    {showPassword1 ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>{(password1Error) ? password1Error : false}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={styles.inputMaterial}
                                    error={(password2Error) ? true : false}>
                                    <InputLabel htmlFor="password2">Repita la contraseña *</InputLabel>
                                    <Input
                                        id="password2"
                                        inputProps={{ maxLength: 100 }}
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
                                                    {showPassword2 ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>{(password2Error) ? password2Error : false}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox icon={<FavoriteBorder />}
                                        checkedIcon={<Favorite />}
                                        checked={goldCheck}
                                        onChange={() => handleGoldCheck()}
                                        name="goldCheck"
                                        id={"goldCheck"}
                                    />}
                                    label="¡Quiero ser miembro GOLD!"
                                />
                                <Link href="#mas-info" fontSize={"small"}>
                                    ¡Más info!
                                </Link>
                            </Grid>

                            {
                                goldCheck ?
                                    <CardPaymentForm
                                        goldCheck={goldCheck}

                                        typeCardSelected={typeCardSelected}
                                        cardNumber={cardNumber}
                                        securityCode={securityCode}
                                        expirationDate={expirationDate}
                                        nameSurnameCardOwner={nameSurnameCardOwner}
                                        documentNumberCardOwner={documentNumberCardOwner}

                                        handleTypeCard={handleTypeCard}
                                        handleCardNumber={handleCardNumber}
                                        handleSecurityCode={handleSecurityCode}
                                        handleExpirationDate={handleExpirationDate}
                                        handleNameSurnameCardOwner={handleNameSurnameCardOwner}
                                        handleDocumentNumberCardOwner={handleDocumentNumberCardOwner}

                                        typeCardSelectedError={typeCardSelectedError}
                                        cardNumberError={cardNumberError}
                                        securityCodeError={securityCodeError}
                                        expirationDateError={expirationDateError}
                                        nameSurnameCardOwnerError={nameSurnameCardOwnerError}
                                        documentNumberCardOwnerError={documentNumberCardOwnerError}
                                    />
                                    : null
                            }


                            <Grid item xs={12}>
                                <br /><br />
                                <Button style={{ width: '100%' }}
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
            <br /><br />
            <Card id="mas-info" className={styles.cardGold.root}>
                <CardHeader align="center" title="Membresía GOLD" className={styles.cardGold.header} />
                <Divider variant="middle" />
                <CardContent>
                    <Typography variant="h4" align="center">
                        $ 250,00
                    </Typography>
                    <Typography align={'center'} fontSize={'small'}>Sólo se aceptan tarjeta de crédito</Typography>
                    <Divider variant="middle" />
                    <div className={styles.cardGold.list}>
                        <Typography><CheckCircleIcon style={{ color: green[500] }} />¡
                            Descuento del 10% en todos tus viajes
                            !</Typography>
                        <Typography><CheckCircleIcon style={{ color: green[500] }} />
                            Precarga de datos para que no pierdas el tiempo
                        </Typography>
                    </div>
                </CardContent>
                <Divider variant="middle" />
                <CardActions className={styles.cardGold.action}>
                    <Link href="#goldCheck" style={{ width: '100%' }}>
                        <Button className={styles.cardGold.button}
                            style={{ width: '100%' }}
                            variant="contained"
                            size="large"
                            color="primary"
                            id="btnGoToCard"
                            onClick={() => handleBeGold()}
                        >¡QUIERO SER GOLD!</Button>
                    </Link>
                </CardActions>

            </Card>
        </div>
    );
}

export default Register

import React from 'react';
import { Message } from '../components/Message';

import { BACKEND_URL } from '../const/config.js';

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
    ERROR_MSG_INVALID_PASSWORD_NO_CAPITAL_LETTERS,
    ERROR_MSG_INVALID_PASSWORD_NO_LOWER_CASE,
    ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS,
    ERROR_MSG_PASSWORD_NO_MATCH,
    ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS,
    ERROR_MSG_INVALID_SURNAME
} from '../const/messages.js';

import {
    REGEX_DATE_YYYY_MM_DD,
    REGEX_EMAIL,
    REGEX_ONLY_ALPHABETICAL
} from '../const/regex.js';


const axios = require("axios");
function Register() {
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };


    const today = new Date().toISOString().slice(0, 10);
    const [showPassword1, setShowPassword1] = React.useState(false);
    const [showPassword2, setShowPassword2] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [names, setNames] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [password1, setPassword1] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [birthday, setBirthday] = React.useState('');
    const [emailError, setEmailError] = React.useState(null);
    const [namesError, setNamesError] = React.useState(null);
    const [surnameError, setSurnameError] = React.useState(null);
    const [password1Error, setPassword1Error] = React.useState(null);
    const [password2Error, setPassword2Error] = React.useState(null);
    const [birthdayError, setBirthdayError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    const handleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    }
    const handleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    }
    const mySubmitHandler = (event) => {
        event.preventDefault();

        if (successMessage) setSuccessMessage(null);
        if (!validate()) {
            console.log("the entries have errors, modify them");
            return false;
        }

        postRequest();
        return true;

    }
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
    }

    const setDefaultValues = () => {
        setEmail('');
        setNames('');
        setSurname('');
        setBirthday('');
        setPassword1('');
        setPassword1('');
        setPassword2('');
    };

    const handleEmail = (newValue) => {
        setEmail(newValue.target.value);
        setSuccessMessage(null);
        setEmailError(null);
    }

    const handleNames = (newValue) => {
        setNames(newValue.target.value);
        setSuccessMessage(null);
        setNamesError(null);
    }

    const handleSurname = (newValue) => {
        setSurname(newValue.target.value);
        setSuccessMessage(null);
        setSurnameError(null);
    }

    const handleBirthday = (newValue) => {
        setBirthday(newValue.target.value);
        setSuccessMessage(null);
        setBirthdayError(null);
    }

    const handlePassword1 = (newValue) => {
        setPassword1(newValue.target.value);
        setSuccessMessage(null);
        setPassword1Error(null);
    }

    const handlePassword2 = (newValue) => {
        setPassword2(newValue.target.value);
        setSuccessMessage(null);
        setPassword2Error(null);
    }

    const validate = () => {
        return validateEmail() & validateName() & validateSurname() & validatePassword() & comparePasswords() & validateDate();
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
    }

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
    }
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
    }

    const validatePassword = () => {
        const reg1 = /[1-9]/;
        /*const reg2 = /[A-Z]/;
        const reg3 = /[a-z]/;*/

        if (!password1) {
            setPassword1Error(ERROR_MSG_EMPTY_PASSWORD);
            return false;
        } else if (password1.length < 6) {
            setPassword1Error(ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS);
            return false;
        } else if (!reg1.test(password1)) {
            setPassword1Error(ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS);
            return false;
        }/* else if (!reg2.test(password1)) {
            setPassword1Error(ERROR_MSG_INVALID_NO_CAPITAL_LETTERS);
            return false;
        } else if (!reg3.test(password1)) {
            setPassword1Error(ERROR_MSG_INVALID_NO_LOWER_CASE);
            return false;
        } */

        setPassword1Error(null);
        return true;
    }

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
    }

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
    }

    return (
        <div className="container w-50 bg-dark pb-3 rounded">
            <form onSubmit={mySubmitHandler} encType="multipart/form-data">
                <h2 className="text-light">Registrarse</h2>
                <div className="row ">
                    {
                        successMessage ?
                            <Message open={options.open} type={options.type} message={options.message}
                                handleClose={options.handleClose} />
                            : null
                    }
                    <div className="col-md">
                        <input id="inpEmail" type="email" className="form-control mt-3" name="email"
                            placeholder="Email" maxLength="70"
                            value={email} onChange={newValue => handleEmail(newValue)} />
                        {
                            emailError ? <span className="text-danger small">{emailError}</span> :
                                <span className="text-danger small">&nbsp;</span>
                        }
                    </div>
                    <div className="w-100"></div>
                    <div className="col-md">
                        <input id="inpName" type="text" className="form-control mt-3" name="names"
                            placeholder="Nombre" maxLength="45"
                            value={names} onChange={newValue => handleNames(newValue)} />
                        {
                            namesError ? <span className="text-danger small">{namesError}</span> :
                                <span className="text-danger small">&nbsp;</span>
                        }
                    </div>
                    <div className="col-md">
                        <input id="inpApellido" type="text" className="form-control mt-3" name="surname"
                            placeholder="Apellido" maxLength="45" value={surname}
                            onChange={newValue => handleSurname(newValue)} />
                        {
                            surnameError ? <span className="text-danger small">{surnameError}</span> :
                                <span className="text-danger small">&nbsp;</span>
                        }
                    </div>
                    <div className="w-100"></div>
                    <div className="col-md">
                        <div className="d-flex justify-content-between">
                            <label htmlFor="birthday" className="text-light mt-3">Fecha de nacimiento</label>
                        </div>
                        <input id="inpBirthday" type="date" className="form-control" name="birthday" value={birthday}
                            onChange={newValue => handleBirthday(newValue)}></input>
                        {
                            birthdayError ? <span className="text-danger small">{birthdayError}</span> :
                                <span className="text-danger small">&nbsp;</span>
                        }
                    </div>
                    <div className="w-100"></div>
                    <div className="col-md">
                        <input id="inpPassword" type={showPassword1 ? "text" : "password"} className="form-control mt-3" name="password1"
                            placeholder="Contraseña" maxLength="30" value={password1}
                            onChange={newValue => handlePassword1(newValue)} />

                    </div>
                    <div className="col-md">
                        <input id="inpRepeatPassword" type={showPassword2 ? "text" : "password"} className="form-control mt-3" name="password2"
                            placeholder="Repita la contraseña" maxLength="30" value={password2}
                            onChange={newValue => handlePassword2(newValue)} />

                    </div>
                    <div className="w-100"></div>
                    <label className="text-light w-50">
                        Mostrar contraseña: <input type="checkbox" key="inpPassword" onChange={() => handleShowPassword1()}/>
                    </label>
                    <label className="text-light w-50">
                        Mostrar contraseña: <input type="checkbox" key="inpRepeatPassword" onChange={() => handleShowPassword2()}/>
                    </label>
                    <div className="w-100"></div>
                    {
                        password1Error ? <span className="text-danger small w-50">{password1Error}</span> :
                            <span className="text-danger small w-50">&nbsp;</span>
                    }
                    {
                        password2Error ? <span className="text-danger small w-50">{password2Error}</span> :
                            <span className="text-danger small w-50">&nbsp;</span>
                    }
                    <div className="text-center">
                        <input id="btnRegister" type="submit" value="Registrarse"
                            className="btn btn-primary w-50 mt-3" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Register

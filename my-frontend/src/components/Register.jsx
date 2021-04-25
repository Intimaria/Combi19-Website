import React from 'react';
import {Message} from '../components/Message';

const axios = require("axios");

function Register() {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };


    const today = new Date().toISOString().slice(0, 10);
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
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

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
        axios.post('http://localhost:3001/register', {
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
        const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!email) {
            setEmailError("Ingrese un correo");
            return false;
        }
        if (!reg.test(email)) {
            setEmailError("Ingrese un correo con un formato válido");
            return false;
        }

        setEmailError(null);
        return true;
    }

    const validateName = () => {
        const reg = /[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\s]/;

        if (!names) {
            setNamesError("Ingrese un nombre");
            return false;
        } else if (reg.test(names)) {
            setNamesError("El nombre debe poseer solo caracteres alfabéticos");
            return false;
        }

        setNamesError(null);
        return true;
    }
    const validateSurname = () => {
        const reg = /[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\s]/;

        if (!surname) {
            setSurnameError("Ingrese un apellido");
            return false;
        } else if (reg.test(surname)) {
            setSurnameError("El apellido debe poseer solo caracteres alfabéticos");
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
            setPassword1Error("Ingrese una contraseña");
            return false;
        } else if (password1.length < 6) {
            setPassword1Error("La contraseña debe tener mas de 6 caracteres");
            return false;
        } else if (!reg1.test(password1)) {
            setPassword1Error("La contraseña no posee números");
            return false;
        }/* else if (!reg2.test(password1)) {
            setPassword1Error("La contraseña no posee letras mayúsculas");
            return false;
        } else if (!reg3.test(password1)) {
            setPassword1Error("La contraseña no posee letras minúsculas");
            return false;
        } */

        setPassword1Error(null);
        return true;
    }

    const comparePasswords = () => {
        if (!password2) {
            setPassword2Error("Ingrese la contraseña nuevamente");
            return false;
        } else if (password1 !== password2) {
            setPassword2Error("Las contraseñas no coinciden");
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
            setBirthdayError("Ingrese una fecha");
            return false;
        }

        const reg = /^\d{4}[./-]\d{1,2}[./-]\d{1,2}$/;
        if (!reg.test(birthday)) {
            setBirthdayError("Ingrese una fecha válida");
            return false;
        }

        const parts = birthday.split("-");
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);

        if (year < (new Date().getFullYear() - 100) || year > (new Date().getFullYear()) || month === 0 || month > 12) {
            setBirthdayError("La fecha ingresada es inválida");
            return false;
        }

        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        if (!(day > 0 && day <= monthLength[month - 1])) {
            setBirthdayError("La fecha ingresada es ináalida");
            return false;
        }

        if (calculateAge() < 18) {
            setBirthdayError("Debe ser mayor a 18 años");
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
                                     handleClose={options.handleClose}/>
                            : null
                    }
                    <div className="col-md">
                        <input id="inpEmail" type="email" className="form-control mt-3" name="email"
                               placeholder="Email" maxLength="70"
                               value={email} onChange={newValue => handleEmail(newValue)}/>
                        {
                            emailError ? <span className="text-danger small">{emailError}</span> :
                                <span className="text-danger small">&nbsp;</span>
                        }
                    </div>
                    <div className="w-100"></div>
                    <div className="col-md">
                        <input id="inpName" type="text" className="form-control mt-3" name="names"
                               placeholder="Nombre" maxLength="45"
                               value={names} onChange={newValue => handleNames(newValue)}/>
                        {
                            namesError ? <span className="text-danger small">{namesError}</span> :
                                <span className="text-danger small">&nbsp;</span>
                        }
                    </div>
                    <div className="col-md">
                        <input id="inpApellido" type="text" className="form-control mt-3" name="surname"
                               placeholder="Apellido" maxLength="45" value={surname}
                               onChange={newValue => handleSurname(newValue)}/>
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
                        <input id="inpBirthday" type="date" className="form-control" name="birthday"
                               onChange={newValue => handleBirthday(newValue)}></input>
                        {
                            birthdayError ? <span className="text-danger small">{birthdayError}</span> :
                                <span className="text-danger small">&nbsp;</span>
                        }
                    </div>
                    <div className="w-100"></div>
                    <div className="col-md">
                        <input id="inpPassword" type="password" className="form-control mt-3" name="password1"
                               placeholder="Contraseña" maxLength="30" value={password1}
                               onChange={newValue => handlePassword1(newValue)}/>
                        {
                            password1Error ? <span className="text-danger small">{password1Error}</span> :
                                <span className="text-danger small">&nbsp;</span>
                        }
                    </div>
                    <div className="col-md">
                        <input id="inpRepeatPassword" type="password" className="form-control mt-3" name="password2"
                               placeholder="Repita la contraseña" maxLength="30" value={password2}
                               onChange={newValue => handlePassword2(newValue)}/>
                        {
                            password2Error ? <span className="text-danger small">{password2Error}</span> :
                                <span className="text-danger small">&nbsp;</span>
                        }
                    </div>
                    <div className="w-100"></div>
                    <div className="text-center">
                        <input id="btnRegister" type="submit" value="Registrarse"
                               className="btn btn-primary w-50 mt-3"/>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Register

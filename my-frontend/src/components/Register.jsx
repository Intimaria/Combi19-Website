import React from 'react';

const axios = require("axios");
function Register() {
    const today = new Date().toISOString().slice(0, 10);
    const [email, setEmail] = React.useState('');
    const [names, setNames] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [password1, setPassword1] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [birthday, setBirthday] = React.useState(today);
    const [emailError, setEmailError] = React.useState(null);
    const [namesError, setNamesError] = React.useState(null);
    const [surnameError, setSurnameError] = React.useState(null);
    const [passwordError1, setPasswordError1] = React.useState(null);
    const [passwordError2, setPasswordError2] = React.useState(null);
    const [birthdayError, setBirthdayError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);

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
            })
            .catch((error) => {
                console.log("There was an error in the submitted entries");
                setEmailError(error.response.data.emailError);
                setNamesError(error.response.data.namesError);
                setSurnameError(error.response.data.surnameError);
                setBirthdayError(error.response.data.birthdayError);
                setPasswordError1(error.response.data.passwordError1);
                setPasswordError2(error.response.data.passwordError2);
            });
    }

    const setDefaultValues = () => {
        setNames('');
        setSurname('');
        setEmail('');
        setBirthday(today);
        setPassword1('');
        setPassword1('');
        setPassword2('');
    };

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
            setEmailError("Ingrese un correo con un formato valido");
            return false;
        }

        setEmailError(null);
        return true;
    }

    const validateName = () => {
        const reg = /[^a-zA-Z\s]/;

        if (!names) {
            setNamesError("Ingrese un nombre");
            return false;
        } else if (reg.test(names)) {
            setNamesError("El nombre debe poseer solo caracteres alfabeticos");
            return false;
        }

        setNamesError(null);
        return true;
    }
    const validateSurname = () => {
        const reg = /[^a-zA-Z\s]/;

        if (!surname) {
            setSurnameError("Ingrese un apellido");
            return false;
        } else if (reg.test(surname)) {
            setSurnameError("El apellido debe poseer solo caracteres alfabeticos");
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
            setPasswordError1("Ingrese una contraseña");
            return false;
        } else if (password1.length < 6) {
            setPasswordError1("La contraseña debe tener mas de 6 caracteres");
            return false;
        } else if (!reg1.test(password1)) {
            setPasswordError1("La contraseña no posee numeros");
            return false;
        }/* else if (!reg2.test(password1)) {
            setPasswordError1("La contraseña no posee letras mayusculas");
            return false;
        } else if (!reg3.test(password1)) {
            setPasswordError1("La contraseña no posee letras minusculas");
            return false;
        } */

        setPasswordError1(null);
        return true;
    }

    const comparePasswords = () => {
        if (!password2) {
            setPasswordError2("Ingrese la contraseña nuevamente");
            return false;
        } else if (password1 !== password2) {
            setPasswordError2("Las contraseñas no coinciden");
            return false;
        }

        setPasswordError2(null);
        return true;
    }

    const validateDate = () => {
        function calculateAge() {
            let birthdayDate = new Date(birthday);
            let todayDate = new Date();
            var age = todayDate.getFullYear() - birthdayDate.getFullYear();
            var differenceOfMonths = todayDate.getMonth() - birthdayDate.getMonth();
            if (differenceOfMonths < 0 || (differenceOfMonths === 0 && (todayDate.getDate() < (birthdayDate.getDate()+ 1))))
                age--;
            return age;
        }

        if (birthday === today) {
            setBirthdayError("Ingrese una fecha");
            return false;
        }

        const reg = /^\d{4}[./-]\d{1,2}[./-]\d{1,2}$/;
        if (!reg.test(birthday)) {
            setBirthdayError("Ingrese un formato valido");
            return false;
        }

        const parts = birthday.split("-");
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);

        if (year < (new Date().getFullYear() - 100) || year > (new Date().getFullYear()) || month === 0 || month > 12) {
            setBirthdayError("La fecha ingresada es invalida");
            return false;
        }

        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        if (!(day > 0 && day <= monthLength[month - 1])) {
            setBirthdayError("La fecha ingresada es invalida");
            return false;
        }

        if (calculateAge() < 18) {
            setBirthdayError("El usuario debe ser mayor a 18 años");
            return false;
        }
        setBirthdayError(null);
        return true;
    }

    return (
        <div className="container w-50 bg-dark pb-3 rounded">
            <form onSubmit={mySubmitHandler} encType="multipart/form-data" className="">
                <h2 className="text-light">Registrarse</h2>
                <div className="row ">
                    {
                        successMessage ? <span className="text-success">{successMessage}</span> : null
                    }
                    <div className="col-md">
                        {
                            emailError ? <span className="text-danger">{emailError}</span> : null
                        }
                        <input type="text" className="form-control mb-3" name="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="w-100"></div>
                    <div className="col-md">
                        {
                            namesError ? <span className="text-danger">{namesError}</span> : null
                        }
                        <input type="text" className="form-control mb-3" name="names" placeholder="Nombre" value={names} onChange={e => setNames(e.target.value)} />
                    </div>
                    <div className="col-md">
                        {
                            surnameError ? <span className="text-danger">{surnameError}</span> : null
                        }
                        <input type="text" className="form-control mb-3" name="surname" placeholder="Apellido" value={surname} onChange={e => setSurname(e.target.value)} />
                    </div>
                    <div className="w-100"></div>
                    <div className="col-md">
                        <div className="d-flex justify-content-between">
                            <label htmlFor="birthday" className="text-light">Fecha de nacimiento</label>
                            {
                                birthdayError ? <span className="text-danger ">{birthdayError}</span> : null
                            }
                        </div>
                        <input type="date" className="form-control mb-3" name="birthday" value={birthday} onChange={e => setBirthday(e.target.value)}></input>
                    </div>
                    <div className="w-100"></div>
                    <div className="col-md">
                        {
                            passwordError1 ? <span className="text-danger">{passwordError1}</span> : null
                        }
                        <input type="password" className="form-control mb-3" name="password1" placeholder="Ingrese Contraseña" value={password1} onChange={e => setPassword1(e.target.value)} />
                    </div>
                    <div className="col-md">
                        {
                            passwordError2 ? <span className="text-danger">{passwordError2}</span> : null
                        }
                        <input type="password" className="form-control mb-3" name="password2" placeholder="Repita contraseña" value={password2} onChange={e => setPassword2(e.target.value)} />
                    </div>
                    <div className="w-100"></div>
                    <div className="text-center">
                        <input type="submit" value="Registrarse" className="btn btn-primary w-50 " />
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Register
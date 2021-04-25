const { prepareConnection } = require("./connectionDB.js");

let emailError;
let namesError;
let surnameError;
let passwordError1;
let passwordError2;
let birthdayError;

const validate = async (email, names, surname, password1, password2, birthday) => {
    return ((validateEmail(email) && await verifyUniqueEmail(email)) & validateName(names) & validateSurname(surname) & validatePassword(password1) & comparePasswords(password1, password2) & validateDate(birthday)) ? null : { birthdayError, emailError, namesError, surnameError, passwordError1, passwordError2, passwordError2 };
};

const validateEmail = (email) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email) {
        emailError = ("Ingrese un correo");
        return false;
    }
    if (!reg.test(email)) {
        emailError = ("Ingrese un correo con un formato válido");
        return false;
    }

    emailError = (null);
    return true;
}

const verifyUniqueEmail = async (email) => {
    const connection = await prepareConnection();
    const selectSql = 'SELECT USER_ID FROM USER WHERE BINARY EMAIL = (?)';
    const [rows] = await connection.execute(selectSql, [email]);
    connection.end();
    if (rows.length >= 1) {
        emailError = "El email ingresado ya se encuentra en el sistema";
        return false;
    }
    return true;

}

const validateName = (names) => {
    const reg = /[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\s]/;

    if (!names) {
        namesError = ("Ingrese un nombre");
        return false;
    } else if (reg.test(names)) {
        namesError = ("El nombre debe poseer solo caracteres alfabéticos");
        return false;
    }

    namesError = (null);
    return true;
}
const validateSurname = (surname) => {
    const reg = /[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\s]/;

    if (!surname) {
        surnameError = ("Ingrese un apellido");
        return false;
    } else if (reg.test(surname)) {
        surnameError = ("El apellido debe poseer solo caracteres alfabéticos");
        return false;
    }

    surnameError = (null);
    return true;
}

const validatePassword = (password1) => {
    const reg1 = /[1-9]/;
    const reg2 = /[A-Z]/;
    const reg3 = /[a-z]/;

    if (!password1) {
        passwordError1 = ("Ingrese una contraseña");
        return false;
    } else if (password1.length < 6) {
        passwordError1 = ("La contraseña debe tener mas de 6 caracteres");
        return false;
    } else if (!reg1.test(password1)) {
        passwordError1 = ("La contraseña no posee números");
        return false;
    } /* else if (!reg2.test(password1)) {
        passwordError1 = ("La contraseña no posee letras mayúsculas");
        return false;
    } else if (!reg3.test(password1)) {
        passwordError1 = ("La contraseña no posee letras minúsculas");
        return false;
    } */

    passwordError1 = (null);
    return true;
}

const comparePasswords = (password1, password2) => {
    if (!password2) {
        passwordError2 = ("Ingrese la contraseña nuevamente");
        return false;
    } else if (password1 !== password2) {
        passwordError2 = ("Las contraseñas no coinciden");
        return false;
    }

    passwordError2 = (null);
    return true;
}

const validateDate = (birthday) => {
    function calculateAge() {
        let birthdayDate = new Date(birthday);
        let todayDate = new Date();
        var age = todayDate.getFullYear() - birthdayDate.getFullYear();
        var differenceOfMonths = todayDate.getMonth() - birthdayDate.getMonth();
        if (differenceOfMonths < 0 || (differenceOfMonths == 0 && (todayDate.getDate() < (birthdayDate.getDate()+ 1))))
            age--;
        return age;
    }
    
    const today = new Date().toISOString().slice(0, 10);

    if (birthday === today) {
        birthdayError = ("Ingrese una fecha");
        return false;
    }

    const reg = /^\d{4}[./-]\d{1,2}[./-]\d{1,2}$/;
    if (!reg.test(birthday)) {
        birthdayError = ("Ingrese un formato válido");
        return false;
    }

    const parts = birthday.split("-");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);

    if (year < (new Date().getFullYear() - 100) || year > (new Date().getFullYear()) || month === 0 || month > 12) {
        birthdayError = ("La fecha ingresada en inválida");
        return false;
    }

    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;

    if (!(day > 0 && day <= monthLength[month - 1])) {
        setBirthdayError("La fecha ingresada en inválida");
        return false;
    }

    if (calculateAge() < 18) {
        setBirthdayError("El usuario debe ser mayor a 18 años");
        return false;
    }
    birthdayError = (null);
    return true;
}

module.exports = {
    validate
}

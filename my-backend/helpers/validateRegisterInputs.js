import {
    ERROR_MSG_EMPTY_EMAIL,
    ERROR_MSG_EMPTY_NAME,
    ERROR_MSG_EMPTY_PASSWORD,
    ERROR_MSG_EMPTY_REPEAT_PASSWORD,
    ERROR_MSG_EMPTY_SURNAME,
    ERROR_MSG_EXISTING_EMAIL,
    ERROR_MSG_INVALID_EMAIL,
    ERROR_MSG_INVALID_NAME,
    ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS,
    ERROR_MSG_PASSWORD_NO_MATCH,
    ERROR_MSG_INVALID_PASSWORD_NO_CAPITAL_LETTERS,
    ERROR_MSG_INVALID_PASSWORD_NO_LOWER_CASE,
    ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS,
    ERROR_MSG_INVALID_SURNAME, ERROR_MSG_EMPTY_DATE, ERROR_MSG_INVALID_DATE, ERROR_MSG_INVALID_AGE,
} from '../const/index';

import {
    REGEX_DATE_YYYY_MM_DD,
    REGEX_EMAIL,
    REGEX_ONLY_ALPHABETICAL
} from '../helpers/regex';

const {prepareConnection} = require("./connectionDB.js");

let emailError;
let namesError;
let surnameError;
let passwordError1;
let passwordError2;
let birthdayError;

const validate = async (email, names, surname, password1, password2, birthday) => {
    return ((validateEmail(email) && await verifyUniqueEmail(email)) & validateName(names) & validateSurname(surname) & validatePassword(password1) & comparePasswords(password1, password2) & validateDate(birthday)) ? null : {
        birthdayError,
        emailError,
        namesError,
        surnameError,
        passwordError1,
        passwordError2
    };
};

const validateEmail = (email) => {
    if (!email) {
        emailError = (ERROR_MSG_EMPTY_EMAIL);
        return false;
    }
    if (!REGEX_EMAIL.test(email)) {
        emailError = (ERROR_MSG_INVALID_EMAIL);
        return false;
    }

    emailError = (null);
    return true;
}

const verifyUniqueEmail = async (email) => {
    try {
        const connection = await prepareConnection();

        const selectSql = 'SELECT USER_ID FROM USER WHERE BINARY EMAIL = (?)';
        const [rows] = await connection.execute(selectSql, [email]);

        connection.end();

        if (rows.length >= 1) {
            emailError = ERROR_MSG_EXISTING_EMAIL;
            return false;
        }
        return true;
    } catch (e) {
        console.log('Ocurrió un error al verificar si el email es único:', e)
    }


}

const validateName = (names) => {
    if (!names) {
        namesError = (ERROR_MSG_EMPTY_NAME);
        return false;
    } else if (!REGEX_ONLY_ALPHABETICAL.test(names)) {
        namesError = (ERROR_MSG_INVALID_NAME);
        return false;
    }

    namesError = (null);
    return true;
}
const validateSurname = (surname) => {
    if (!surname) {
        surnameError = (ERROR_MSG_EMPTY_SURNAME);
        return false;
    } else if (!REGEX_ONLY_ALPHABETICAL.test(surname)) {
        surnameError = (ERROR_MSG_INVALID_SURNAME);
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
        passwordError1 = (ERROR_MSG_EMPTY_PASSWORD);
        return false;
    } else if (password1.length < 6) {
        passwordError1 = (ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS);
        return false;
    } else if (!reg1.test(password1)) {
        passwordError1 = (ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS);
        return false;
    } /* else if (!reg2.test(password1)) {
        passwordError1 = (ERROR_MSG_INVALID_PASSWORD_NO_CAPITAL_LETTERS);
        return false;
    } else if (!reg3.test(password1)) {
        passwordError1 = (ERROR_MSG_INVALID_PASSWORD_NO_LOWER_CASE);
        return false;
    } */

    passwordError1 = (null);
    return true;
}

const comparePasswords = (password1, password2) => {
    if (!password2) {
        passwordError2 = (ERROR_MSG_EMPTY_REPEAT_PASSWORD);
        return false;
    } else if (password1 !== password2) {
        passwordError2 = (ERROR_MSG_PASSWORD_NO_MATCH);
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
        if (differenceOfMonths < 0 || (differenceOfMonths == 0 && (todayDate.getDate() < (birthdayDate.getDate() + 1))))
            age--;
        return age;
    }

    const today = new Date().toISOString().slice(0, 10);

    if (birthday === today) {
        birthdayError = (ERROR_MSG_EMPTY_DATE);
        return false;
    }

    if (!REGEX_DATE_YYYY_MM_DD.test(birthday)) {
        birthdayError = (ERROR_MSG_INVALID_DATE);
        return false;
    }

    const parts = birthday.split("-");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);

    if (year < (new Date().getFullYear() - 125) || year > (new Date().getFullYear()) || month === 0 || month > 12) {
        birthdayError = (ERROR_MSG_INVALID_DATE);
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
    birthdayError = (null);
    return true;
}

module.exports = {
    validate
}

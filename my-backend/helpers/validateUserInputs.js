const {
    ERROR_MSG_EMPTY_EMAIL,
    ERROR_MSG_EMPTY_NAME,
    ERROR_MSG_EMPTY_PASSWORD,
    ERROR_MSG_EMPTY_REPEAT_PASSWORD,
    ERROR_MSG_EMPTY_SURNAME,
    ERROR_MSG_EMPTY_PHONE_NUMBER,
    ERROR_MSG_EXISTING_EMAIL,
    ERROR_MSG_INVALID_EMAIL,
    ERROR_MSG_INVALID_NAME,
    ERROR_MSG_INVALID_PHONE_NUMBER,
    ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS,
    ERROR_MSG_PASSWORD_NO_MATCH,
    ERROR_MSG_INVALID_PASSWORD_NO_CAPITAL_LETTERS,
    ERROR_MSG_INVALID_PASSWORD_NO_LOWER_CASE,
    ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS,
    ERROR_MSG_INVALID_SURNAME, 
    ERROR_MSG_EMPTY_DATE, 
    ERROR_MSG_INVALID_DATE, 
    ERROR_MSG_INVALID_AGE,
    ERROR_MSG_SAME_NEW_PASSWORD,
    ERROR_MSG_INCORRECT_ACTUAL_PASSWORD 
} = require('../const/messages.js');

const {
    REGEX_DATE_YYYY_MM_DD,
    REGEX_EMAIL,
    REGEX_ONLY_ALPHABETICAL,
    REGEX_PHONE
} = require('../const/regex.js');

const { prepareConnection } = require("./connectionDB.js");

let emailError;
let namesError;
let surnameError;
let passwordError1;
let passwordError2;
let birthdayError;
let phoneNumberError;
let actualPasswordError;

const validatePassangerEmailToRecoverPassword = (email) => {
    return validateEmail(email) ? null : {emailError};
}

const validatePassangerNewRecoveredPassword = (email,passwordRevocered1, passwordRevocered2) => {
    passwordError2 = null;
    return (validateEmail(email) & validatePassword(passwordRevocered1)) && comparePasswords(passwordRevocered1, passwordRevocered2)? null : {emailError, passwordError1, passwordError2};
}

const validatePassengersToCreate = async (email, names, surname, password1, password2, birthday) => {
    actualPasswordError = null;
    return (validatePassenger(email, names, surname, password1, password2, birthday) && await verifyUniqueEmailToCreate(email)) ? null : preparePassengerResponse();
}

const validatePassengersToModifyWihoutNewPassword = async (email, names, surname, actualPassword, birthday ,id) => {
    passwordError1 = null;
    passwordError2 = null;
    return (validatePassengerToModify(email, names, surname, birthday) && await validateActualPassword(actualPassword, id) && await verifyUniqueEmailToModify(email, id)) ? null : preparePassengerResponse();
}

const validatePassengersToModifyWithNewPassword = async (email, names, surname, newPassword1, newPassword2, actualPassword ,birthday, id) => {
    passwordError1 = null;
    passwordError2 = null;
    return (validatePassengerToModify(email, names, surname, birthday) && await validateActualPassword(actualPassword, id) && await verifyUniqueEmailToModify(email, id) && validatePassword(newPassword1) && comparePasswords(newPassword1,newPassword2) && compareActualPasswordWithNewPassword(actualPassword, newPassword1)) ? null : preparePassengerResponse();
}

const validatePassengerToModify = (email, names, surname,birthday) => {
    return (validateEmail(email) & validateName(names) & validateSurname(surname) & validateDate(birthday))
}

const validateDriversToCreate = async (email, names, surname, password1, password2, phoneNumber) => {
    return (validateDrivers(email, names, surname, password1, password2, phoneNumber) && await verifyUniqueEmailToCreate(email)) ? null : prepareDriverResponse()
}

const validateDriversToModify = async (email, names, surname, password1, password2, phoneNumber, id) => {
    return (validateDrivers(email, names, surname, password1, password2, phoneNumber) && await verifyUniqueEmailToModify(email, id)) ? null : prepareDriverResponse()
}

const validatePassenger = (email, names, surname, password1, password2, birthday) => {
    return (validateUser(email, names, surname, password1, password2) & validateDate(birthday))
}

const validateDrivers = (email, names, surname, password1, password2, phoneNumber) => {
    return (validateUser(email, names, surname, password1, password2) & validatePhoneNumber(phoneNumber));
}

const validateUser = (email, names, surname, password1, password2) => {
    return (validateEmail(email) & validateName(names) & validateSurname(surname) & validatePassword(password1) & comparePasswords(password1, password2));
}

const preparePassengerResponse = () => {
    return {
        birthdayError,
        emailError,
        namesError,
        surnameError,
        passwordError1,
        passwordError2,
        actualPasswordError
    }
}

const prepareDriverResponse = () => {
    return {
        phoneNumberError,
        emailError,
        namesError,
        surnameError,
        passwordError1,
        passwordError2
    }
}

const validateEmail = (email) => {
    if (!email) {
        emailError = (ERROR_MSG_EMPTY_EMAIL);
        return false;
    }
    if (!REGEX_EMAIL.test(email)) {
        emailError = (ERROR_MSG_INVALID_EMAIL);
        return false;
    }

    emailError = null;
    return true;
}

const verifyUniqueEmailToCreate = async (email) => {
    try {
        const connection = await prepareConnection();

        const selectSql = 'SELECT USER_ID FROM USER WHERE EMAIL = (?)';
        const [rows] = await connection.execute(selectSql, [email]);

        connection.end();

        if (rows.length >= 1) {
            emailError = ERROR_MSG_EXISTING_EMAIL;
            return false;
        }
        return true;
    } catch (error) {
        console.log('Ocurrió un error al verificar si el email es único:', error);
        return false;
    }
}

const verifyUniqueEmailToModify = async (email, id) => {
    try {
        const connection = await prepareConnection();

        const selectSql = 'SELECT USER_ID FROM USER WHERE EMAIL = (?) AND USER_ID <> ?';
        const [rows] = await connection.execute(selectSql, [email, id]);

        connection.end();

        if (rows.length >= 1) {
            emailError = ERROR_MSG_EXISTING_EMAIL;
            return false;
        }
        return true;
    } catch (error) {
        console.log('Ocurrió un error al verificar si el email es único:', error);
        return false;
    }
}

const validateName = (names) => {
    if (!names) {
        namesError = (ERROR_MSG_EMPTY_NAME);
        return false;
    } else if (REGEX_ONLY_ALPHABETICAL.test(names)) {
        namesError = (ERROR_MSG_INVALID_NAME);
        return false;
    }

    namesError = null;
    return true;
}

const validateSurname = (surname) => {
    if (!surname) {
        surnameError = (ERROR_MSG_EMPTY_SURNAME);
        return false;
    } else if (REGEX_ONLY_ALPHABETICAL.test(surname)) {
        surnameError = (ERROR_MSG_INVALID_SURNAME);
        return false;
    }

    surnameError = null;
    return true;
}

const validatePassword = (password1) => {
    if (!password1) {
        passwordError1 = (ERROR_MSG_EMPTY_PASSWORD);
        return false;
    } else if (password1.length < 6) {
        passwordError1 = (ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS);
        return false;
    }/*else if (!REGEX_ONLY_NUMBER.test(password1)) {
        passwordError1 = (ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS);
        return false;
    }  else if (!REGEX_ONLY_LOWERCASE.test(password1)) {
        passwordError1 = (ERROR_MSG_INVALID_PASSWORD_NO_CAPITAL_LETTERS);
        return false;
    } else if (!REGEX_ONLY_UPPERCASE.test(password1)) {
        passwordError1 = (ERROR_MSG_INVALID_PASSWORD_NO_LOWER_CASE);
        return false;
    } */

    passwordError1 = null;
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

    passwordError2 = null;
    return true;
}

const validateDate = (birthday) => {
    function calculateAge() {
        let birthdayDate = new Date(birthday);
        let todayDate = new Date();
        let age = todayDate.getFullYear() - birthdayDate.getFullYear();
        let differenceOfMonths = todayDate.getMonth() - birthdayDate.getMonth();
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
        birthdayError = (ERROR_MSG_INVALID_DATE);
        return false;
    }

    if (calculateAge() < 18) {
        birthdayError = (ERROR_MSG_INVALID_AGE);
        return false;
    }
    birthdayError = null;
    return true;
}

const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
        phoneNumberError = (ERROR_MSG_EMPTY_PHONE_NUMBER);
        return false;
    } else if (REGEX_PHONE.test(phoneNumber)) {
        phoneNumberError = (ERROR_MSG_INVALID_PHONE_NUMBER);
        return false;
    }
    phoneNumberError = null;
    return true;
}

const validateActualPassword = async(actualPassword, id) => {
    try {
        const connection = await prepareConnection();

        const selectSql = 'SELECT USER_ID FROM USER WHERE BINARY PASSWORD = (?) AND USER_ID = ?';
        const [rows] = await connection.execute(selectSql, [actualPassword, id]);

        connection.end();

        if (rows.length != 1) {
            actualPasswordError = ERROR_MSG_INCORRECT_ACTUAL_PASSWORD;
            return false;
        }
        actualPasswordError = null;
        return true;
    } catch (error) {
        console.log('Ocurrió un error al verificar la contraseña actual del usuario:', error);
        return false;
    }
}

const compareActualPasswordWithNewPassword = (actualPassword, newPassword) => {
    if (actualPassword === newPassword) {
        passwordError1 = (ERROR_MSG_SAME_NEW_PASSWORD);
        return false;
    }

    passwordError1 = null;
    return true;
}

module.exports = {
    validatePassengersToCreate,
    validatePassengersToModifyWithNewPassword,
    validatePassengersToModifyWihoutNewPassword,
    validateDriversToCreate,
    validateDriversToModify,
    validatePassangerEmailToRecoverPassword,
    validatePassangerNewRecoveredPassword
}

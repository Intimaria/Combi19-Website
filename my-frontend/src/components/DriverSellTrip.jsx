import React, {useState} from 'react'
import {CustomDatePicker} from '../components/CustomDatePicker';
import moment from "moment";
import {TextField, Button} from '@material-ui/core';
import {useStyles} from '../const/componentStyles';

import {
    ERROR_MSG_EMPTY_EMAIL,
    ERROR_MSG_INVALID_EMAIL,
    ERROR_MSG_EMPTY_DATE,
    ERROR_MSG_INVALID_DATE,
    ERROR_MSG_INVALID_AGE
} from '../const/messages.js';

import {
    REGEX_EMAIL,
    REGEX_DATE_YYYY_MM_DD,

} from "../const/regex.js";

const DriverSellTrip = (props) => {
    const styles = useStyles();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [birthday, setBirthday] = React.useState(moment()
        .subtract(18, "years")
        .set({hour: 0, minute: 0, second: 0, millisecond: 0})
        .format('YYYY-MM-DD')
    );
    const [birthdayError, setBirthdayError] = React.useState(null);

    const mySubmitEmailBirthdayHandler = async (event) => {
        event.preventDefault();

        if (validateEmail(email) & validateBirthday(birthday)) console.log("Todo OK");

        return true;
    };

    const handleEmail = (newValue) => {
        setEmail(newValue.target.value);
        setEmailError(null);
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

        //setSuccessMessage(null);
    };

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

    const validateBirthday = () => {
        function calculateAge() {
            let birthdayDate = new Date(birthday);
            let todayDate = new Date();

            let age = todayDate.getFullYear() - birthdayDate.getFullYear();
            let differenceOfMonths = todayDate.getMonth() - birthdayDate.getMonth();
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

    const validateEmailAndBirthdayToSellTrips = (
        <div className={styles.modal}>
            <form onSubmit={mySubmitEmailBirthdayHandler}>
                <h2 align={'center'}> Ingrese datos de la cuenta </h2>
                <br />
                <h5 align={'center'}> Ingrese correo electrónico </h5>
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
                <br />
                <h5 align={'center'}> Ingrese fecha de nacimiento </h5>
                <CustomDatePicker
                    underlineDisabled={false}
                    label={'Fecha de nacimiento *'}
                    handleDate={handleBirthday}
                    invalidDateMessage={birthdayError}
                    selectedDate={birthday}
                    futureDisabled={true}
                    pastDisabled={false}
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
    );
    return (
        <div>
            {validateEmailAndBirthdayToSellTrips}
        </div>
    )
}

export default DriverSellTrip

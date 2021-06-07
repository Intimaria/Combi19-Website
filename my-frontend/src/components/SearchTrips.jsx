import React from 'react';
import { makeStyles } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { CustomDatePicker } from '../components/CustomDatePicker';
import moment from "moment";
import "moment/locale/es";
import {
    ERROR_MSG_EMPTY_PLACE_DEPARTURE,
    ERROR_MSG_INVALID_PLACE_DEPARTURE,
    ERROR_MSG_EMPTY_PLACE_DESTINATION,
    ERROR_MSG_INVALID_PLACE_DESTINATION,
    ERROR_MSG_EMPTY_DATE,
    ERROR_MSG_INVALID_DATE
} from "../const/messages.js";

import {
    REGEX_ONLY_ALPHABETICAL,
    REGEX_DATE_YYYY_MM_DD
} from "../const/regex.js"

import { searchTrips } from "../api/Trips.js"
import { Message } from '../components/Message';
const useStyles = makeStyles((theme) => ({
    modal: {
        maxWidth: "45%",
        marginTop: '1em',
        backgroundColor: "rgba(102,72,232)",
        backdropFilter: "blur(40)px",
        backgroundImage:
            "linear-gradient(to right bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6))",
        boxShadow: "10px 10px 10px rgba(30,30,30,.1)",
        borderRadius: 10,
        margin: 'auto',
        padding: theme.spacing(2, 4, 3),
    },
    inputMaterial: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        margin: 'auto',
        float: "center",
        marginBottom: '1em',
        paddingTop: '2px',
        paddingLeft: '10px',
        borderRadius: 10,
    }
}));

function SearchTrips() {

    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const styles = useStyles();

    const minDate = moment()
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const maxDate = moment()
        .add(1, "years")
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const [rowsTrips, setRowsTrips] = React.useState([]);
    const [selectedDeparture, setSelectedDeparture] = React.useState('');
    const [selectedDestination, setSelectedDestination] = React.useState('');
    const [departureError, setDepartureError] = React.useState('');
    const [destinationError, setDestinationError] = React.useState('');
    const [selectedDateFrom, setSelectedDateFrom] = React.useState(minDate.format('YYYY-MM-DD'));
    const [selectedDateTo, setSelectedDateTo] = React.useState(maxDate.format('YYYY-MM-DD'));
    const [dateFromError, setDateFromError] = React.useState('');
    const [dateToError, setDateToError] = React.useState('');

    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    const mySubmitHandler = async (event) => {
        event.preventDefault();

        if (validateSearch()) {
            await postRequest();
        }
        return true;
    };

    const defaultErrorMessager = () => {
        setDepartureError(null);
        setDestinationError(null);
        setDateFromError(null);
        setDateToError(null);
    }

    const postRequest = async () => {
        const searchData = {
            departure: selectedDeparture,
            destination: selectedDestination,
            dateFrom: selectedDateFrom,
            dateTo: selectedDateTo
        }

        const postResponse = await searchTrips(searchData);
        if (postResponse?.status === 200) {

            setRowsTrips(postResponse.data);
            defaultErrorMessager();
        }
        else if (postResponse?.status === 400) {
            setDepartureError(postResponse.data.departureError);
            setDestinationError(postResponse.data.destinationError);
            setDateFromError(postResponse.data.dateFromError);
            setDateToError(postResponse.data.dateToError);
        }
        else if (postResponse?.status === 500) {
            setSuccessMessage(postResponse.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: postResponse.data
            });
        }
    }

    const validateSearch = () => {
        let result = validateDeparture(selectedDeparture) & validateDestination(selectedDestination);
        if (!selectedDateFrom && !selectedDateTo) {
            return result
        }
        else if (selectedDateFrom && !selectedDateTo) {
            return result & validateDateFrom(selectedDateFrom)
        }
        else if (!selectedDateFrom && selectedDateTo) {
            return result & validateDateTo(selectedDateTo)
        }
        else {
            return result & validateDateFrom(selectedDateFrom) & validateDateTo(selectedDateTo)
        }
    }

    const validateDeparture = (departure) => {
        if (!departure) {
            setDepartureError(ERROR_MSG_EMPTY_PLACE_DEPARTURE);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(departure)) {
            setDepartureError(ERROR_MSG_INVALID_PLACE_DEPARTURE);
            return false;
        }

        setDepartureError(null);
        return true;
    }

    const validateDestination = (destination) => {
        if (!destination) {
            setDestinationError(ERROR_MSG_EMPTY_PLACE_DESTINATION);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(destination)) {
            setDestinationError(ERROR_MSG_INVALID_PLACE_DESTINATION);
            return false;
        }

        setDestinationError(null);
        return true;
    }

    const validateDateFrom = (dateFrom) => {
        if (!dateFrom) {
            setDateFromError(ERROR_MSG_EMPTY_DATE);
            return false;
        }

        if (!REGEX_DATE_YYYY_MM_DD.test(dateFrom)) {
            setDateFromError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const parts = dateFrom.split("-");
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        if (new Date(year, month - 1, day) < (new Date(currentYear, currentMonth, currentDay)) || new Date(year, month - 1, day) > new Date(currentYear + 1, currentMonth, currentDay) || month === 0 || month > 12) {
            setDateFromError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        if (!(day > 0 && day <= monthLength[month - 1])) {
            setDateFromError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        setDateFromError(null);
        return true;
    }

    const validateDateTo = (dateTo) => {

        if (!dateTo) {
            setDateToError(ERROR_MSG_EMPTY_DATE);
            return false;
        }

        if (!REGEX_DATE_YYYY_MM_DD.test(dateTo)) {
            setDateToError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const parts = dateTo.split("-");
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        if (new Date(year, month - 1, day) < (new Date(currentYear, currentMonth, currentDay)) || new Date(year, month - 1, day) > new Date(currentYear + 1, currentMonth, currentDay) || month === 0 || month > 12) {
            setDateToError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        if (!(day > 0 && day <= monthLength[month - 1])) {
            setDateToError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        setDateToError(null);
        return true;
    }

    const handleDeparture = (newValue) => {
        setSelectedDeparture(newValue.target.value);
        setDepartureError(null);
    };

    const handleDestination = (newValue) => {
        setSelectedDestination(newValue.target.value);
        setDestinationError(null);
    };

    const handleDateFrom = (newValue) => {
        if (!newValue) {
            setSelectedDateFrom(null);
        } else {
            let formattedDate = newValue.format('YYYY-MM-DD');
            if (formattedDate === 'Fecha inválida') {
                setSelectedDateFrom(newValue);
            } else {
                setSelectedDateFrom(formattedDate);
            }
            setDateFromError(null);
        }
    };

    const handleDateTo = (newValue) => {
        if (!newValue) {
            setSelectedDateTo(null);
        } else {
            let formattedDate = newValue.format('YYYY-MM-DD');
            if (formattedDate === 'Fecha inválida') {
                setSelectedDateTo(newValue);
            } else {
                setSelectedDateTo(formattedDate);
            }
            setDateToError(null);
        }
    };

    return (
        <div className={styles.modal}>
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }

            <h2 align={'center'}> Buscar Viajes </h2>
            <form onSubmit={mySubmitHandler}>
                <TextField className={styles.inputMaterial}
                    InputProps={{ disableUnderline: true }}
                    label="ㅤLugar de Origen"
                    name="departure"
                    onChange={handleDeparture}
                    inputProps={{ maxLength: 70 }}
                    autoComplete='off'
                    error={(departureError) ? true : false}
                    helperText={(departureError) ? departureError : false}
                />
                <TextField className={styles.inputMaterial}
                    InputProps={{ disableUnderline: true }}
                    label="ㅤLugar de destino"
                    name="destination"
                    onChange={handleDestination}
                    inputProps={{ maxLength: 70 }}
                    autoComplete='off'
                    error={(destinationError) ? true : false}
                    helperText={(destinationError) ? destinationError : false}
                />
                <h3 align={'center'}> Ingrese rango de fecha de partida </h3>
                <CustomDatePicker
                    label={'ㅤFecha inicial (Opcional)'}
                    handleDate={handleDateFrom}
                    invalidDateMessage={dateFromError}
                    selectedDate={selectedDateFrom}
                    className={styles.inputMaterial}
                    styles={{}}
                    underlineDisabled={true}
                    name="dateFrom"
                    minDate={minDate}
                    maxDate={maxDate}
                    futureDisabled={false}
                    pastDisabled={true}
                />
                <CustomDatePicker
                    label={'ㅤFecha final (Opcional)'}
                    handleDate={handleDateTo}
                    invalidDateMessage={dateToError}
                    selectedDate={selectedDateTo}
                    className={styles.inputMaterial}
                    styles={{}}
                    underlineDisabled={true}
                    name="dateTo"
                    minDate={minDate}
                    maxDate={maxDate}
                    futureDisabled={false}
                    pastDisabled={true}
                />
                <Button style={{ width: '100%' }}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnLogin"
                    type="submit"
                >BUSCAR VIAJE </Button>
            </form>
        </div>
    )
}

export default SearchTrips;
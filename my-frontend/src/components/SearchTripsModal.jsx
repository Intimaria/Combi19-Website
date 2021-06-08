import React from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
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
import { Message } from './Message';

function SearchTripsModal(props) {

    const useStyles = makeStyles((theme) => ({
        modal: {
            ...props.modal,
            maxWidth: "30%",
            backgroundColor: "rgba(153,217,234)",
            backdropFilter: "blur(40)px",
            boxShadow: "10px 10px 10px rgba(30,30,30,.1)",
            borderRadius: 10,
            padding: theme.spacing(2, 4, 3)
        },
        inputMaterial: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            margin: 'auto',
            float: "center",
            paddingTop: '2px',
            paddingLeft: '10px',
            borderRadius: 10,
        }
    }));

    const styles = useStyles();

    const history = useHistory();

    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const minDate = moment()
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const maxDate = moment()
        .add(1, "years")
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const searchedData = props.getSearchedData ? props.getSearchedData : null;

    const [selectedDeparture, setSelectedDeparture] = React.useState(searchedData ? searchedData.departure : '');
    const [selectedDestination, setSelectedDestination] = React.useState(searchedData ? searchedData.destination : '');
    const [departureError, setDepartureError] = React.useState('');
    const [destinationError, setDestinationError] = React.useState('');
    const [selectedDateFrom, setSelectedDateFrom] = React.useState(searchedData ? searchedData.dateFrom : minDate.format('YYYY-MM-DD'));
    const [selectedDateTo, setSelectedDateTo] = React.useState(searchedData ? searchedData.dateTo : maxDate.format('YYYY-MM-DD'));
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
            defaultErrorMessager();
            props.setSearchResults(postResponse.data);

            if (history.location.pathname !== '/tripsResults') {
                props.setSearchedData(searchData);
                history.push("/tripsResults");
            }

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
        <div className={`${styles.modal} bg-dark`} >
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }

            <h2 align={'center'} className="text-light"> Buscar Viajes </h2>
            <form onSubmit={mySubmitHandler}>
                <TextField className={styles.inputMaterial}
                    InputProps={{ disableUnderline: true }}
                    label="ㅤLugar de Origen"
                    name="departure"
                    onChange={handleDeparture}
                    defaultValue={searchedData ? searchedData.departure : ''}
                    inputProps={{ maxLength: 70 }}
                    autoComplete='off'
                    error={(departureError) ? true : false}
                />
                {
                    departureError ? <span className="text-danger small">{departureError}</span> :
                        <span className="text-danger small">&nbsp;</span>
                }
                <TextField className={styles.inputMaterial}
                    InputProps={{ disableUnderline: true }}
                    label="ㅤLugar de destino"
                    name="destination"
                    onChange={handleDestination}
                    defaultValue={searchedData ? searchedData.destination : ''}
                    inputProps={{ maxLength: 70 }}
                    autoComplete='off'
                    error={(destinationError) ? true : false}
                />
                {
                    destinationError ? <span className="text-danger small">{destinationError}</span> :
                        <span className="text-danger small">&nbsp;</span>
                }
                <h3 align={'center'} className="text-light"> Ingrese rango de fecha de partida </h3>

                <MuiPickersUtilsProvider
                    libInstance={moment}
                    utils={MomentUtils}
                    locale={"es"}
                >
                    <KeyboardDatePicker
                        InputProps={{ disableUnderline: true }}
                        className={styles.inputMaterial}
                        disableFuture={false}
                        disablePast={true}
                        disableToolbar
                        cancelLabel="CANCELAR"
                        okLabel="CONFIRMAR"
                        format="DD/MM/yyyy"
                        margin="normal"
                        id="dateTo"
                        name="dateTo"
                        label={'ㅤFecha final (Opcional)'}
                        minDate={minDate}
                        minDateMessage={"error"}
                        maxDate={maxDate}
                        maxDateMessage={"error"}
                        value={selectedDateFrom}
                        onChange={handleDateFrom}
                        error={dateFromError}
                        helperText={null}
                        KeyboardButtonProps={{
                            "aria-label": "Calendario"
                        }}
                    />
                </MuiPickersUtilsProvider>
                {
                    dateFromError ? <span className="text-danger small">{dateFromError}</span> :
                        <span className="text-danger small">&nbsp;</span>
                }
                <MuiPickersUtilsProvider
                    libInstance={moment}
                    utils={MomentUtils}
                    locale={"es"}
                >
                    <KeyboardDatePicker
                        InputProps={{ disableUnderline: true }}
                        className={styles.inputMaterial}
                        disableFuture={false}
                        disablePast={true}
                        disableToolbar
                        cancelLabel="CANCELAR"
                        okLabel="CONFIRMAR"
                        format="DD/MM/yyyy"
                        margin="normal"
                        id="dateFrom"
                        name="dateFrom"
                        label={'ㅤFecha final (Opcional)'}
                        invalidDateMessage={dateToError}
                        minDate={minDate}
                        minDateMessage={ERROR_MSG_INVALID_DATE}
                        maxDate={maxDate}
                        maxDateMessage={ERROR_MSG_INVALID_DATE}
                        value={selectedDateTo}
                        onChange={handleDateTo}
                        error={dateToError}
                        helperText={null}
                        KeyboardButtonProps={{
                            "aria-label": "Calendario"
                        }}
                    />
                </MuiPickersUtilsProvider>
                {
                    dateToError ? <span className="text-danger small">{dateToError}</span> :
                        <span className="text-danger small">&nbsp;</span>
                }
                <Button style={{ width: '100%', marginTop:"3px" }}
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

export default SearchTripsModal;
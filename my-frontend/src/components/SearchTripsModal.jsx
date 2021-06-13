import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
    ERROR_MSG_INVALID_DATE,
    ERROR_MSG_REPEAT_PLACES,
    ERROR_MSG_API_GET_PLACES,
    ERROR_MSG_DATE_LESS_THAN_CURRENT
} from "../const/messages.js";

import {
    REGEX_ONLY_NUMBER,
    REGEX_DATE_YYYY_MM_DD
} from "../const/regex.js"

import { getActivePlaces } from "../api/Places";
import { searchTrips } from "../api/Trips.js"
import { Message } from './Message';

function SearchTripsModal(props) {

    const styles = props.useStyles();

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

    const [availablePlaces, setAvaiablePlaces] = React.useState([]);
    const [selectedDeparture, setSelectedDeparture] = React.useState(searchedData ? searchedData.departure : '');
    const [selectedDestination, setSelectedDestination] = React.useState(searchedData ? searchedData.destination : '');
    const [departureError, setDepartureError] = React.useState('');
    const [destinationError, setDestinationError] = React.useState('');
    const [repeatPlaceError, setRepeatPlaceError] = React.useState('');
    const [selectedDepartureDate, setSelectedDepartureDate] = React.useState(searchedData ? searchedData.departureDate : minDate.format('YYYY-MM-DD'));
    const [departureDateError, setDepartureDateError] = React.useState('');

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
        setDepartureDateError(null);
    }

    const postRequest = async () => {
        const searchData = {
            departure: selectedDeparture,
            destination: selectedDestination,
            departureDate: selectedDepartureDate,
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
            setDepartureDateError(postResponse.data.departureDateError);
            setRepeatPlaceError(postResponse.data.repeatPlaceError)
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
        return ((validateDeparture(selectedDeparture) & validateDestination(selectedDestination)) && comparesPlaces(selectedDeparture, selectedDestination)) & validateDepartureDate(selectedDepartureDate);

    }

    const validateDeparture = (departure) => {
        if (!departure) {
            setDepartureError(ERROR_MSG_EMPTY_PLACE_DEPARTURE);
            return false;
        } else if (!REGEX_ONLY_NUMBER.test(departure)) {
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
        } else if (!REGEX_ONLY_NUMBER.test(destination)) {
            setDestinationError(ERROR_MSG_INVALID_PLACE_DESTINATION);
            return false;
        }

        setDestinationError(null);
        return true;
    }

    const comparesPlaces = (departure, destination) => {
        if (departure === destination) {
            setRepeatPlaceError(ERROR_MSG_REPEAT_PLACES);
            return false;
        }

        setRepeatPlaceError(null);
        return true;
    }

    const validateDepartureDate = (departureDate) => {
        if (!departureDate) {
            setDepartureDateError(ERROR_MSG_EMPTY_DATE);
            return false;
        }

        if (!REGEX_DATE_YYYY_MM_DD.test(departureDate)) {
            setDepartureDateError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const parts = departureDate.split("-");
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        if (new Date(year, month - 1, day) < (new Date(currentYear, currentMonth, currentDay))) {
            setDepartureDateError(ERROR_MSG_DATE_LESS_THAN_CURRENT);
            return false;
        }

        if (new Date(year, month - 1, day) > new Date(currentYear + 3, currentMonth, currentDay) || month === 0 || month > 12) {
            setDepartureDateError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        if (!(day > 0 && day <= monthLength[month - 1])) {
            setDepartureDateError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        setDepartureDateError(null);
        return true;
    }

    const requestGetPlaces = async () => {
        let getResponse = await getActivePlaces();
        if (getResponse?.status === 200) {
            setAvaiablePlaces(getResponse.data);
        } else if (getResponse?.status === 500) {
            setSuccessMessage(`${getResponse.data}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: getResponse.data
            });
            return true
        } else {
            setSuccessMessage(`${ERROR_MSG_API_GET_PLACES} ${getResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_GET_PLACES} ${getResponse}`
            });
        }
    }

    const handleDeparture = (newValue) => {
        setSelectedDeparture(newValue.target.value);
        setDepartureError(null);
        if (repeatPlaceError) {
            setRepeatPlaceError(null);
        }
    };

    const handleDestination = (newValue) => {
        setSelectedDestination(newValue.target.value);
        setDestinationError(null);
        if (repeatPlaceError) {
            setRepeatPlaceError(null);
        }
    };

    const handleDepartureDate = (newValue) => {
        if (!newValue) {
            setSelectedDepartureDate(null);
        } else {
            let formattedDate = newValue.format('YYYY-MM-DD');
            if (formattedDate === 'Fecha inválida') {
                setSelectedDepartureDate(newValue);
            } else {
                setSelectedDepartureDate(formattedDate);
            }
            setDepartureDateError(null);
        }
    };

    useEffect(() => {
        requestGetPlaces();
    }, []);

    return (
        <div className={`${styles.modal} bg-dark`} >
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }
            <h2 align={'center'} className="text-light"> Buscar viajes </h2>
            <form onSubmit={mySubmitHandler}>
                <div className={styles.div}>
                    <FormControl
                        className={styles.inputMaterial}
                        style={{ paddingBottom: "2px" }}
                        error={(departureError || repeatPlaceError) ? true : false}
                        InputProps={{ disableUnderline: true }}>
                        <InputLabel>ㅤLugar de origen</InputLabel>
                        <Select
                            disableUnderline={true}
                            label="ㅤLugar de origen"
                            id="departure"
                            labelId="departure"
                            name="departure"
                            value={(selectedDeparture) ? selectedDeparture : 0}
                            displayEmpty
                            onChange={handleDeparture}
                        >
                            <MenuItem value={0} disabled>
                                Seleccione el origen del viaje
                    </MenuItem>
                            {(availablePlaces) ?
                                availablePlaces.map((places) => (
                                    <MenuItem
                                        key={places.id}
                                        value={places.id}
                                    >
                                        {places.cityName}, {places.provinceName}

                                    </MenuItem>
                                ))
                                : null
                            }
                        </Select>
                    </FormControl>
                    {
                        !repeatPlaceError && departureError ? <span className="text-danger small">{departureError}</span> :
                            <span className="text-danger small">&nbsp;</span>
                    }
                    <br /><br />
                </div>
                <div className={styles.div}>
                    <FormControl className={styles.inputMaterial}
                        error={(destinationError || repeatPlaceError) ? true : false} >
                        <InputLabel>ㅤLugar de destino</InputLabel>
                        <Select label="ㅤLugar de destino" id="destination" labelId={"destination"}
                            disableUnderline={true}
                            name="destination"
                            className={styles.inputMaterial}
                            value={(selectedDestination) ? selectedDestination : 0}
                            disabled={(!selectedDeparture)}
                            displayEmpty
                            onChange={handleDestination}
                        >
                            <MenuItem value={0} disabled>
                                Seleccione el destino del viaje
                    </MenuItem>
                            {(availablePlaces) ?
                                availablePlaces.map((places) => (
                                    <MenuItem
                                        key={places.id}
                                        value={places.id}
                                    >
                                        {places.cityName}, {places.provinceName}

                                    </MenuItem>
                                ))
                                : null
                            }
                        </Select>
                    </FormControl>
                    {
                        !repeatPlaceError && destinationError ? <span className="text-danger small">{destinationError}</span> :
                            <span className="text-danger small">&nbsp;</span>
                    }
                    {
                        repeatPlaceError ? <span className="text-danger small">{repeatPlaceError}</span> :
                            <span className="text-danger small">&nbsp;</span>
                    }
                    <br /><br />
                </div>

                {styles.div ? null : <h3 align={'center'} className="text-light"> Ingrese fecha de partida </h3>}

                <div className={styles.div}>
                    <MuiPickersUtilsProvider
                        libInstance={moment}
                        utils={MomentUtils}
                        locale={"es"}
                        InputProps={{ disableUnderline: true }}
                    >
                        <KeyboardDatePicker
                            InputProps={{ disableUnderline: true }}
                            className={styles.inputMaterial}
                            style={{ margin: "0", paddingBottom: "2px" }}
                            disableFuture={false}
                            disablePast={true}
                            disableToolbar
                            cancelLabel="CANCELAR"
                            okLabel="CONFIRMAR"
                            format="DD/MM/yyyy"
                            margin="normal"
                            id="departureDate"
                            name="departureDate"
                            label={'ㅤFecha de partida'}
                            minDate={minDate}
                            minDateMessage={"error"}
                            maxDate={maxDate}
                            maxDateMessage={"error"}
                            value={selectedDepartureDate}
                            onChange={handleDepartureDate}
                            error={departureDateError}
                            helperText={null}
                            KeyboardButtonProps={{
                                "aria-label": "Calendario"
                            }}
                        />
                    </MuiPickersUtilsProvider>

                </div>
                {
                    departureDateError ? <span className="text-danger small"> {departureDateError}</span> :
                        <span className="text-danger small">&nbsp;</span>
                }
                <br /> <br />
                <div className={styles.button}>
                    <Button style={{ width: '100%', marginTop: "3px", borderRadius: 10 }}
                        variant="contained"
                        size="large"
                        color="primary"
                        id="btnLogin"
                        type="submit"
                    >BUSCAR VIAJE </Button>
                </div>
            </form>
        </div>
    )
}

export default SearchTripsModal;

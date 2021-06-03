import React, {useState, useEffect} from 'react';
import {Modal, TextField, Button} from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialTable from '@material-table/core';
import Tooltip from '@material-ui/core/Tooltip';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import HelpIcon from '@material-ui/icons/Help';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {useStyles} from '../const/componentStyles';
import {Message} from '../components/Message';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import {KeyboardDatePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";

import {
    getTrips,
    getTripDependenceById,
    postTrip,
    putTrip,
    deleteTrip
} from '../api/Trips';

import {getAvailableRoutes} from "../api/Routes";

import {
    ERROR_MSG_API_GET_TRIPS,
    ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE,
    ERROR_MSG_EMPTY_ROUTE_DEPARTURE,
    ERROR_MSG_EMPTY_ROUTE_DESTINATION,
    ERROR_MSG_EMPTY_DEPARTURE_DAY,
    ERROR_MSG_INVALID_DEPARTURE_DAY,
    ERROR_MSG_INVALID_MIN_VALUE,
    ERROR_MSG_EMPTY_PRICE,
    ERROR_MSG_INVALID_PRICE,
    ERROR_MSG_INVALID_MIN_PRICE,
    ERROR_MSG_INVALID_MAX_PRICE,
    ERROR_MSG_API_POST_TRIP,
    ERROR_MSG_API_TRIP_DATE_OVERLAP,
    ERROR_MSG_API_TRIP_VALIDATE_DATE_OVERLAP,
    ERROR_MSG_API_PUT_TRIP,

} from "../const/messages";

import {
    REGEX_DATE_YYYY_MM_DD_HH_MM, REGEX_ONLY_DECIMAL_NUMBER
} from "../const/regex";

import {formatDecimalNumber} from "../helpers/numbers";

const columns = [
    {title: 'Origen', field: 'departure'},
    {title: 'Destino', field: 'destination'},
    {title: 'Precio', field: 'price'},
    {title: 'Fecha de salida', field: 'departureDay'},
    {title: 'Fecha de llegada', field: 'arrivalDay'},
    {
        title: 'Combi',
        render: (data) => `${data.transport.internalIdentification} -  ${data.transport.registrationNumber}`,
        customFilterAndSearch: (term, data) => (`${data.transport.internalIdentification.toLowerCase()}, ${data.transport.registrationNumber.toLowerCase()}`).indexOf(term.toLowerCase()) !== -1
    },
    {title: 'Estado', field: 'active'}
];


function Trips() {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const formatSelectedTrip = {
        routeId: "",
        price: "",
        departureDay: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        active: "",
    };

    const styles = useStyles();

    const [data, setData] = useState([]);
    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [departureRouteSelected, setDepartureRouteSelected] = useState('');
    const [destinationRouteSelected, setDestinationRouteSelected] = useState('');
    const [routeTransport, setRouteTransport] = useState('Combi de la ruta seleccionada');
    const [departureRouteSelectedError, setDepartureRouteSelectedError] = useState(false);
    const [destinationRouteSelectedError, setDestinationRouteSelectedError] = useState(false);
    const [departureDayError, setDepartureDayError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(formatSelectedTrip);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const setDefaultValues = () => {
        setDefaultObjectsValues();
        setDefaultErrorMessages();
    };

    const setDefaultObjectsValues = () => {
        setSelectedTrip(formatSelectedTrip);
        setAvailableRoutes([]);
        setFilteredRoutes([]);
        setDepartureRouteSelected('');
        setDestinationRouteSelected('');
        setRouteTransport('Combi de la ruta seleccionada');
    };

    const setDefaultErrorMessages = () => {
        setDefaultApiErrorMessages();
        setPriceError(false);
        setDepartureRouteSelectedError(false);
        setDestinationRouteSelectedError(false);
        setDepartureRouteSelectedError(false);
    };

    const setDefaultApiErrorMessages = () => {
        setDepartureDayError(false);
    };

    const handleChange = async e => {
        let {name, value} = e.target;

        if (name === 'departureRouteSelected') {
            setDepartureRouteSelectedError(false);
            setDepartureRouteSelected(value);
            setDestinationRouteSelected('');
            setRouteTransport('Combi de la ruta seleccionada');
        } else if (name === 'destinationRouteSelected') {
            setDestinationRouteSelectedError(false);
            setDestinationRouteSelected(value);

            const routeSelected = availableRoutes.filter(route =>
                route.departureId === departureRouteSelected
                &&
                route.destinationId === value
            );

            setSelectedTrip(prevState => ({
                ...prevState,
                ['routeId']: routeSelected[0].routeId
            }));

            setRouteTransport(routeSelected[0].transport);

        } else {
            setSelectedTrip(prevState => ({
                ...prevState,
                [name]: value
            }));

            switch (name) {
                case 'departureDay':
                    setDepartureDayError(false);
                    break;
                case 'price':
                    let priceFormatted = formatDecimalNumber(value, 7, 2);

                    if (priceFormatted[0] > 2) {
                        setPriceError(ERROR_MSG_INVALID_PRICE)
                    } else {
                        setSelectedTrip(prevState => ({
                            ...prevState,
                            [name]: (priceFormatted[0] === 2) ? `${priceFormatted[1]},${priceFormatted[2]}` : `${priceFormatted[1]}`
                        }));

                        setPriceError(false);
                    }
                    break;
                default:
                    console.log('Es necesario agregar un case más en el switch por el name:', name);
                    break;
            }
        }

        setSuccessMessage(null);
    };


    const handleDepartureDay = (newValue) => {
        if (!newValue) {
            setSelectedTrip(prevState => ({
                ...prevState,
                ['departureDay']: null
            }));
        } else {
            let formattedDate = newValue.format('YYYY-MM-DD HH:mm');
            if (formattedDate === 'Fecha inválida') {
                setSelectedTrip(prevState => ({
                    ...prevState,
                    ['departureDay']: newValue
                }));
            } else {
                setSelectedTrip(prevState => ({
                    ...prevState,
                    ['departureDay']: formattedDate
                }));
            }
            setDepartureDayError(null);
        }

        setSuccessMessage(null);
    };


    const validateForm = () => {
        return validateRouteDeparture() & validateRouteDestination() & validateDepartureDay() & validatePrice();
    };

    const validateRouteDeparture = () => {
        if (departureRouteSelected) {
            setDepartureRouteSelectedError(null);
            return true;
        } else {
            setDepartureRouteSelectedError(ERROR_MSG_EMPTY_ROUTE_DEPARTURE);
            return false;
        }
    };

    const validateRouteDestination = () => {
        if (destinationRouteSelected) {
            setDestinationRouteSelectedError(null);
            return true;
        } else {
            setDestinationRouteSelectedError(ERROR_MSG_EMPTY_ROUTE_DESTINATION);
            return false;
        }
    };

    const validateDepartureDay = () => {
        if (!selectedTrip.departureDay) {
            setDepartureDayError(ERROR_MSG_EMPTY_DEPARTURE_DAY);
            return false;
        } else if (!REGEX_DATE_YYYY_MM_DD_HH_MM.test(selectedTrip.departureDay)) {
            setDepartureDayError(ERROR_MSG_INVALID_DEPARTURE_DAY);
            return false;
        }else if (moment(selectedTrip.departureDay) <= moment()) {
            setDepartureDayError(ERROR_MSG_INVALID_MIN_VALUE);
            return false;
        }

        setDepartureDayError(null);
        return true;
    };

    const validatePrice = () => {
        if (!selectedTrip.price) {
            setPriceError(ERROR_MSG_EMPTY_PRICE);
            return false;
        } else if (!REGEX_ONLY_DECIMAL_NUMBER.test(selectedTrip.price)) {
            setPriceError(ERROR_MSG_INVALID_PRICE);
            return false;
        } else if (selectedTrip.price <= 0) {
            setPriceError(ERROR_MSG_INVALID_MIN_PRICE);
        } else if (selectedTrip.price > 9999999.99) {
            setPriceError(ERROR_MSG_INVALID_MAX_PRICE);
        }

        setPriceError(null);
        return true;
    };


    const fetchData = async () => {
        try {
            let getTripsResponse = await getTrips();

            if (getTripsResponse.status === 200) {
                let data = getTripsResponse.data;

                setData(data);
            } else if (getTripsResponse.status === 500) {
                setSuccessMessage(getTripsResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: getTripsResponse.data
                });

                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_GET_TRIPS} ${getTripsResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_GET_TRIPS} ${getTripsResponse}`
                });
            }


        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
        }
    };

    const requestPostTrip = async () => {
        if (validateForm()) {
            setDefaultApiErrorMessages();

            let postResponse = await postTrip(selectedTrip);

            if (postResponse.status === 201) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: postResponse.data
                });

                await openCloseModalCreate();

                await fetchData();
                return true
            } else if (postResponse.status === 400) {
                setDepartureDayError(postResponse.data.departureDayError);
            } else if (postResponse.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });

                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_POST_TRIP} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_TRIP} ${postResponse}`
                });
            }
        }
    };
    /*
        const requestPutTrip = async () => {
            if (validateForm()) {
                setDefaultApiErrorMessages();

                let postResponse = await putTrip(selectedTrip,
                    departureRouteSelected ? departureRouteSelected : selectedTrip.route.departure,
                    destinationRouteSelected ? destinationRouteSelected : selectedTrip.route.destination
                );

                if (postResponse.status === 200) {
                    setSuccessMessage(postResponse.data);
                    setOptions({
                        ...options, open: true, type: 'success',
                        message: postResponse.data
                    });

                    await openCloseModalUpdate();

                    await fetchData();
                    return true
                } else if (postResponse.status === 400) {
                    setDepartureDayError(postResponse.data.departureDayError);
                } else if (postResponse.status === 500) {
                    setSuccessMessage(postResponse.data);
                    setOptions({
                        ...options, open: true, type: 'error',
                        message: postResponse.data
                    });

                    return true
                } else {
                    setSuccessMessage(`${ERROR_MSG_API_POST_TRIP} ${postResponse}`);
                    setOptions({
                        ...options, open: true, type: 'error',
                        message: `${ERROR_MSG_API_POST_TRIP} ${postResponse}`
                    });
                }
            }
        };

        const requestDeleteTrip = async () => {
            let deleteResponse = await deleteTrip(selectedTrip.tripId);

            if (deleteResponse.status === 200) {
                setSuccessMessage(deleteResponse.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: deleteResponse.data
                });
                openCloseModalDelete();
                await fetchData();
            } else if (deleteResponse?.status === 400 || deleteResponse?.status === 500) {
                setSuccessMessage(deleteResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: deleteResponse.data
                });
                openCloseModalDelete();
            } else {
                setSuccessMessage(`${ERROR_MSG_API_DELETE_TRIP} ${deleteResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_DELETE_TRIP} ${deleteResponse}`
                });
            }
        };
    */
    const selectTrip = async (trip, action) => {
        setSelectedTrip(trip);
        if (action === "Ver") {
            openCloseModalViewDetails()
        } /*else if (action === "Editar") {
            await openCloseModalUpdate(trip)
        } else {
            await openCloseModalDelete(trip)
        }*/
    };

    const requestGetAvailableRoutes = async () => {
        let getAvailableRoutesResponse = await getAvailableRoutes();

        if (getAvailableRoutesResponse.status === 200) {
            const availableRoutes = await getAvailableRoutesResponse.data;

            setAvailableRoutes(availableRoutes);

            let seen = new Set();

            const filteredRoutes = availableRoutes.filter(route => {
                const duplicate = seen.has(route.departureId);
                seen.add(route.departureId);
                return !duplicate;
            });

            setFilteredRoutes(filteredRoutes);

        } else if (getAvailableRoutesResponse.status === 500) {
            getAvailableRoutesResponse(getAvailableRoutesResponse.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: getAvailableRoutesResponse.data
            });

            return true
        } else {
            setSuccessMessage(`${ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE} ${getAvailableRoutesResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE} ${getAvailableRoutesResponse}`
            });
        }
    };

    const openCloseModalCreate = async () => {
        setCreateModal(!createModal);

        // Data are loaded when the modal is open
        if (!createModal) {
            await requestGetAvailableRoutes();
        } else {
            setDefaultValues();

        }
    };

    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
    };
    /*
        const openCloseModalUpdate = async (trip) => {
            // If the modal is closed, trip dependence is validate before open the modal
            if (!updateModal) {
                let dependenceResponse = await getTripDependenceById(trip.tripId);

                // If the trip is used on a route, the modal will NOT be open
                if (dependenceResponse.data.tripTicketDependence) {
                    setSuccessMessage(dependenceResponse.data);
                    setOptions({
                        ...options, open: true, type: 'error',
                        message: ERROR_MSG_API_PUT_TRIP_TICKET_DEPENDENCE
                    });
                    setDefaultValues();
                } else {
                    // If the trip is NOT used on a route, the modal will be open
                    setUpdateModal(!updateModal);

                    setDepartureRouteSelected(selectedTrip.route.routeId);

                    // Data are loaded when the modal is open
                    await requestGetAvailableRoutes();
                }
            } else {
                // The modal is closed
                setUpdateModal(!updateModal);
                // Data are cleaned when the modal is closed
                setDefaultValues();
            }
        };

        const openCloseModalDelete = async (trip) => {
            // If the modal is closed, trip dependence is validate before open the modal
            if (!deleteModal) {
                let dependenceResponse = await getTripDependenceById(trip.tripId);

                // If the trip is used on a route, the modal will NOT be open
                if (dependenceResponse.data.tripTicketDependence) {
                    setSuccessMessage(dependenceResponse.data);
                    setOptions({
                        ...options, open: true, type: 'error',
                        message: ERROR_MSG_API_DELETE_TRIP_TICKET_DEPENDENCE
                    });
                    setDefaultValues();
                } else {
                    // If the trip is NOT used on a route, the modal will be open
                    setDeleteModal(!deleteModal);
                }
            } else {
                // The modal is closed
                setDeleteModal(!deleteModal);
                // Data are cleaned when the modal is closed
                setDefaultValues();
            }
        };
    */
    useEffect(() => {

        fetchData();
    }, []);

    const inputsToCreateOrModify = (
        <div>
            <Tooltip title="La combi debe ser modificada desde la sección de RUTAS">
                <TextField label="Combi" id={"transport"} name="transport"
                           className={styles.inputMaterial}
                           disabled
                           value={selectedTrip && routeTransport}/>
            </Tooltip>
            {
                <MuiPickersUtilsProvider
                    libInstance={moment}
                    utils={MomentUtils}
                    locale={"es"}
                >
                    <KeyboardDateTimePicker
                        className={styles.inputMaterial}
                        style={{marginTop: '-1px', marginBottom: '-1px'}}
                        //required
                        disablePast
                        disableToolbar
                        cancelLabel="CANCELAR"
                        okLabel="CONFIRMAR"
                        format="DD/MM/yyyy HH:mm"
                        margin="normal"
                        id={"departureDay"}
                        name={"departureDay"}
                        label="Fecha y hora del viaje"
                        invalidDateMessage={ERROR_MSG_INVALID_DEPARTURE_DAY}
                        minDate={moment().subtract(1, "minutes")}
                        minDateMessage={ERROR_MSG_INVALID_MIN_VALUE}
                        maxDate={moment().add(10, "year").set({hour: 0, minute: 0, second: 0, millisecond: 0})}
                        maxDateMessage={"* La fecha y hora debe ser anterior a los próximos 10 años"}
                        ampm={false}
                        error={(departureDayError) ? true : false}
                        helperText={(departureDayError) ? departureDayError : false}
                        value={selectedTrip.departureDay || moment().add(1, 'minutes')}
                        onChange={handleDepartureDay}
                    />
                </MuiPickersUtilsProvider>
            }

            <TextField label="Precio" id={"price"} name="price"
                       className={styles.inputMaterial}
                       inputProps={{maxLength: 11}}
                       required
                       autoComplete='off'
                       error={(priceError) ? true : false}
                       helperText={(priceError) ? priceError : false}
                       value={selectedTrip && selectedTrip.price}
                       onChange={handleChange}/>
        </div>
    );

    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO VIAJE</h3>
            <FormControl className={styles.inputMaterial}
                         required
                         error={(departureRouteSelectedError) ? true : false}>
                <InputLabel>Origen del viaje</InputLabel>
                <Select label="Origen del viaje" id="departureRouteSelected" labelId={"departureRouteSelected"}
                        name="departureRouteSelected"
                        className={styles.inputMaterial}
                        value={(departureRouteSelected) ? departureRouteSelected : 0}
                        displayEmpty
                        onChange={handleChange}
                >
                    <MenuItem value={0} disabled>
                        Seleccione el origen del viaje
                    </MenuItem>
                    {(filteredRoutes) ?
                        filteredRoutes.map((route) => (
                            <MenuItem
                                key={route.routeId}
                                value={route.departureId}
                            >
                                {route.departure}

                            </MenuItem>
                        ))
                        : null
                    }
                </Select>
                <FormHelperText>{(departureRouteSelectedError) ? departureRouteSelectedError : false}</FormHelperText>
            </FormControl>
            <Tooltip
                title="Se considera disponible si la ruta no está dada de baja">
                <FormHelperText>
                    <HelpIcon color='primary' fontSize="small"/>
                    Sólo se visualizan las rutas disponibles
                </FormHelperText>
            </Tooltip>
            <FormControl className={styles.inputMaterial}
                         required
                         error={(destinationRouteSelectedError) ? true : false}>
                <InputLabel>Destino del viaje</InputLabel>
                <Select label="Destino del viaje" id="destinationRouteSelected" labelId={"destinationRouteSelected"}
                        name="destinationRouteSelected"
                        className={styles.inputMaterial}
                        value={(destinationRouteSelected) ? destinationRouteSelected : 0}
                        disabled={(!departureRouteSelected)}
                        displayEmpty
                        onChange={handleChange}
                >
                    <MenuItem value={0} disabled>
                        Seleccione el destino del viaje
                    </MenuItem>
                    {(availableRoutes) ?
                        availableRoutes.filter((route) => route.departureId === departureRouteSelected)
                            .map((route) => (
                                <MenuItem
                                    key={route.routeId}
                                    value={route.destinationId}
                                >
                                    {route.destination}
                                </MenuItem>
                            )) : null
                    }
                </Select>
                <FormHelperText>{(destinationRouteSelectedError) ? destinationRouteSelectedError : false}</FormHelperText>
            </FormControl>
            <Tooltip
                title="Sólo se visualizan los destinos disponibles acorde al origen seleccionado">
                <FormHelperText>
                    <HelpIcon color='primary' fontSize="small"/>
                    Destinos disponibles según el origen seleccionado
                </FormHelperText>
            </Tooltip>
            {inputsToCreateOrModify}
            <br/>
            <div align="right">
                <Button color="primary" onClick={() => requestPostTrip()}>GUARDAR</Button>
                <Button onClick={() => openCloseModalCreate()}>CANCELAR</Button>
            </div>
        </div>
    );

    /*
        const bodyViewDetails = (
            <div className={styles.modal}>
                <h3>DETALLE DEL VIAJE</h3>
                <TextField className={styles.inputMaterial} label="Ruta" name="route"
                           value={selectedTrip && `${selectedTrip.route.departure} - ${selectedTrip.route.destination}`}/>
                <br/>
                <TextField label="Combi" id={"transport"} name="transport"
                           className={styles.inputMaterial}
                           value={selectedTrip && `${selectedTrip.transport.internalIdentification} - ${selectedTrip.transport.registrationNumber}`}/>
                <br/>
                <TextField label="Fecha y hora de partida" id={"departureDay"} name="departureDay"
                           className={styles.inputMaterial}
                           value={selectedTrip && selectedTrip.departureDay}/>
                <br/>
                <TextField label="Precio" id={"price"} name="price"
                           className={styles.inputMaterial}
                           value={selectedTrip && selectedTrip.price}/>
                <br/>
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                           value={selectedTrip && selectedTrip.active}/>
                <br/>

                <br/>
                <div align="right">
                    <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
                </div>
            </div>
        );
        */
    /*
        const bodyEdit = (
            <div className={styles.modal}>
                <h3>EDITAR COMBI</h3>
                <Tooltip title="Debe eliminar la combi para cambiar el estado">
                    <TextField label="Estado" id={"active"} name="active"
                               className={styles.inputMaterial}
                               disabled
                               value={selectedTrip && selectedTrip.active}/>
                </Tooltip>
                <br/>
                {inputsToCreateOrModify}
                <FormControl className={styles.inputMaterial}
                             required>
                    <InputLabel>Tipo de confort</InputLabel>
                    <Select label="Tipo de comfort" labelId="typeComfortSelected" id="typeComfortSelected"
                            name="typeComfortSelected"
                            className={styles.inputMaterial}
                            value={(routeTransport) ? routeTransport : selectedTrip.comfort.typeComfortId}
                            onChange={handleChange}
                            displayEmpty
                    >
                        <MenuItem value={0} disabled> Seleccione un tipo de confort </MenuItem>
                        <MenuItem key={1} value={1}> Cómoda </MenuItem>
                        <MenuItem key={2} value={2}> Súper-cómoda </MenuItem>
                    </Select>
                    <FormHelperText>{(departureRouteSelectedError) ? departureRouteSelectedError : false}</FormHelperText>
                </FormControl>
                <FormControl className={styles.inputMaterial}
                             required>
                    <InputLabel>Chofer</InputLabel>
                    <Select label="Chofer" labelId="driverSelected" id="driverSelected" name="driverSelected"
                            className={styles.inputMaterial}
                            value={(departureRouteSelected) ? departureRouteSelected : selectedTrip.driver.userId}
                            onChange={handleChange}
                            displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Seleccione un chofer
                        </MenuItem>
                        <MenuItem value={selectedTrip.driver.userId}>
                            {selectedTrip.driver.surname}, {selectedTrip.driver.name}
                        </MenuItem>
                        {(availableRoutes) ?
                            availableRoutes.filter((item) => item.userId !== selectedTrip.driver.userId)
                                .map((drivers) => (
                                    <MenuItem
                                        key={drivers.userId}
                                        value={drivers.userId}
                                    >
                                        {drivers.surname}, {drivers.name}
                                    </MenuItem>
                                )) : null
                        }
                    </Select>
                    <Tooltip
                        title="Se considera disponible si el chofer no está dado de baja ni está asignado a otra combi">
                        <FormHelperText>
                            <HelpIcon color='primary' fontSize="small"/>
                            Sólo se visualizan los choferes disponibles
                        </FormHelperText>
                    </Tooltip>
                </FormControl>
                <br/>
                <div align="right">
                    <Button color="primary" onClick={() => requestPutTrip()}>CONFIRMAR CAMBIOS</Button>
                    <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
                </div>
            </div>
        );

        const bodyDelete = (
            <div className={styles.modal}>
                <p>¿Estás seguro que deseas eliminar la combi con
                    identificación <b>{selectedTrip && selectedTrip.internalIdentification}</b> y
                    patente <b>{selectedTrip && selectedTrip.registrationNumber}</b>?
                </p>
                <div align="right">
                    <Button color="secondary" onClick={() => requestDeleteTrip()}>SÍ, ELIMINAR</Button>
                    <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>

                </div>

            </div>
        );
    */
    return (
        <div className="App">
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <br/>
            <Button style={{marginLeft: '8px'}}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnNewTrip"
                    startIcon={<CardTravelIcon/>}
                    onClick={() => openCloseModalCreate()}>NUEVO VIAJE</Button>
            <br/><br/>
            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de viajes"
                actions={[
                    {
                        icon: () => <VisibilityIcon/>,
                        tooltip: 'Visualización de viaje',
                        onClick: (event, rowData) => selectTrip(rowData, "Ver")
                    },
                    rowData => ({
                        icon: 'edit',
                        tooltip: (rowData.active === 'Activo') ? 'Editar viaje' : 'No se puede editar un viaje dado de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectTrip(rowData, "Editar")
                    }),
                    rowData => ({
                        icon: 'delete',
                        tooltip: (rowData.active === 'Activo') ? 'Eliminar viaje' : 'No se puede eliminar un viaje dado de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectTrip(rowData, "Eliminar")
                    })
                ]}
                options={materialTableConfiguration.options}
                localization={materialTableConfiguration.localization}
            />


            <Modal
                open={createModal}
                onClose={openCloseModalCreate}>
                {bodyCreate}
            </Modal>
            {/*
            <Modal
                open={viewModal}
                onClose={openCloseModalViewDetails}>
                {bodyViewDetails}
            </Modal>

            <Modal
                open={updateModal}
                onClose={openCloseModalUpdate}>
                {bodyEdit}
            </Modal>

            <Modal
                open={deleteModal}
                onClose={openCloseModalDelete}>
                {bodyDelete}
            </Modal>*/}
        </div>
    );
}

export default Trips;
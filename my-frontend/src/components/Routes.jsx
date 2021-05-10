<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button } from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialTable from "material-table";
import Tooltip from '@material-ui/core/Tooltip';
import TrainIcon from '@material-ui/icons/Train';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useStyles } from '../const/modalStyle';
import { Message } from '../components/Message';
import { materialTableConfiguration } from '../const/materialTableConfiguration';

import {
    getRoutes,
    postRoutes,
    putRoutes,
    deleteRoutes
} from '../api/Routes';

import {
    getTransports
} from '../api/Transports.js';
import {
    getPlaces
} from '../api/Places.js';
import {
    ERROR_MSG_API_GET_ROUTES,
    ERROR_MSG_API_POST_ROUTES,
    ERROR_MSG_API_PUT_ROUTES,
    ERROR_MSG_API_DELETE_ROUTES,
    ERROR_MSG_API_GET_TRANSPORTS,
    ERROR_MSG_API_GET_PLACES,
    ERROR_MSG_EMPTY_KM,
    ERROR_MSG_EMPTY_DURATION,
    ERROR_MSG_EMPTY_TRANSPORT,
    ERROR_MSG_EMPTY_PLACE_DESTINATION,
    ERROR_MSG_EMPTY_PLACE_DEPARTURE,
    ERROR_MSG_INVALID_KM,
    ERROR_MSG_INVALID_DURATION,
    ERROR_MSG_INVALID_TRANSPORT,
    ERROR_MSG_INVALID_PLACE_DESTINATION,
    ERROR_MSG_INVALID_PLACE_DEPARTURE,
    ERROR_MSG_REPEAT_PLACES
} from "../const/messages";

import {
    REGEX_DURATION,
    REGEX_ONLY_NUMBER
} from "../const/regex";
=======
import { Button, Modal, TextField } from '@material-ui/core';
// Importo los mensajes de error
import {
    ERROR_MSG_API_DELETE_ROUTE,
    ERROR_MSG_API_GET_ROUTES,
    ERROR_MSG_API_POST_ROUTE,
    ERROR_MSG_API_PUT_ROUTE,
    ERROR_MSG_EMPTY_NAME,
    ERROR_MSG_INTERNET,
    ERROR_MSG_INVALID_NAME,
    OK_MSG_API_ROUTE_POST
} from '../const/messages.js';
// Importo las expresiones regulares
import {
    REGEX_EMAIL,
    REGEX_ONLY_ALPHABETICAL,
    REGEX_PHONE
} from '../const/regex.js';
// Importo de elemntos de material ui, las apis que utilizo y el componente del mensaje
import React, { useEffect, useState } from 'react';
import { deleteRoutes, getRouteById, getRoutes, postRoutes, putRoutes } from '../api/Routes.js';

import AccessibilityIcon from '@material-ui/icons/Accessibility';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MaterialTable from "material-table";
import { Message } from "./Message";
import Tooltip from '@material-ui/core/Tooltip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// La configuracion en castellano
import { materialTableConfiguration } from '../const/materialTableConfiguration';
//Los estilos de los modals
import { useStyles } from '../const/modalStyle';
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25

const columns = [
<<<<<<< HEAD
    { title: 'Origen', field: 'departure.cityName' },
    { title: 'Destino', field: 'destination.cityName' },
    { title: 'Identificacion de la combi', field: 'transport.internalIdentificacion' },
    { title: 'Estado', field: 'active' },
];


function Routes() {
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const formatSelectedRoute = {
        route_id: "",
        duration: "",
        kmDistance: "",
        active: "",
        departure: {
            cityId: "",
            cityName: "",
            idProvince: "",
            provinceName: "",
            active: ""
        },
        destination: {
            cityId: "",
            cityName: "",
            idProvince: "",
            provinceName: "",
            active: ""
        },
        transport: {
            transportId: "",
            internalIdentification: ""
        }
    };
=======
    { title: 'Distancia', field: 'km' },
    { title: 'Duracion', field: 'duration' },
    { title: 'Combi', field: 'transport' },
    { title: 'Ciudad origen', field: 'cityOrigin' },
    { title: 'Provinca origen', field: 'provOrigin' },
    { title: 'Ciudad destino', field: 'cityDest' },
    { title: 'Provinca destino', field: 'provDest' },
    { title: 'Ciudad origen', field: 'cityOrigin' },
    { title: 'Estado', field: 'active' }
];

function Routes() {
    //Configuracion del mensaje de exito o error
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };
    //Formato que tiene los datos al seleccionarlos para mostrarlos en un modal
    const formatSelectedRoute = {
        idRoute: '',
        km: '',
        duration: '',
        transport: '',
        cityOrigin: '',
        provOrigin: '',
        cityDest: '',
        provDest: '',
        active: ''
    }

>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25

    const styles = useStyles();
    const [data, setData] = useState([]);
<<<<<<< HEAD
    
    const [transports, setTransports] = useState([]);
    const [places, setPlaces] = useState([]);

    const [departureError, setDepartureError] = useState(false);
    const [destinationError, setDestinationError] = useState(false);
    const [transportError, setTransportError] = useState(false);
    const [durationError, setDurationError] = useState(false);
    const [kmError, setKmError] = useState(false);

    const [departureSelected, setDepartureSelected] = useState('');
    const [destinationSelected, setDestinationSelected] = useState('');
    const [transportSelected, setTransportSelected] = useState('');
    const [selectedRoute, setSelectedRoute] = useState(formatSelectedRoute);

=======
    //Mensaje de error de los inputs
    const [cityOrNamesError, setCityOrNamesError] = React.useState(null);
    const [cityDestNamesError, setCityDestNamesError] = React.useState(null);
    const [provOrNamesError, setProvOrNamesError] = React.useState(null);
    const [provDestNamesError, setProvDestNamesError] = React.useState(null);
    //Para abrir y cerrar los modales
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
<<<<<<< HEAD

=======
    //Aca se guarda los datos de la fila seleccionada
    const [selectedRoute, setSelectedRoute] = useState(formatSelectedRoute);
    //Elementos para configurar los mensajes
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });
    
    const setDefaultValues = () => {
        setDefaultObjectsValues();
        setDefaultErrorMessages();
    };

    const setDefaultObjectsValues = () => {
        setDepartureSelected('');
        setDestinationSelected('');
        setTransportSelected('');
        setSelectedRoute(formatSelectedRoute);
    };

    const setDefaultErrorMessages = () => {
        setDepartureError(false);
        setDestinationError(false);
        setTransportError(false);
        setDurationError(false);
        setKmError(false);
    };

    const handleChange = async (textFieldAtributes) => {
        const { name, value } = textFieldAtributes.target;
<<<<<<< HEAD

        if (name === 'departureSelected') {
            setDepartureError(false);
            setDepartureSelected(value);
        } else if (name === 'destinationSelected') {
            setDestinationError(false);
            setDestinationSelected(value);
        }
        else if (name === 'transportSelected') {
            setTransportError(false);
            setTransportSelected(value);
        } else {
            setSelectedRoute(prevState => ({
                ...prevState,
                [name]: value
            }))

            switch (name) {
                case 'duration':
                    setDurationError(false);
                    break;
                case 'kmDistance':
                    setKmError(false);
                    break;
                default:
                    console.log('Es necesario agregar un case más en el switch por el name:', name);
                    break;
            }
        }

        setSuccessMessage(null);
    };


    const validateForm = () => {
        return validatePlaceDeperture() & validatePlaceDestination() & comparePlaces() & validateTransport() & validateDuration() & validateKm();
    };

    const validatePlaceDeperture = async () => {
        if (!departureSelected) {
            setDepartureError(ERROR_MSG_EMPTY_PLACE_DEPARTURE);
            return false;
        }

        setDepartureError(false);
        return true;
    }

    const validatePlaceDestination = async () => {
        if (!destinationSelected) {
            setDestinationError(ERROR_MSG_EMPTY_PLACE_DESTINATION);
            return false;
        }

        setDestinationError(false);
        return true;
    }

    const comparePlaces = () => {
        if (departureSelected.cityId === destinationSelected.cityId) {
            setDepartureError(ERROR_MSG_REPEAT_PLACES);
            return false;
        }
        setDepartureError(false);
        return true;
    }

    const validateTransport = async () => {
        if (!transportSelected) {
            setTransportError(ERROR_MSG_EMPTY_TRANSPORT);
            return false;
        }

        setTransportError(false);
        return true;
    }

    const validateDuration = () => {
        if (!selectedRoute.duration) {
            setDurationError(ERROR_MSG_EMPTY_DURATION);
            return false;
        }
        else if (REGEX_DURATION.test(selectedRoute.duration)) {
            setDurationError(ERROR_MSG_INVALID_DURATION);
            return false;
        }
        setDurationError(false);
        return true;
    }

    const validateKm = () => {
        if (!selectedRoute.kmDistance) {
            setKmError(ERROR_MSG_EMPTY_KM);
            return false;
        }
        else if (REGEX_ONLY_NUMBER.test(selectedRoute.kmDistance)) {
            setKmError(ERROR_MSG_INVALID_KM);
            return false;
        }
        setKmError(null);
        return true;
    }

    const fetchData = async () => {
        /*try {
            let getTransportsResponse = await getRoutes();

            if (getTransportsResponse.status === 200) {
                let data = getTransportsResponse.data;

                setData(data);
            } else if (getTransportsResponse.status === 500) {
                setSuccessMessage(getTransportsResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: getTransportsResponse.data
                });

                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_GET_ROUTES} ${getTransportsResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_GET_ROUTES} ${getTransportsResponse}`
                });
            }


        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_TRANSPORTS} ${error}`);
        } */
    };

    const requestPostTransport = async () => {
        if (validateForm()) {

            let postResponse = await postRoutes(selectedRoute, departureSelected, destinationSelected, transportSelected);

            if (postResponse?.status === 201) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: postResponse.data
=======
        setSelectedRoute(prevState => ({
            ...prevState,
            [name]: value
        }));


        //Saca el mensaje de error segun el input que se modifico
        switch (name) {
            case 'cityOrigin':
                cityOrNamesError(null);
                break;
            case 'cityDest':
                cityDestNamesError(null);
                break;
            case 'provOrigin':
                provOrNamesError(null);
                break;
            case 'provDest':
                provDestNamesError(null);
                break;
            default:
                console.log('Es necesario agregar un case más en el switch por el name:', name);
                break;
        }
    }


    //Aca arrancan las validaciones de los datos del ruta
    const validateForm = () => {
        return  validateCityOrName() & validateCityDestName() & validateProvOr() & validateProvDest();
    };

    const setDefaultErrorMessages = () => {
        setCityDestNamesError('');
        setCityOrNamesError('');
        setProvDestNamesError('');
        setProvOrNamesError('');
    };


    const validateCityOrName = () => {
        if (!selectedRoute.cityOrigin) {
            setCityOrNamesError(ERROR_MSG_EMPTY_NAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(selectedRoute.cityOrigin)) {
            setCityOrNamesError(ERROR_MSG_INVALID_NAME);
            return false;
        }
        setCityOrNamesError(null);
        return true;
    }
    const validateCityDestName = () => {
        if (!selectedRoute.cityDest) {
            setCityDestNamesError(ERROR_MSG_EMPTY_NAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(selectedRoute.cityDest)) {
            setCityDestNamesError(ERROR_MSG_INVALID_NAME);
            return false;
        }
        setCityDestNamesError(null);
        return true;
    }



    const validateProvOr = () => {
        if (!selectedRoute.provOrigin) {
            setProvOrNamesError(ERROR_MSG_EMPTY_NAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(selectedRoute.provOrigin)) {
            setProvOrNamesError(ERROR_MSG_INVALID_NAME);
            return false;
        }
        setProvOrNamesError(null);
        return true;
    }
    const validateProvDest = () => {
        if (!selectedRoute.provDest) {
            setProvDestNamesError(ERROR_MSG_EMPTY_NAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(selectedRoute.provDest)) {
            setProvDestNamesError(ERROR_MSG_INVALID_NAME);
            return false;
        }
        setProvDestNamesError(null);
        return true;
    }
    // Aca ingreso un ruta nuevo
    const peticionPost = async () => {
        if (validateForm()) {
            let postResponse = await postRoutes(selectedRoute);
            if (postResponse.status === 201) {
                setSuccessMessage(`Se ha creado la ruta correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha creado la ruta correctamente`
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
                });

                await openCloseModalCreate();

                await fetchData();
            } else if (postResponse?.status === 400) {
<<<<<<< HEAD
                if (postResponse.data.placesError) {
                    setDepartureError(postResponse.data.placesError)
                }
                else {
                    setDepartureError(postResponse.data.placeDepertureError)
                    setDestinationError(postResponse.data.placeDestinationError)
                }
                setTransportError(postResponse.data.transportError)
                setDurationError(postResponse.data.durationError)
                setKmError(postResponse.data.kmError)
=======
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });
                return true
                /*
                setEmailError(postResponse.data.emailError);
                setNamesError(postResponse.data.namesError);
                setSurnameError(postResponse.data.surnameError);
                setPhoneNumberError(postResponse.data.phoneNumberError);
                setPassword1Error(postResponse.data.passwordError1);
                setPassword2Error(postResponse.data.passwordError2);
                */
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
            } else if (postResponse?.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });

                return true
            } else {
<<<<<<< HEAD
                setSuccessMessage(`${ERROR_MSG_API_POST_ROUTES} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_ROUTES} ${postResponse}`
                });
            }
        }
    };

    const requestPutTransport = async () => {
        if (validateForm()) {

            let putResponse = await putRoutes(
                selectedRoute,
                departureSelected ? departureSelected : selectedRoute.departure.cityId,
                destinationSelected ? destinationSelected : selectedRoute.destination.cityId,
                transportSelected ? transportSelected : selectedRoute.transport.transportId,
                selectedRoute.route_id
                );

            if (putResponse?.status === 200) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: putResponse.data
=======
                setSuccessMessage(`${ERROR_MSG_API_POST_ROUTE} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_ROUTE} ${postResponse}`
                });
            }
        }
    }
    //Aca realizo la actualizacion de los datos del ruta
    const peticionPut = async () => {
        if (validateForm()) {
            let putResponse = await putRoutes(selectedRoute, selectedRoute.id);

            if (putResponse.status === 200) {
                setSuccessMessage(`Se ha actualizado la ruta correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha actualizado la ruta correctamente`
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
                });

                await openCloseModalUpdate();

                await fetchData();
                return true
            } else if (putResponse?.status === 400) {
<<<<<<< HEAD
                if (putResponse.data.placesError) {
                    setDepartureError(putResponse.data.placesError)
                }
                else {
                    setDepartureError(putResponse.data.placeDepertureError)
                    setDestinationError(putResponse.data.placeDestinationError)
                }
                setTransportError(putResponse.data.transportError)
                setDurationError(putResponse.data.durationError)
                setKmError(putResponse.data.kmError)
=======
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: putResponse.data
                });
                return true
                /*
                setEmailError(putResponse.data.emailError);
                setNamesError(putResponse.data.namesError);
                setSurnameError(putResponse.data.surnameError);
                setPhoneNumberError(putResponse.data.phoneNumberError);
                setPassword1Error(putResponse.data.passwordError1);
                setPassword2Error(putResponse.data.passwordError2);
                */
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
            } else if (putResponse?.status === 500) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: putResponse.data
                });
                return true
            } else {
<<<<<<< HEAD
                setSuccessMessage(`${ERROR_MSG_API_POST_ROUTES} ${putResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_ROUTES} ${putResponse}`
                });
            }
        }
    };

    const requestDeleteTransport = async () => {
        let deleteResponse = await deleteRoutes(selectedRoute.route_id);

        if (deleteResponse?.status === 200) {
            setSuccessMessage(deleteResponse.data);
            setOptions({
                ...options, open: true, type: 'success',
                message: deleteResponse.data
=======
                setSuccessMessage(`${ERROR_MSG_API_PUT_ROUTE} ${putResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_ROUTE} ${putResponse}`
                });
            }
        }
    }
    //Aca elimino a un ruta
    const peticionDelete = async () => {
        let deleteResponse = await deleteRoutes(selectedRoute.id);

        if (deleteResponse.status === 200) {
            setSuccessMessage(`Se ha eliminado la ruta correctamente`);
            setOptions({
                ...options, open: true, type: 'success',
                message: `Se ha eliminado la ruta correctamente`
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
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
<<<<<<< HEAD
            setSuccessMessage(`${ERROR_MSG_API_DELETE_ROUTES}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_DELETE_ROUTES}`
            });
        }
    };

    const selectRoute = async (routes, action) => {
        setSelectedRoute(routes);
=======
            setSuccessMessage(`${ERROR_MSG_API_DELETE_ROUTE} ${deleteResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_DELETE_ROUTE} ${deleteResponse}`
            });
        }
    }
    //Aca dependiendo del boton que se apreto abro el modal correspondiente
    const selectRoute = (route, action) => {
        setSelectedRoute(route);
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
        if (action === "Ver") {
            openCloseModalViewDetails()
        } else if (action === "Editar") {
            await openCloseModalUpdate()
        } else {
            openCloseModalDelete()
        }
    };

    const requestGetTransports = async () => {
        let getResponse = await getTransports();

        if (getResponse?.status === 200) {
            setPlaces(getResponse.data);
        } else if (getResponse?.status === 500) {
            setOptions({
                ...options, open: true, type: 'error',
                message: getResponse.data
            });

            return true
        } else {
            setSuccessMessage(`${ERROR_MSG_API_GET_TRANSPORTS}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_GET_TRANSPORTS}`
            });
        }
    }
<<<<<<< HEAD

    const requestGetPlaces = async () => {
        let getResponse = await getPlaces();

        if (getResponse?.status === 200) {
            setTransports(getResponse.data);
        } else if (getResponse?.status === 500) {
            setOptions({
                ...options, open: true, type: 'error',
                message: getResponse.data
            });
            return true
        } else {
            setSuccessMessage(`${ERROR_MSG_API_GET_TRANSPORTS}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_GET_TRANSPORTS}`
            });
=======
    //Metodos para cerrar y abrir modales, pone los valores por defecto cuando los abro
    const openCloseModalCreate = () => {
        setCreateModal(!createModal);
        if (createModal) {
            setSelectedRoute(formatSelectedRoute);
            setDefaultErrorMessages();            
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
        }
    }

    const openCloseModalCreate = async () => {
        setCreateModal(!createModal);

        // Data are loaded when the modal is open
        if (!createModal) {
            await requestGetPlaces();
            await requestGetTransports();
        } else {
            setDefaultValues();
        }
    };

    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
<<<<<<< HEAD
    };

    const openCloseModalUpdate = async () => {
=======
        if (viewModal) {
            setSelectedRoute(formatSelectedRoute);
        }
    }
    const openCloseModalUpdate = () => {
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
        setUpdateModal(!updateModal);

        // Data are loaded when the modal is open
        if (!updateModal) {
            await requestGetPlaces();
            await requestGetTransports();
        }

        // Data are cleaned when the modal is closed
        if (updateModal) {
<<<<<<< HEAD
            setDefaultValues();
=======
            setSelectedRoute(formatSelectedRoute);
            setDefaultErrorMessages();
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
        }
    };

    const openCloseModalDelete = () => {
        setDeleteModal(!deleteModal);
<<<<<<< HEAD

        // Data are cleaned when the modal is closed
        if (deleteModal) {
            setDefaultValues();
=======
        if (deleteModal) {
            setSelectedRoute(formatSelectedRoute);
        }
    }

    //Aca busco los datos de los choferes del backend
    const fetchData = async () => {
        try {
            let getRoutesResponse = await getRoutes();

            if (getRoutesResponse?.status === 200) {
                let data = getRoutesResponse.data;
                setData(data);
            }
            else {
                setSuccessMessage(`${ERROR_MSG_API_GET_ROUTES} ${getRoutesResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_GET_ROUTES} ${getRoutesResponse}`
                });
            }
        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_ROUTES} ${error}`);
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const inputsToCreateOrModify = (
        <div>
<<<<<<< HEAD
            <TextField label="Duracion" id={"duration"} name="duration"
                className={styles.inputMaterial}
=======
            <TextField className={styles.inputMaterial} label="Nombre de Ciudad Origen" name="cityOrigin"
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
                required
                inputProps={{ maxLength: 8 }}
                autoComplete='off'
<<<<<<< HEAD
                error={(durationError) ? true : false}
                helperText={(durationError) ? durationError : false}
                value={selectedRoute && selectedRoute.duration}
                onChange={handleChange} />
            <TextField label="Distancia en KM" id={"kmDistance"} name="kmDistance"
                className={styles.inputMaterial}
                required
                inputProps={{ maxLength: 9 }}
                autoComplete='off'
                error={(kmError) ? true : false}
                helperText={(kmError) ? kmError : false}
                value={selectedRoute && selectedRoute.kmDistance}
                onChange={handleChange} />
            <FormControl className={styles.inputMaterial}
                required
                error={(departureError) ? true : false}>
                <InputLabel>Origen</InputLabel>
                <Select label="Origen" id="departureSelected" labelId={"departureSelected"} name="departureSelected"
                    className={styles.inputMaterial}
                    value={(departureSelected) ? departureSelected : 0}
                    displayEmpty
                    onChange={handleChange}
                >
                    <MenuItem value={0} disabled>
                        Seleccione un lugar
                    </MenuItem>
                    {(places) ?
                        places.map((place) => (
                            <MenuItem
                                key={place.id}
                                value={place.id}
                            >
                                {place.provinceName}, {place.cityName}

                            </MenuItem>
                        ))
                        : null
                    }
                </Select>
                <FormHelperText>{(departureError) ? departureError : false}</FormHelperText>
            </FormControl>
            <FormControl className={styles.inputMaterial}
                required
                error={(destinationError) ? true : false}>
                <InputLabel>Destino</InputLabel>
                <Select label="Destino" id="destinationSelected" labelId={"destinationSelected"} name="destinationSelected"
                    className={styles.inputMaterial}
                    value={(destinationError) ? destinationError : 0}
                    displayEmpty
                    onChange={handleChange}
                >
                    <MenuItem value={0} disabled>
                        Seleccione un lugar
                    </MenuItem>
                    {(places) ?
                        places.map((place) => (
                            <MenuItem
                                key={place.id}
                                value={place.id}
                            >
                                {place.provinceName}, {place.cityName}

                            </MenuItem>
                        ))
                        : null
                    }
                </Select>
                <FormHelperText>{(destinationError) ? destinationError : false}</FormHelperText>
            </FormControl>
            <FormControl className={styles.inputMaterial}
                required
                error={(transportError) ? true : false}>
                <InputLabel>Combi</InputLabel>
                <Select label="Combi" id="transportSelected" labelId={"transportSelected"} name="transportSelected"
                    className={styles.inputMaterial}
                    value={(transportSelected) ? transportSelected : 0}
                    displayEmpty
                    onChange={handleChange}
                >
                    <MenuItem value={0} disabled>
                        Seleccione una combi
                    </MenuItem>
                    {(transports) ?
                        transports.map((transport) => (
                            <MenuItem
                                key={transport.transport_id}
                                value={transport.transport_id}
                            >
                                {transport.internal_identification}
                            </MenuItem>
                        ))
                        : null
                    }
                </Select>
                <FormHelperText>{(transportError) ? transportError : false}</FormHelperText>
            </FormControl>
=======
                error={(cityOrNamesError) ? true : false}
                helperText={(cityOrNamesError) ? cityOrNamesError : false}
                onChange={handleChange}
                value={selectedRoute && selectedRoute.cityOrigin} />
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
        </div>
    )
    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVA RUTA</h3>
            {inputsToCreateOrModify}
            <br />
            <div align="right">
                <Button color="primary" onClick={() => requestPostTransport()}>GUARDAR</Button>
                <Button onClick={() => openCloseModalCreate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE LA RUTA</h3>
            <TextField className={styles.inputMaterial} label="Estado" name="active"
<<<<<<< HEAD
                value={selectedRoute && selectedRoute.active} />
            <br />
            <TextField className={styles.inputMaterial} label="Distancia en km" name="kmDistance"
                value={selectedRoute && selectedRoute.kmDistance} />
            <br />
            <TextField className={styles.inputMaterial} label="Duracion" name="duration"
                value={selectedRoute && selectedRoute.duration} />
            <br />
            <TextField className={styles.inputMaterial} label="Origen" name="departureSelect"
                value={selectedRoute && selectedRoute.departure.cityName} />
            <br />
            <TextField className={styles.inputMaterial} label="Destino" name="destinationSelect"
                value={selectedRoute && selectedRoute.destination.cityName} />
            <br />
            <TextField className={styles.inputMaterial} label="Combi" name="transportSelect"
                value={selectedRoute && selectedRoute.transport.internalIdentification} />
            <br /><br />

=======
                value={selectedRoute && selectedRoute.active} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Duración" name="duration"
                value={selectedRoute && selectedRoute.duration} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Kilometros" name="km"
                value={selectedRoute && selectedRoute.km} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Ciudad Origen" name="cityOrigin" onChange={handleChange}
                value={selectedRoute && selectedRoute.cityOrigin} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Ciudad Destino" name="cityDest" onChange={handleChange}
                value={selectedRoute && selectedRoute.cityDest} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Provincia Origen" name="provOrigin" onChange={handleChange}
                value={selectedRoute && selectedRoute.provOrigin} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Provincia Destino" name="provDest" onChange={handleChange}
                value={selectedRoute && selectedRoute.provDest} autoComplete="off" />
            <br />
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>Salir</Button>
            </div>
        </div>
    );

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR RUTA</h3>
<<<<<<< HEAD
            <Tooltip title="Debe eliminar la ruta para cambiar el estado">
                <TextField label="Estado" id={"active"} name="active"
                    className={styles.inputMaterial}
                    disabled
                    value={selectedRoute && selectedRoute.active} />
=======
            <Tooltip title="Debe eliminar la combi para cambiar el estado">
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                    value={selectedRoute && selectedRoute.active} disabled />
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
            </Tooltip>
            <br />
            {inputsToCreateOrModify}
            <br />
            <div align="right">
                <Button color="primary" onClick={() => requestPutTransport()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyDelete = (
        <div className={styles.modal}>
<<<<<<< HEAD
            <p>¿Estás seguro que deseas eliminar la ruta con
                origen <b>{selectedRoute && selectedRoute.departure.cityName}</b> y
                destino <b>{selectedRoute && selectedRoute.destination.cityName}</b>?
=======
            <p>¿Estás seguro que deseas eliminar la ruta de <b>{selectedRoute && selectedRoute.cityOrigin}</b> a
            <b>{selectedRoute && selectedRoute.cityDest}</b> ?
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => requestDeleteTransport()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>

            </div>

        </div>
    );

    return (
        <div className="App">
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }
            <br />
            <Button style={{ marginLeft: '8px' }}
                variant="contained"
                size="large"
                color="primary"
<<<<<<< HEAD
                id="btnNewRuta"
                startIcon={<TrainIcon />}
=======
                id="btnNewRoute"
                startIcon={<AccessibilityIcon />}
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
                onClick={() => openCloseModalCreate()}>NUEVA RUTA</Button>
            <br /><br />
            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de rutas"
                actions={[
                    /*{
                        icon: () => <VisibilityIcon />,
                        tooltip: 'Visualización de ruta',
<<<<<<< HEAD
                        onClick: (event, rowData) => selectTransport(rowData, "Ver")
                    },*/
                    rowData => ({
                        icon: 'edit',
                        tooltip: (rowData.active === 'Activo') ? 'Editar ruta' : 'No se puede editar una ruta dada de baja',
=======
                        onClick: (event, rowData) => selectRoute(rowData, "Ver")
                    },
                    rowData => ({
                        icon: 'edit',
                        tooltip: (rowData.active === 'Activo') ? 'Editar ruta' : 'No se puede editar una rutar dado de baja',
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectRoute(rowData, "Editar")
                    }),
                    rowData => ({
                        icon: 'delete',
<<<<<<< HEAD
                        tooltip: (rowData.active === 'Activo') ? 'Eliminar ruta' : 'No se puede eliminar una ruta dada de baja',
=======
                        tooltip: (rowData.active === 'Activo') ? 'Eliminar ruta' : 'No se puede eliminar una ruta dado de baja',
>>>>>>> 9e2dfd9d0639699ea24fe3c4addb8cf4c777cb25
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectRoute(rowData, "Eliminar")
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
            </Modal>


        </div>
    );
}

export default Routes;
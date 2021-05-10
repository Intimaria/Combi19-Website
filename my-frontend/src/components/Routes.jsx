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

const columns = [
    { title: 'Distancia', field: 'km' },
    { title: 'Duracion', field: 'duration' },
    { title: 'Combi', field: 'transport.internalIdentification' },
    { title: 'Ciudad origen', field: 'departure.cityName' },
    { title: 'Provincia origen', field: 'departure.provinceName' },
    { title: 'Ciudad destino', field: 'destination.cityName' },
    { title: 'Provincia destino', field: 'destination.provinceName' },
    { title: 'Estado', field: 'active' }
];

function Routes() {
    //Configuracion del mensaje de exito o error
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    //Formato que tiene los datos al seleccionarlos para mostrarlos en un modal
    const formatSelectedRoute = {
        idRoute: "",
        duration: "",
        km: "",
        active: "",
        departure: {
            cityId: "",
            cityName: "",
            provinceName: "",
        },
        destination: {
            cityId: "",
            cityName: "",
            provinceName: "",
        },
        transport: {
            transportId: "",
            internalIdentification: ""
        }
    };


    const styles = useStyles();
    const [data, setData] = useState([]);

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

    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
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
        try {
            let getResponse = await getRoutes();

            if (getResponse.status === 200) {
                let data = getResponse.data;

                setData(data);
            } else if (getResponse.status === 500) {
                setSuccessMessage(getResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: getResponse.data
                });

                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_GET_ROUTES} ${getResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_GET_ROUTES} ${getResponse}`
                });
            }


        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_TRANSPORTS} ${error}`);
        }
    };

    const requestPostRoute = async () => {
        if (validateForm()) {

            let postResponse = await postRoutes(selectedRoute, departureSelected, destinationSelected, transportSelected);

            if (postResponse?.status === 201) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: postResponse.data
                });

                await openCloseModalCreate();

                await fetchData();
            } else if (postResponse?.status === 400) {
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
            } else if (postResponse?.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });

                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_POST_ROUTES} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_ROUTES} ${postResponse}`
                });
            }
        }
    };

    const requestPutRoute = async () => {
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
                });

                await openCloseModalUpdate();

                await fetchData();
                return true
            } else if (putResponse?.status === 400) {
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
            } else if (putResponse?.status === 500) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: putResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_PUT_ROUTES} ${putResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_ROUTES} ${putResponse}`
                });
            }
        }
    }
    //Aca elimino a un ruta
    const requestDeleteRoute = async () => {
        let deleteResponse = await deleteRoutes(selectedRoute.id);

        if (deleteResponse.status === 200) {
            setSuccessMessage(`Se ha eliminado la ruta correctamente`);
            setOptions({
                ...options, open: true, type: 'success',
                message: `Se ha eliminado la ruta correctamente`
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
            setSuccessMessage(`${ERROR_MSG_API_DELETE_ROUTES}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_DELETE_ROUTES}`
            });
        }
    };

    const selectRoute = async (routes, action) => {
        setSelectedRoute(routes);
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
            setSuccessMessage(`${ERROR_MSG_API_GET_PLACES}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_GET_PLACES}`
            });
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
    };

    const openCloseModalUpdate = async () => {
        setUpdateModal(!updateModal);

        // Data are loaded when the modal is open
        if (!updateModal) {
            await requestGetPlaces();
            await requestGetTransports();
        }

        // Data are cleaned when the modal is closed
        if (updateModal) {
            setDefaultValues();
        }
    };

    const openCloseModalDelete = () => {
        setDeleteModal(!deleteModal);

        // Data are cleaned when the modal is closed
        if (deleteModal) {
            setDefaultValues();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const inputsToCreateOrModify = (
        <div>
            <TextField label="Duracion" id={"duration"} name="duration"
                className={styles.inputMaterial}
                required
                inputProps={{ maxLength: 8 }}
                autoComplete='off'
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
        </div>
    )
    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVA RUTA</h3>
            {inputsToCreateOrModify}
            <br />
            <div align="right">
                <Button color="primary" onClick={() => requestPostRoute()}>GUARDAR</Button>
                <Button onClick={() => openCloseModalCreate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE LA RUTA</h3>
            <TextField className={styles.inputMaterial} label="Estado" name="active"
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
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>Salir</Button>
            </div>
        </div>
    );

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR RUTA</h3>
            <Tooltip title="Debe eliminar la ruta para cambiar el estado">
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                    value={selectedRoute && selectedRoute.active} disabled />
            </Tooltip>
            <br />
            {inputsToCreateOrModify}
            <br />
            <div align="right">
                <Button color="primary" onClick={() => requestPutRoute()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar la ruta con
                origen <b>{selectedRoute && selectedRoute.departure.cityName}</b> y
                destino <b>{selectedRoute && selectedRoute.destination.cityName}</b>?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => requestDeleteRoute()}>SÍ, ELIMINAR</Button>
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
                id="btnNewRoute"
                startIcon={<TrainIcon />}
                onClick={() => openCloseModalCreate()}>NUEVA RUTA</Button>
            <br /><br />
            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de rutas"
                actions={[
                    {
                        icon: () => <VisibilityIcon />,
                        tooltip: 'Visualización de ruta',
                        onClick: (event, rowData) => selectRoute(rowData, "Ver")
                    },
                    rowData => ({
                        icon: 'edit',
                        tooltip: (rowData.active === 'Activo') ? 'Editar ruta' : 'No se puede editar una ruta dada de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectRoute(rowData, "Editar")
                    }),
                    rowData => ({
                        icon: 'delete',
                        tooltip: (rowData.active === 'Activo') ? 'Eliminar ruta' : 'No se puede eliminar una ruta dada de baja',
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
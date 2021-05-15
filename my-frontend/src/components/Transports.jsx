import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialTable from '@material-table/core';
import Tooltip from '@material-ui/core/Tooltip';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import HelpIcon from '@material-ui/icons/Help';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {useStyles} from '../const/modalStyle';
import {Message} from '../components/Message';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import {
    getTransports,
    getTransportDependenceById,
    postTransport,
    putTransport,
    deleteTransport
} from '../api/Transports';
import {getAvailableDrivers} from "../api/Drivers";
import {
    ERROR_MSG_API_GET_TRANSPORTS,
    ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE,
    ERROR_MSG_EMPTY_DRIVER,
    ERROR_MSG_EMPTY_INTERNAL_IDENTIFICATION,
    ERROR_MSG_EMPTY_MODEL,
    ERROR_MSG_EMPTY_REGISTRATION_NUMBER,
    ERROR_MSG_INVALID_REGISTRATION_NUMBER,
    ERROR_MSG_EMPTY_SEATING,
    ERROR_MSG_INVALID_MAX_SEATING,
    ERROR_MSG_INVALID_MIN_SEATING,
    ERROR_MSG_INVALID_VALUE_SEATING,
    ERROR_MSG_EMPTY_TYPE_COMFORT,
    ERROR_MSG_API_POST_TRANSPORT,
    ERROR_MSG_API_PUT_TRANSPORT_ROUTE_DEPENDENCE,
    ERROR_MSG_API_DELETE_TRANSPORT,
    ERROR_MSG_API_DELETE_TRANSPORT_ROUTE_DEPENDENCE
} from "../const/messages";
import {
    REGEX_ONLY_NUMBER,
    REGEX_NEW_REGISTRATION_NUMBER,
    REGEX_OLD_REGISTRATION_NUMBER
} from "../const/regex";

const columns = [
    {title: 'Identificación interna', field: 'internalIdentification'},
    {title: 'Patente', field: 'registrationNumber'},
    {title: 'Modelo', field: 'model'},
    {title: 'Tipo de confort', field: 'comfort.typeComfortName'},
    {
        title: 'Chofer', render: (data) => `${data.driver.surname}, ${data.driver.name}`,
        customFilterAndSearch: (term, data) => (`${data.driver.surname.toLowerCase()}, ${data.driver.name.toLowerCase()}`).indexOf(term.toLowerCase()) !== -1
    },
    {title: 'Estado', field: 'active'}
];


function Transports() {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const formatSelectedTransport = {
        internalIdentification: "",
        registrationNumber: "",
        model: "",
        seating: "",
        comfort: {
            typeComfortId: "",
            typeComfortName: ""
        },
        driver: {
            userId: "",
            name: "",
            surname: "",
            email: "",
            phoneNumber: ""
        },
        active: "",
    };

    const styles = useStyles();
    const [data, setData] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [internalIdentificationError, setInternalIdentificationError] = useState(false);
    const [registrationNumberError, setRegistrationNumberError] = useState(false);
    const [modelError, setModelError] = useState(false);
    const [seatingError, setSeatingError] = useState(false);
    const [typeComfortSelectedError, setTypeComfortSelectedError] = useState(false);
    const [driverSelectedError, setDriverSelectedError] = useState(false);
    const [typeComfortSelected, setTypeComfortSelected] = useState('');
    const [driverSelected, setDriverSelected] = useState('');
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedTransport, setSelectedTransport] = useState(formatSelectedTransport);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const setDefaultValues = () => {
        setDefaultObjectsValues();
        setDefaultErrorMessages();
    };

    const setDefaultObjectsValues = () => {
        setSelectedTransport(formatSelectedTransport);
        setDriverSelected('');
        setTypeComfortSelected('');
    };

    const setDefaultErrorMessages = () => {
        setDefaultApiErrorMessages();
        setModelError(false);
        setSeatingError(false);
        setTypeComfortSelectedError(false);
        setDriverSelectedError(false);
    };

    const setDefaultApiErrorMessages = () => {
        setInternalIdentificationError(false);
        setRegistrationNumberError(false);
    };

    const handleChange = async e => {
        const {name, value} = e.target;

        if (name === 'driverSelected') {
            setDriverSelectedError(false);
            setDriverSelected(value);
        } else if (name === 'typeComfortSelected') {
            setTypeComfortSelectedError(false);
            setTypeComfortSelected(value);
        } else {
            setSelectedTransport(prevState => ({
                ...prevState,
                [name]: value
            }))

            switch (name) {
                case 'internalIdentification':
                    setInternalIdentificationError(false);
                    break;
                case 'registrationNumber':
                    setRegistrationNumberError(false);
                    break;
                case 'model':
                    setModelError(false);
                    break;
                case 'seating':
                    setSeatingError(false);
                    break;
                default:
                    console.log('Es necesario agregar un case más en el switch por el name:', name);
                    break;
            }
        }

        setSuccessMessage(null);
    };


    const validateForm = () => {
        return validateInternalIdentification() & validateModel() & validateRegistrationNumber() & validateSeating() & validateTypeComfort() & validateDriver();
    };

    const validateInternalIdentification = () => {
        if (!selectedTransport.internalIdentification) {
            setInternalIdentificationError(ERROR_MSG_EMPTY_INTERNAL_IDENTIFICATION);
            return false;
        }
        setInternalIdentificationError(null);
        return true;
    };

    const validateModel = () => {
        if (!selectedTransport.model) {
            setModelError(ERROR_MSG_EMPTY_MODEL);
            return false;
        }
        setModelError(null);
        return true;
    };

    const validateRegistrationNumber = () => {
        if (!selectedTransport.registrationNumber) {
            setRegistrationNumberError(ERROR_MSG_EMPTY_REGISTRATION_NUMBER);
            return false;
        } else if (!REGEX_OLD_REGISTRATION_NUMBER.test(selectedTransport.registrationNumber)
            && !REGEX_NEW_REGISTRATION_NUMBER.test(selectedTransport.registrationNumber)) {
            setRegistrationNumberError(ERROR_MSG_INVALID_REGISTRATION_NUMBER);
            return false;
        }
        setRegistrationNumberError(null);
        return true;
    };

    const validateSeating = () => {
        if (!selectedTransport.seating) {
            setSeatingError(ERROR_MSG_EMPTY_SEATING);
            return false;
        } else if (!REGEX_ONLY_NUMBER.test(selectedTransport.seating)) {
            setSeatingError(ERROR_MSG_INVALID_VALUE_SEATING);
            return false;
        } else if (selectedTransport.seating < 1) {
            setSeatingError(ERROR_MSG_INVALID_MIN_SEATING);
            return false;
        } else if (selectedTransport.seating > 99) {
            seatingError(ERROR_MSG_INVALID_MAX_SEATING);
            return false;
        }
        setSeatingError(null);
        return true;
    };

    const validateTypeComfort = () => {
        if (typeComfortSelected || selectedTransport.comfort.typeComfortId) {
            setTypeComfortSelectedError(null);
            return true;
        } else {
            setTypeComfortSelectedError(ERROR_MSG_EMPTY_TYPE_COMFORT);
            return false;
        }
    };

    const validateDriver = () => {
        if (driverSelected || selectedTransport.driver.userId) {
            setDriverSelectedError(null);
            return true;
        } else {
            setDriverSelectedError(ERROR_MSG_EMPTY_DRIVER);
            return false;
        }
    };

    const fetchData = async () => {
        try {
            let getTransportsResponse = await getTransports();

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
                setSuccessMessage(`${ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE} ${getTransportsResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE} ${getTransportsResponse}`
                });
            }


        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_TRANSPORTS} ${error}`);
        }
    };

    const requestPostTransport = async () => {
        if (validateForm()) {
            setDefaultApiErrorMessages();

            let postResponse = await postTransport(selectedTransport, typeComfortSelected, driverSelected);

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
                setInternalIdentificationError(postResponse.data.internalIdentificationError);
                setRegistrationNumberError(postResponse.data.registrationNumberError);
            } else if (postResponse.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });

                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_POST_TRANSPORT} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_TRANSPORT} ${postResponse}`
                });
            }
        }
    };

    const requestPutTransport = async () => {
        if (validateForm()) {
            setDefaultApiErrorMessages();

            let postResponse = await putTransport(selectedTransport,
                typeComfortSelected ? typeComfortSelected : selectedTransport.comfort.typeComfortId,
                driverSelected ? driverSelected : selectedTransport.driver.userId);

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
                setInternalIdentificationError(postResponse.data.internalIdentificationError);
                setRegistrationNumberError(postResponse.data.registrationNumberError);
            }  else if (postResponse.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });

                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_POST_TRANSPORT} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_TRANSPORT} ${postResponse}`
                });
            }
        }
    };

    const requestDeleteTransport = async () => {
        let deleteResponse = await deleteTransport(selectedTransport.transportId);

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
            setSuccessMessage(`${ERROR_MSG_API_DELETE_TRANSPORT} ${deleteResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_DELETE_TRANSPORT} ${deleteResponse}`
            });
        }
    };

    const selectTransport = async (transport, action) => {
        setSelectedTransport(transport);
        if (action === "Ver") {
            openCloseModalViewDetails()
        } else if (action === "Editar") {
            await openCloseModalUpdate(transport)
        } else {
            await openCloseModalDelete(transport)
        }
    };

    const requestGetAvailableDrivers = async () => {
        let getAvailableDriversResponse = await getAvailableDrivers();

        if (getAvailableDriversResponse.status === 200) {
            const availableDrivers = await getAvailableDrivers();
            setDrivers(availableDrivers.data);
        } else if (getAvailableDriversResponse.status === 500) {
            getAvailableDriversResponse(getAvailableDriversResponse.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: getAvailableDriversResponse.data
            });

            return true
        } else {
            setSuccessMessage(`${ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE} ${getAvailableDriversResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE} ${getAvailableDriversResponse}`
            });
        }
    }

    const openCloseModalCreate = async () => {
        setCreateModal(!createModal);

        // Data are loaded when the modal is open
        if (!createModal) {
            await requestGetAvailableDrivers();
        }

        setDefaultValues();
    };

    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
    };

    const openCloseModalUpdate = async (transport) => {
        // If the modal is closed, transport dependence is validate before open the modal
        if (!updateModal) {
            let dependenceResponse = await getTransportDependenceById(transport.transportId);

            // If the transport is used on a route, the modal will NOT be open
            if (dependenceResponse.data.transportRouteDependence) {
                setSuccessMessage(dependenceResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: ERROR_MSG_API_PUT_TRANSPORT_ROUTE_DEPENDENCE
                });
                setDefaultValues();
            } else {
                // If the transport is NOT used on a route, the modal will be open
                setUpdateModal(!updateModal);

                setTypeComfortSelected(selectedTransport.comfort.typeComfortId);
                setDriverSelected(selectedTransport.driver.userId);

                // Data are loaded when the modal is open
                await requestGetAvailableDrivers();
            }
        } else {
            // The modal is closed
            setUpdateModal(!updateModal);
            // Data are cleaned when the modal is closed
            setDefaultValues();
        }
    };

    const openCloseModalDelete = async (transport) => {
        // If the modal is closed, transport dependence is validate before open the modal
        if (!deleteModal) {
            let dependenceResponse = await getTransportDependenceById(transport.transportId);

            // If the transport is used on a route, the modal will NOT be open
            if (dependenceResponse.data.transportRouteDependence) {
                setSuccessMessage(dependenceResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: ERROR_MSG_API_DELETE_TRANSPORT_ROUTE_DEPENDENCE
                });
                setDefaultValues();
            } else {
                // If the transport is NOT used on a route, the modal will be open
                setDeleteModal(!deleteModal);
            }
        } else {
            // The modal is closed
            setDeleteModal(!deleteModal);
            // Data are cleaned when the modal is closed
            setDefaultValues();
        }
        /*
        setDeleteModal(!deleteModal);

        // Data are cleaned when the modal is closed
        if (deleteModal) {
            setSelectedTransport(formatSelectedTransport);
            setDriverSelected("");
            setTypeComfortSelected("");
        }*/
    };

    useEffect(() => {

        fetchData();
    }, []);

    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVA COMBI</h3>
            <TextField label="Identificación interna" id={"internalIdentification"} name="internalIdentification"
                       className={styles.inputMaterial}
                       required
                       inputProps={{maxLength: 5, style: {textTransform: 'uppercase'}}}
                       autoComplete='off'
                       error={(internalIdentificationError) ? true : false}
                       helperText={(internalIdentificationError) ? internalIdentificationError : false}
                       onChange={handleChange}/>
            <TextField label="Patente" id={"registrationNumber"} name="registrationNumber"
                       className={styles.inputMaterial}
                       required
                       inputProps={{maxLength: 7, style: {textTransform: 'uppercase'}}}
                       autoComplete='off'
                       error={(registrationNumberError) ? true : false}
                       helperText={(registrationNumberError) ? registrationNumberError : false}
                       onChange={handleChange}/>
            <TextField label="Modelo" id={"model"} name="model"
                       className={styles.inputMaterial}
                       required
                       inputProps={{maxLength: 45, style: {textTransform: 'capitalize'}}}
                       autoComplete='off'
                       error={(modelError) ? true : false}
                       helperText={(modelError) ? modelError : false}
                       onChange={handleChange}/>
            <TextField label="Cantidad de asientos" id={"seating"} name="seating"
                       className={styles.inputMaterial}
                       inputProps={{maxLength: 2}}
                       autoComplete='off'
                       required
                       error={(seatingError) ? true : false}
                       helperText={(seatingError) ? seatingError : false}
                       onChange={handleChange}/>
            <FormControl className={styles.inputMaterial}
                         required
                         error={(typeComfortSelectedError) ? true : false}>
                <InputLabel>Tipo de confort</InputLabel>
                <Select label="Tipo de confort" id="typeComfortSelected" labelId={"typeComfortSelected"}
                        name="typeComfortSelected"
                        className={styles.selectEmpty}
                        value={(typeComfortSelected) ? typeComfortSelected : 0}
                        displayEmpty
                        onChange={handleChange}
                >
                    <MenuItem value={0} disabled> Seleccione un tipo de confort </MenuItem>
                    <MenuItem key={1} value={1}> Cómoda </MenuItem>
                    <MenuItem key={2} value={2}> Súper-cómoda </MenuItem>
                </Select>
                <FormHelperText>{(typeComfortSelectedError) ? typeComfortSelectedError : false}</FormHelperText>
            </FormControl>
            <FormControl className={styles.inputMaterial}
                         required
                         error={(driverSelectedError) ? true : false}>
                <InputLabel>Chofer</InputLabel>
                <Select label="Chofer" id="driverSelected" labelId={"driverSelected"} name="driverSelected"
                        className={styles.inputMaterial}
                        value={(driverSelected) ? driverSelected : 0}
                        displayEmpty
                        onChange={handleChange}
                >
                    <MenuItem value={0} disabled>
                        Seleccione un chofer
                    </MenuItem>
                    {(drivers) ?
                        drivers.map((drivers) => (
                            <MenuItem
                                key={drivers.userId}
                                value={drivers.userId}
                            >
                                {drivers.surname}, {drivers.name}

                            </MenuItem>
                        ))
                        : null
                    }
                </Select>
                <FormHelperText>{(driverSelectedError) ? driverSelectedError : false}</FormHelperText>
            </FormControl>
            <Tooltip
                title="Se considera disponible si el chofer no está dado de baja ni está asignado a otra combi">
                <FormHelperText>
                    <HelpIcon color='primary' fontSize="small"/>
                    Sólo se visualizan los choferes disponibles
                </FormHelperText>
            </Tooltip>
            <br/>
            <div align="right">
                <Button color="primary" onClick={() => requestPostTransport()}>GUARDAR</Button>
                <Button onClick={() => openCloseModalCreate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE LA COMBI</h3>
            <TextField className={styles.inputMaterial} label="Estado" name="active"
                       value={selectedTransport && selectedTransport.active}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Identificación interna" name="internalIdentification"
                       value={selectedTransport && selectedTransport.internalIdentification}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Patente" name="registrationNumber"
                       value={selectedTransport && selectedTransport.registrationNumber}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Modelo" name="model"
                       value={selectedTransport && selectedTransport.model}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Cantidad de asientos" name="seating"
                       value={selectedTransport && selectedTransport.seating}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Tipo de confort" name="type_comfort_name"
                       value={selectedTransport && selectedTransport.comfort.typeComfortName}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Chofer" name="driver"
                       value={selectedTransport && `${selectedTransport.driver.surname}, ${selectedTransport.driver.name}`}/>
            <br/><br/>

            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
            </div>
        </div>
    );

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR COMBI</h3>
            <Tooltip title="Debe eliminar la combi para cambiar el estado">
                <TextField label="Estado" id={"active"} name="active"
                           className={styles.inputMaterial}
                           disabled
                           value={selectedTransport && selectedTransport.active}/>
            </Tooltip>
            <br/>
            <TextField label="Identificación interna" id={"internalIdentification"} name="internalIdentification"
                       className={styles.inputMaterial}
                       required
                       inputProps={{maxLength: 5, style: {textTransform: 'uppercase'}}}
                       autoComplete='off'
                       error={(internalIdentificationError) ? true : false}
                       helperText={(internalIdentificationError) ? internalIdentificationError : false}
                       value={selectedTransport && selectedTransport.internalIdentification}
                       onChange={handleChange}/>
            <TextField label="Patente" id={"registrationNumber"} name="registrationNumber"
                       className={styles.inputMaterial}
                       required
                       inputProps={{maxLength: 7, style: {textTransform: 'uppercase'}}}
                       autoComplete='off'
                       error={(registrationNumberError) ? true : false}
                       helperText={(registrationNumberError) ? registrationNumberError : false}
                       value={selectedTransport && selectedTransport.registrationNumber}
                       onChange={handleChange}/>
            <TextField label="Modelo" id={"model"} name="model"
                       className={styles.inputMaterial}
                       required
                       inputProps={{maxLength: 45, style: {textTransform: 'capitalize'}}}
                       autoComplete='off'
                       error={(modelError) ? true : false}
                       helperText={(modelError) ? modelError : false}
                       value={selectedTransport && selectedTransport.model}
                       onChange={handleChange}/>
            <TextField label="Cantidad de asientos" id={"seating"} name="seating"
                       className={styles.inputMaterial}
                       inputProps={{maxLength: 2}}
                       autoComplete='off'
                       required
                       error={(seatingError) ? true : false}
                       helperText={(seatingError) ? seatingError : false}
                       value={selectedTransport && selectedTransport.seating}
                       onChange={handleChange}/>
            <FormControl className={styles.inputMaterial}
                         required>
                <InputLabel>Tipo de confort</InputLabel>
                <Select label="Tipo de comfort" labelId="typeComfortSelected" id="typeComfortSelected"
                        name="typeComfortSelected"
                        className={styles.inputMaterial}
                        value={(typeComfortSelected) ? typeComfortSelected : selectedTransport.comfort.typeComfortId}
                        onChange={handleChange}
                        displayEmpty
                >
                    <MenuItem value={0} disabled> Seleccione un tipo de confort </MenuItem>
                    <MenuItem key={1} value={1}> Cómoda </MenuItem>
                    <MenuItem key={2} value={2}> Súper-cómoda </MenuItem>
                </Select>
                <FormHelperText>{(typeComfortSelectedError) ? typeComfortSelectedError : false}</FormHelperText>
            </FormControl>
            <FormControl className={styles.inputMaterial}
                         required>
                <InputLabel>Chofer</InputLabel>
                <Select label="Chofer" labelId="driverSelected" id="driverSelected" name="driverSelected"
                        className={styles.inputMaterial}
                        value={(driverSelected) ? driverSelected : selectedTransport.driver.userId}
                        onChange={handleChange}
                        displayEmpty
                >
                    <MenuItem value="" disabled>
                        Seleccione un chofer
                    </MenuItem>
                    <MenuItem value={selectedTransport.driver.userId}>
                        {selectedTransport.driver.surname}, {selectedTransport.driver.name}
                    </MenuItem>
                    {(drivers) ?
                        drivers.filter((item) => item.userId !== selectedTransport.driver.userId)
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
                <Button color="primary" onClick={() => requestPutTransport()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar la combi con
                identificación <b>{selectedTransport && selectedTransport.internalIdentification}</b> y
                patente <b>{selectedTransport && selectedTransport.registrationNumber}</b>?
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
                             handleClose={options.handleClose}/>
                    : null
            }
            <br/>
            <Button style={{marginLeft: '8px'}}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnNewCombi"
                    startIcon={<AirportShuttleIcon/>}
                    onClick={() => openCloseModalCreate()}>NUEVA COMBI</Button>
            <br/><br/>
            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de combis"
                actions={[
                    {
                        icon: () => <VisibilityIcon/>,
                        tooltip: 'Visualización de combi',
                        onClick: (event, rowData) => selectTransport(rowData, "Ver")
                    },
                    rowData => ({
                        icon: 'edit',
                        tooltip: (rowData.active === 'Activo') ? 'Editar combi' : 'No se puede editar una combi dada de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectTransport(rowData, "Editar")
                    }),
                    rowData => ({
                        icon: 'delete',
                        tooltip: (rowData.active === 'Activo') ? 'Eliminar combi' : 'No se puede eliminar una combi dada de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectTransport(rowData, "Eliminar")
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

export default Transports;

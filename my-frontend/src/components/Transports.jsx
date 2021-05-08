import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialTable from "material-table";
import Tooltip from '@material-ui/core/Tooltip';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import HelpIcon from '@material-ui/icons/Help';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {useStyles} from '../const/modalStyle';
import {Message} from '../components/Message';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import {
    getTransports,
    postTransport
} from '../api/Transports';
import {getAvailableDrivers} from "../api/Drivers";
import {
    ERROR_MSG_API_GET_TRANSPORTS,
    ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE,
    ERROR_MSG_API_POST_DRIVER,
    ERROR_MSG_EMPTY_DRIVER,
    ERROR_MSG_EMPTY_INTERNAL_IDENTIFICATION,
    ERROR_MSG_EMPTY_MODEL,
    ERROR_MSG_EMPTY_REGISTRATION_NUMBER,
    ERROR_MSG_INVALID_REGISTRATION_NUMBER,
    ERROR_MSG_EMPTY_SEATING,
    ERROR_MSG_INVALID_MAX_SEATING,
    ERROR_MSG_INVALID_MIN_SEATING,
    ERROR_MSG_INVALID_VALUE_SEATING,
    ERROR_MSG_EMPTY_TYPE_COMFORT
} from "../const/messages";
import {
    REGEX_ONLY_NUMBER,
    REGEX_NEW_REGISTRATION_NUMBER,
    REGEX_OLD_REGISTRATION_NUMBER
} from "../const/regex";

const columns = [
    {title: 'Identificación interna', field: 'internal_identification'},
    {title: 'Patente', field: 'registration_number'},
    {title: 'Modelo', field: 'model'},
    {title: 'Tipo de confort', field: 'comfort.type_comfort_name'},
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
        internal_identification: "",
        registration_number: "",
        model: "",
        seating: "",
        comfort: {
            type_comfort_id: "",
            type_comfort_name: ""
        },
        driver: {
            user_id: "",
            name: "",
            surname: "",
            email: "",
            phone_number: ""
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

    const handleChange = async e => {
        const {name, value} = e.target;
        console.log('name:', name);
        console.log('value:', value);

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
                case 'internal_identification':
                    setInternalIdentificationError(false);
                    break;
                case 'registration_number':
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


        /*
        if (name === 'driverSelected') {
            setDriverSelected(value);
        } else if (name === 'typeComfortSelected') {
            setTypeComfortSelected(value);
        } else {
            setSelectedTransport(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        */

        setSuccessMessage(null);
        /*
        console.log('typeComfortSelected:', typeComfortSelected);
        console.log('driverSelected:', driverSelected);
        console.log('setSelectedTransport:', selectedTransport);
        */
    };


    const validateForm = () => {
        return validateInternalIdentification() & validateModel() & validateRegistrationNumber() & validateSeating() & validateTypeComfort() & validateDriver();
    };

    const validateInternalIdentification = () => {
        console.log('valor de !selectedTransport.internal_identification',selectedTransport.internal_identification)
        if (!selectedTransport.internal_identification) {
            setInternalIdentificationError(ERROR_MSG_EMPTY_INTERNAL_IDENTIFICATION);
            return false;
        }
        setInternalIdentificationError(null);
        return true;
    };

    const validateModel = () => {
        console.log('valor de !selectedTransport.internal_identification',selectedTransport.model)
        if (!selectedTransport.model) {
            setModelError(ERROR_MSG_EMPTY_MODEL);
            return false;
        }
        setModelError(null);
        return true;
    };

    const validateRegistrationNumber = () => {
        if (!selectedTransport.registration_number) {
            setRegistrationNumberError(ERROR_MSG_EMPTY_REGISTRATION_NUMBER);
            return false;
        } else if (!REGEX_OLD_REGISTRATION_NUMBER.test(selectedTransport.registration_number)
            && !REGEX_NEW_REGISTRATION_NUMBER.test(selectedTransport.registration_number)) {
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
        if (typeComfortSelected) {
            setTypeComfortSelectedError(null);
            return true;
        } else {
            setTypeComfortSelectedError(ERROR_MSG_EMPTY_TYPE_COMFORT);
            return false;
        }
    };

    const validateDriver = () => {
        if (driverSelected) {
            setDriverSelectedError(null);
            return true;
        } else {
            setDriverSelectedError(ERROR_MSG_EMPTY_DRIVER);
            return false;
        }
    };

    const saveTransport = async () => {
        if (validateForm()) {
            setInternalIdentificationError(false);
            setRegistrationNumberError(false);

            let postResponse = await postTransport(selectedTransport, typeComfortSelected, driverSelected);

            if (postResponse.status === 201) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: postResponse.data
                });

                await openCloseModalCreate();
                return true
            } else if (postResponse.status === 400) {
                setInternalIdentificationError(postResponse.data.internalIdentificationError);
                setRegistrationNumberError(postResponse.data.registrationNumberError);
            } else if (postResponse.status === 500) {
                setSuccessMessage(`${ERROR_MSG_API_POST_DRIVER} ${postResponse.data}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_DRIVER} ${postResponse.data}`
                });

                return true
            }

        }
    };


    const putTransport = async () => {
        /*
        await axios.put(baseUrl + "/" + selectedTransport.id, selectedTransport)
            .then(response => {
                var dataNueva = data;
                dataNueva.map(internal_identification => {
                    if (internal_identification.id === selectedTransport.id) {
                        internal_identification.internal_identification = selectedTransport.internal_identification;
                        internal_identification.registration_number = selectedTransport.registration_number;
                        internal_identification.driver = selectedTransport.driver;
                        internal_identification.model = selectedTransport.model;
                    }
                });
                setData(dataNueva);
                openCloseModalUpdate();
            }).catch(error => {
                console.log(error);
            })
            */
    };

    const deleteTransport = async () => {
        /*
        await axios.delete(baseUrl + "/" + selectedTransport.id)
            .then(response => {
                setData(data.filter(internal_identification => internal_identification.id !== selectedTransport.id));
                openCloseModalDelete();
            }).catch(error => {
                console.log(error);
            })
            */
    };

    const selectTransport = async (transport, action) => {
        setSelectedTransport(transport);
        if (action === "Ver") {
            openCloseModalViewDetails()
        } else if (action === "Editar") {
            await openCloseModalUpdate()
        } else {
            await openCloseModalDelete()
        }
    };

    const openCloseModalCreate = async () => {
        setCreateModal(!createModal);

        // Data are loaded when the modal is open
        if (!createModal) {
            try {
                const availableDrivers = await getAvailableDrivers();
                setDrivers(availableDrivers);
            } catch (error) {
                console.log(`${ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE} ${error}`);
            }
        }

        setDriverSelected("");
        setTypeComfortSelected("");
        setSelectedTransport(formatSelectedTransport);
        setInternalIdentificationError(false);
        setRegistrationNumberError(false);
        setModelError(false);
        setSeatingError(false);
        setTypeComfortSelectedError(false);
        setDriverSelectedError(false);
    };

    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
    };

    const openCloseModalUpdate = async () => {
        setUpdateModal(!updateModal);

        // Data are loaded when the modal is open
        if (!updateModal) {
            try {
                const availableDrivers = await getAvailableDrivers();
                setDrivers(availableDrivers);
            } catch (error) {
                console.log(`${ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE} ${error}`);
            }
        }

        // Data are cleaned when the modal is closed
        if (updateModal) {
            setSelectedTransport(formatSelectedTransport);
            setDriverSelected("");
            setTypeComfortSelected("");
        }

    };

    const openCloseModalDelete = async () => {
        setDeleteModal(!deleteModal);

        // Data are cleaned when the modal is closed
        if (deleteModal) {
            setSelectedTransport(formatSelectedTransport);
            setDriverSelected("");
            setTypeComfortSelected("");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await getTransports();

                for (let index = 0; index < data.length; index++) {
                    if (data[index].active === 0) {
                        data[index].active = 'Inactivo';
                    } else if (data[index].active === 1) {
                        data[index].active = 'Activo'
                    } else {
                        data[index].active = 'Estado inválido'
                    }
                }
                setData(data);
            } catch (error) {
                console.log(`${ERROR_MSG_API_GET_TRANSPORTS} ${error}`);
            }
        };
        fetchData();
    }, []);

    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVA COMBI</h3>
            <TextField label="Identificación interna" id={"internal_identification"} name="internal_identification"
                       className={styles.inputMaterial}
                       required
                       inputProps={{maxLength: 5, style: {textTransform: 'uppercase'}}}
                       autoComplete='off'
                       error={(internalIdentificationError) ? true : false}
                       helperText={(internalIdentificationError) ? internalIdentificationError : false}
                       onChange={handleChange}/>
            <TextField label="Patente" id={"registration_number"} name="registration_number"
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
                    {drivers.map((drivers) => (
                        <MenuItem
                            key={drivers.user_id}
                            value={drivers.user_id}
                        >
                            {drivers.surname}, {drivers.name}

                        </MenuItem>
                    ))}
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
                <Button color="primary" onClick={() => saveTransport()}>GUARDAR</Button>
                <Button onClick={() => openCloseModalCreate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE LA COMBI</h3>
            <TextField className={styles.inputMaterial} label="Identificación interna" name="internal_identification"
                       value={selectedTransport && selectedTransport.internal_identification}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Patente" name="registration_number"
                       value={selectedTransport && selectedTransport.registration_number}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Modelo" name="model"
                       value={selectedTransport && selectedTransport.model}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Cantidad de asientos" name="seating"
                       value={selectedTransport && selectedTransport.seating}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Tipo de confort" name="type_comfort_name"
                       value={selectedTransport && selectedTransport.comfort.type_comfort_name}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Estado" name="active"
                       value={selectedTransport && selectedTransport.active}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Chofer" name="driver"
                       value={selectedTransport && `${selectedTransport.driver.surname}, ${selectedTransport.driver.name}`}/>
            <br/><br/>

            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>Cancelar</Button>
            </div>
        </div>
    );

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR COMBI</h3>
            <TextField inputProps={{maxLength: 5}}
                       className={styles.inputMaterial} label="Identificación interna" name="internal_identification"
                       onChange={handleChange}
                       value={selectedTransport && selectedTransport.internal_identification}/>
            <br/>
            <TextField inputProps={{maxLength: 7}}
                       className={styles.inputMaterial} label="Patente" name="registration_number"
                       onChange={handleChange}
                       value={selectedTransport && selectedTransport.registration_number}/>
            <br/>
            <TextField inputProps={{maxLength: 45}}
                       className={styles.inputMaterial} label="Modelo" name="model" onChange={handleChange}
                       value={selectedTransport && selectedTransport.model}/>
            <br/>
            <TextField inputProps={{maxLength: 2}} InputProps={{min: 1, max: 99}}
                       className={styles.inputMaterial} label="Cantidad de asientos" name="seating"
                       onChange={handleChange}
                       value={selectedTransport && selectedTransport.seating}/>
            <br/>
            <FormHelperText>Tipo de confort</FormHelperText>
            <Select
                label="Tipo de comfort"
                labelId="typeComfortSelected"
                id="typeComfortSelected"
                name="typeComfortSelected"
                value={(typeComfortSelected) ? typeComfortSelected : selectedTransport.comfort.type_comfort_id}
                onChange={handleChange}
                displayEmpty
                className={styles.inputMaterial}
            >
                <MenuItem value="" disabled> Seleccione un tipo de confort </MenuItem>
                <MenuItem key={1} value={1}> Cómoda </MenuItem>
                <MenuItem key={2} value={2}> Súper-cómoda </MenuItem>

            </Select>
            <br/>
            <Tooltip title="Debe eliminar la combi para cambiar el estado">
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                           value={selectedTransport && selectedTransport.active} disabled/>
            </Tooltip>
            <br/>
            <FormControl required className={styles.inputMaterial}>
                <InputLabel>Chofer</InputLabel>
                <Select
                    label="Chofer"
                    labelId="driverSelected"
                    id="driverSelected"
                    name="driverSelected"
                    value={(driverSelected) ? driverSelected : selectedTransport.driver.user_id}
                    onChange={handleChange}
                    displayEmpty
                    className={styles.inputMaterial}
                >
                    <MenuItem value="" disabled>
                        Seleccione un chofer
                    </MenuItem>
                    <MenuItem value={selectedTransport.driver.user_id}>
                        {selectedTransport.driver.surname}, {selectedTransport.driver.name}
                    </MenuItem>
                    {drivers.map((drivers) => (
                        <MenuItem
                            key={drivers.user_id}
                            value={drivers.user_id}
                        >
                            {drivers.surname}, {drivers.name}
                        </MenuItem>
                    ))}
                </Select>
                <Tooltip
                    title="Se considera disponible si el chofer no está dado de baja ni está asignado a otra combi">
                    <FormHelperText>
                        <HelpIcon color='primary' fontSize="small"/>
                        Sólo se visualizan los choferes disponibles
                    </FormHelperText>
                </Tooltip>
            </FormControl>

            <br/><br/>
            <div align="right">
                <Button color="primary" onClick={() => putTransport()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar la combi con
                identificación <b>{selectedTransport && selectedTransport.internal_identification}</b> y
                patente <b>{selectedTransport && selectedTransport.registration_number}</b>?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => deleteTransport()}>SÍ, ELIMINAR</Button>
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

// Importo de elemntos de material ui, las apis que utilizo y el componente del mensaje
import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from "material-table";
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import { getDrivers, postDrivers, putDrivers, deleteDrivers } from '../api/Drivers.js';
import { Message } from "./Message";
// Importo los mensajes de error
import {
    ERROR_MSG_EMPTY_PHONE_NUMBER,
    ERROR_MSG_EMPTY_EMAIL,
    ERROR_MSG_EMPTY_NAME,
    ERROR_MSG_EMPTY_PASSWORD,
    ERROR_MSG_EMPTY_REPEAT_PASSWORD,
    ERROR_MSG_EMPTY_SURNAME,
    ERROR_MSG_INVALID_PHONE_NUMBER,
    ERROR_MSG_INVALID_EMAIL,
    ERROR_MSG_INVALID_NAME,
    ERROR_MSG_INVALID_PASSWORD_NO_CAPITAL_LETTERS,
    ERROR_MSG_INVALID_PASSWORD_NO_LOWER_CASE,
    ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS,
    ERROR_MSG_PASSWORD_NO_MATCH,
    ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS,
    ERROR_MSG_INVALID_SURNAME,
    ERROR_MSG_API_GET_DRIVERS,
    ERROR_MSG_API_POST_DRIVER,
    ERROR_MSG_API_PUT_DRIVER,
    ERROR_MSG_API_DELETE_DRIVER
} from '../const/messages.js';

// Importo las expresiones regulares
import {
    REGEX_PHONE,
    REGEX_EMAIL,
    REGEX_ONLY_ALPHABETICAL
} from '../const/regex.js';

// La configuracion en castellano
import { materialTableConfiguration } from '../const/materialTableConfiguration';

//Nombre de las columnas de los datos a mostrar y la aclaracion de que campo representan
const columns = [
    { title: 'Nombre', field: 'names' },
    { title: 'Apellido', field: 'surname' },
    { title: 'Email', field: 'email' },
];

//Los estilos de los modals
const useStyles = makeStyles((theme) => ({
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    iconos: {
        cursor: 'pointer'
    },
    inputMaterial: {
        width: '100%'
    }
}));

function Drivers() {
    //Configuracion del mensaje de exito o error
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };
    //Fortmato que tiene los datos al selecccionarlos para mostrarlos en un modal
    const formatSelectedDriver = {
        id: "",
        names: "",
        surname: "",
        email: "",
        password1: "",
        password2: "",
        phoneNumber: "",
        active: ""
    }
    const styles = useStyles();
    //Aca se guarda los datos al hacer el get
    const [data, setData] = useState([]);
    //Mensaje de error de los inputs
    const [emailError, setEmailError] = React.useState(null);
    const [namesError, setNamesError] = React.useState(null);
    const [surnameError, setSurnameError] = React.useState(null);
    const [password1Error, setPassword1Error] = React.useState(null);
    const [password2Error, setPassword2Error] = React.useState(null);
    const [phoneNumberError, setPhoneNumberError] = React.useState(null);
    //Para abrir y cerrar los modales
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    //Aca se guarda los datos de la fila seleccionada
    const [selectedDriver, setSelectedDriver] = useState(formatSelectedDriver);
    //Elementos para configurar los mensajes
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    //Cuando se actualiza un valor de un input esta funcion actualiza los datos
    const handleChange = (textFieldAtributes) => {
        const { name, value } = textFieldAtributes.target;
        setSelectedDriver(prevState => ({
            ...prevState,
            [name]: value
        }));

        //Saca el mensaje de error segun el input que se modifico
        switch (name) {
            case 'email':
                setEmailError(null);
                break;
            case 'names':
                setNamesError(null);
                break;
            case 'surname':
                setSurnameError(null);
                break;
            case 'password1':
                setPassword1Error(null);
                break;
            case 'password2':
                setPassword2Error(null);
                break;
            case 'phoneNumber':
                setPhoneNumberError(null);
                break;
            default:
                console.log('Es necesario agregar un case más en el switch por el name:', name);
                break;
        }
    }
    //Aca arrancan las validaciones de los datos del chofer
    const validateForm = () => {
        return validateEmail() & validateName() & validateSurname() & validatePassword() & comparePasswords() & validatePhoneNumber();
    };

    const setDefaultErrorMessages = () => {
        setEmailError('');
        setNamesError('');
        setSurnameError('');
        setPassword1Error('');
        setPassword2Error('');
        setPhoneNumberError('');
    };

    const validateEmail = () => {
        if (!selectedDriver.email) {
            setEmailError(ERROR_MSG_EMPTY_EMAIL);
            return false;
        }
        if (!REGEX_EMAIL.test(selectedDriver.email)) {
            setEmailError(ERROR_MSG_INVALID_EMAIL);
            return false;
        }

        setEmailError(null);
        return true;
    }

    const validateName = () => {
        if (!selectedDriver.names) {
            setNamesError(ERROR_MSG_EMPTY_NAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(selectedDriver.names)) {
            setNamesError(ERROR_MSG_INVALID_NAME);
            return false;
        }

        setNamesError(null);
        return true;
    }
    const validateSurname = () => {
        if (!selectedDriver.surname) {
            setSurnameError(ERROR_MSG_EMPTY_SURNAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(selectedDriver.surname)) {
            setSurnameError(ERROR_MSG_INVALID_SURNAME);
            return false;
        }

        setSurnameError(null);
        return true;
    }

    const validatePassword = () => {
        const reg1 = /[1-9]/;
        /*const reg2 = /[A-Z]/;
        const reg3 = /[a-z]/;*/

        if (!selectedDriver.password1) {
            setPassword1Error(ERROR_MSG_EMPTY_PASSWORD);
            return false;
        } else if (selectedDriver.password1.length < 6) {
            setPassword1Error(ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS);
            return false;
        } else if (!reg1.test(selectedDriver.password1)) {
            setPassword1Error(ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS);
            return false;
        }/* else if (!reg2.test(selectedDriver.password1)) {
            setPassword1Error(ERROR_MSG_INVALID_NO_CAPITAL_LETTERS);
            return false;
        } else if (!reg3.test(selectedDriver.password1)) {
            setPassword1Error(ERROR_MSG_INVALID_NO_LOWER_CASE);
            return false;
        } */

        setPassword1Error(null);
        return true;
    }

    const comparePasswords = () => {
        if (!selectedDriver.password2) {
            setPassword2Error(ERROR_MSG_EMPTY_REPEAT_PASSWORD);
            return false;
        } else if (selectedDriver.password1 !== selectedDriver.password2) {
            setPassword2Error(ERROR_MSG_PASSWORD_NO_MATCH);
            return false;
        }

        setPassword2Error(null);
        return true;
    }

    const validatePhoneNumber = () => {
        if (!selectedDriver.phoneNumber) {
            setPhoneNumberError(ERROR_MSG_EMPTY_PHONE_NUMBER);
            return false;
        } else if (REGEX_PHONE.test(selectedDriver.phoneNumber)) {
            setPhoneNumberError(ERROR_MSG_INVALID_PHONE_NUMBER);
            return false;
        }
        setPhoneNumberError(null);
        return true;
    }
    // Aca ingreso un chofer nuevo
    const peticionPost = async () => {
        if (validateForm()) {
            let postResponse = await postDrivers(selectedDriver);
            if (postResponse.status === 201) {
                setSuccessMessage(`Se ha creado el chofer correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha creado el chofer correctamente`
                });
                openCloseModalCreate();
                fetchData();
            } else if (postResponse?.status === 400) {
                setEmailError(postResponse.data.emailError);
                setNamesError(postResponse.data.namesError);
                setSurnameError(postResponse.data.surnameError);
                setPhoneNumberError(postResponse.data.phoneNumberError);
                setPassword1Error(postResponse.data.passwordError1);
                setPassword2Error(postResponse.data.passwordError2);
            } else if (postResponse?.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_POST_DRIVER} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_DRIVER} ${postResponse}`
                });
            }
        }
    }
    //Aca realizo la actualizacion de los datos del chofer
    const peticionPut = async () => {
        if (validateForm()) {
            let postResponse = await putDrivers(selectedDriver,selectedDriver.id);

            if (postResponse.status === 200) {
                setSuccessMessage(`Se ha actualizado el chofer correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha actualizado el chofer correctamente`
                });
                openCloseModalUpdate();
                fetchData();
            } else if (postResponse?.status === 400) {
                setEmailError(postResponse.data.emailError);
                setNamesError(postResponse.data.namesError);
                setSurnameError(postResponse.data.surnameError);
                setPhoneNumberError(postResponse.data.phoneNumberError);
                setPassword1Error(postResponse.data.passwordError1);
                setPassword2Error(postResponse.data.passwordError2);
            } else if (postResponse?.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_PUT_DRIVER} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_DRIVER} ${postResponse}`
                });
            }
        }
    }
    //Aca elimino a un chofer
    const peticionDelete = async () => {
            let postResponse = await deleteDrivers(selectedDriver.id);

            if (postResponse.status === 200) {
                setSuccessMessage(`Se ha eliminado el chofer correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha eliminado el chofer correctamente`
                });
                openCloseModalDelete();
                fetchData();
            } else if (postResponse?.status === 500 || postResponse?.status === 400) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });
            } else {
                setSuccessMessage(`${ERROR_MSG_API_DELETE_DRIVER} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_DELETE_DRIVER} ${postResponse}`
                });
            }
    }
    //Aca dependiendo del boton que se apreto abro el modal correspondiente
    const selectDriver = (driver, action) => {
        setSelectedDriver(driver);
        if (action === "Ver") {
            openCloseModalViewDetails()
        } else if (action === "Editar") {
            openCloseModalUpdate()
        } else {
            openCloseModalDelete()
        }
    }
    //Metodos para cerrar y abrir modales, pone los valores por defecto cuando los abro
    const openCloseModalCreate = () => {
        setCreateModal(!createModal);
        if (createModal) {
            setSelectedDriver(formatSelectedDriver);
            setDefaultErrorMessages();
        }
    }

    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
        if (viewModal) {
            setSelectedDriver(formatSelectedDriver);
        }
    }
    const openCloseModalUpdate = () => {
        setUpdateModal(!updateModal);
        if (updateModal) {
            setSelectedDriver(formatSelectedDriver);
            setDefaultErrorMessages();
        }
    }

    const openCloseModalDelete = () => {
        setDeleteModal(!deleteModal);
        if (deleteModal) {
            setSelectedDriver(formatSelectedDriver);
        }
    }
    //Aca busco los datos de los choferes del backend
    const fetchData = async () => {
        try {
            let getDriversResponse = await getDrivers();

            if (getDriversResponse.status === 200) {
                let data = getDriversResponse.data;

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
            }

        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_DRIVERS} ${error}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    //Modal de creacion
    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO CHOFER</h3>
            <TextField className={styles.inputMaterial} label="Nombre del chofer" name="names"
                required
                inputProps={{ maxLength: 70, style: { textTransform: 'capitalize' } }}
                autoComplete='off'
                error={(namesError) ? true : false}
                helperText={(namesError) ? namesError : false}
                onChange={handleChange}
                value={selectedDriver && selectedDriver.names} />
            <br />
            <TextField className={styles.inputMaterial} label="Apellido del chofer" name="surname"
                required
                inputProps={{ maxLength: 70, style: { textTransform: 'capitalize' } }}
                autoComplete='off'
                error={(surnameError) ? true : false}
                helperText={(surnameError) ? surnameError : false}
                onChange={handleChange}
                value={selectedDriver && selectedDriver.surname} />
            <br />
            <TextField className={styles.inputMaterial} label="Email del chofer" name="email" onChange={handleChange}
                required
                inputProps={{ maxLength: 90 }}
                autoComplete='off'
                error={(emailError) ? true : false}
                helperText={(emailError) ? emailError : false}
                value={selectedDriver && selectedDriver.email} />
            <br />
            <TextField className={styles.inputMaterial} label="Numero de telefono del chofer" name="phoneNumber"
                required
                inputProps={{ maxLength: 30 }}
                autoComplete='off'
                error={(phoneNumberError) ? true : false}
                helperText={(phoneNumberError) ? phoneNumberError : false}
                onChange={handleChange}
                value={selectedDriver && selectedDriver.phoneNumber} />
            <br />
            <TextField className={styles.inputMaterial} label="Contraseña del chofer" name="password1"
                required
                inputProps={{ maxLength: 70 }}
                autoComplete='off'
                error={(password1Error) ? true : false}
                helperText={(password1Error) ? password1Error : false}
                onChange={handleChange}
                value={selectedDriver && selectedDriver.password1} />
            <br />
            <TextField className={styles.inputMaterial} label="Ingrese nuevamente la contraseña del chofer"
                required
                inputProps={{ maxLength: 70 }}
                autoComplete='off'
                error={(password2Error) ? true : false}
                helperText={(password2Error) ? password2Error : false}
                name="password2" onChange={handleChange}
                value={selectedDriver && selectedDriver.password2} />
            <br /><br />
            <div align="right">
                <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
                <Button onClick={() => openCloseModalCreate()}>Cancelar</Button>
            </div>
        </div>
    )
    // Modal de vizualizacion
    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE EL CHOFER</h3>
            <TextField className={styles.inputMaterial} label="Estado" name="active"
                value={selectedDriver && selectedDriver.active} />
            <br />
            <TextField className={styles.inputMaterial} label="Nombre del chofer" name="names"
                value={selectedDriver && selectedDriver.names} />
            <br />
            <TextField className={styles.inputMaterial} label="Apellido del chofer" name="surname"
                value={selectedDriver && selectedDriver.surname} />
            <br />
            <TextField className={styles.inputMaterial} label="Email del chofer" name="email" onChange={handleChange}
                value={selectedDriver && selectedDriver.email} />
            <br />
            <TextField className={styles.inputMaterial} label="Numero de telefono del chofer" name="phoneNumber"
                value={selectedDriver && selectedDriver.phoneNumber} />
            <br />
            <TextField className={styles.inputMaterial} label="Contraseña del chofer" name="password1"
                value={selectedDriver && selectedDriver.password1} />
            <br /><br />
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>SALIR</Button>
            </div>
        </div>
    )
    // Modal de actualizacion
    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR CHOFER</h3>
            <Tooltip title="Debe eliminar la combi para cambiar el estado">
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                    value={selectedDriver && selectedDriver.active} disabled />
            </Tooltip>
            <TextField className={styles.inputMaterial} label="Nombre del chofer" name="names"
                required
                inputProps={{ maxLength: 70, style: { textTransform: 'capitalize' } }}
                autoComplete='off'
                error={(namesError) ? true : false}
                helperText={(namesError) ? namesError : false}
                onChange={handleChange}
                value={selectedDriver && selectedDriver.names} />
            <br />
            <TextField className={styles.inputMaterial} label="Apellido del chofer" name="surname"
                required
                inputProps={{ maxLength: 70, style: { textTransform: 'capitalize' } }}
                autoComplete='off'
                error={(surnameError) ? true : false}
                helperText={(surnameError) ? surnameError : false}
                onChange={handleChange}
                value={selectedDriver && selectedDriver.surname} />
            <br />
            <TextField className={styles.inputMaterial} label="Email del chofer" name="email" onChange={handleChange}
                required
                inputProps={{ maxLength: 90 }}
                autoComplete='off'
                error={(emailError) ? true : false}
                helperText={(emailError) ? emailError : false}
                value={selectedDriver && selectedDriver.email} />
            <br />
            <TextField className={styles.inputMaterial} label="Numero de telefono del chofer" name="phoneNumber"
                required
                inputProps={{ maxLength: 30 }}
                autoComplete='off'
                error={(phoneNumberError) ? true : false}
                helperText={(phoneNumberError) ? phoneNumberError : false}
                onChange={handleChange}
                value={selectedDriver && selectedDriver.phoneNumber} />
            <br />
            <TextField className={styles.inputMaterial} label="Contraseña del chofer" name="password1"
                required
                inputProps={{ maxLength: 70 }}
                autoComplete='off'
                error={(password1Error) ? true : false}
                helperText={(password1Error) ? password1Error : false}
                onChange={handleChange}
                value={selectedDriver && selectedDriver.password1} />
            <br />
            <TextField className={styles.inputMaterial} label="Ingrese nuevamente la contraseña del chofer"
                required
                inputProps={{ maxLength: 70 }}
                autoComplete='off'
                error={(password2Error) ? true : false}
                helperText={(password2Error) ? password2Error : false}
                name="password2" onChange={handleChange}
                value={selectedDriver && selectedDriver.password2} />
            <br /><br />
            <div align="right">
                <Button color="primary" onClick={() => peticionPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    )
    //Modal de elimincacion
    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar el chofer con email <b>{selectedDriver && selectedDriver.email}</b> ?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => peticionDelete()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>
            </div>
        </div>
    )

    return (
        <div className="App">
            {   // Esto es para que se muestre la ventanita del mensaje
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
                id="btnNewDriver"
                startIcon={<AccessibilityIcon />}
                onClick={() => openCloseModalCreate()}>NUEVO CHOFER</Button>
            <br /><br />
            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de choferes"
                actions={[
                    {
                        icon: () => <VisibilityIcon />,
                        tooltip: 'Visualización de combi',
                        onClick: (event, rowData) => selectDriver(rowData, "Ver")
                    },
                    rowData => ({
                        icon: 'edit',
                        tooltip: (rowData.active === 'Activo') ? 'Editar chofer' : 'No se puede editar un chofer dado de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectDriver(rowData, "Editar")
                    }),
                    rowData => ({
                        icon: 'delete',
                        tooltip: (rowData.active === 'Activo') ? 'Eliminar chofer' : 'No se puede eliminar un chofer dado de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectDriver(rowData, "Eliminar")
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

export default Drivers;
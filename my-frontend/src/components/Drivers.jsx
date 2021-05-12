// Importo de elemntos de material ui, las apis que utilizo y el componente del mensaje
import React, {useState, useEffect} from 'react';
import {Modal, TextField, Button} from '@material-ui/core';
import MaterialTable from '@material-table/core';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import {getDrivers, postDrivers, putDrivers, deleteDrivers} from '../api/Drivers.js';
import {Message} from "./Message";
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
//Los estilos de los modals
import {useStyles} from '../const/modalStyle';

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
    REGEX_ONLY_NUMBER,
    REGEX_ONLY_LOWERCASE,
    REGEX_ONLY_UPPERCASE,
    REGEX_PHONE,
    REGEX_EMAIL,
    REGEX_ONLY_ALPHABETICAL
} from '../const/regex.js';

// La configuracion en castellano
import {materialTableConfiguration} from '../const/materialTableConfiguration';

//Nombre de las columnas de los datos a mostrar y la aclaracion de que campo representan
const columns = [
    {title: 'Nombre', field: 'names'},
    {title: 'Apellido', field: 'surname'},
    {title: 'Teléfono', field: 'phoneNumber'},
    {title: 'Estado', field: 'active'}
];

function Drivers() {
    //Configuracion del mensaje de exito o error
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };
    //Formato que tiene los datos al seleccionarlos para mostrarlos en un modal
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

    const [showPassword1, setShowPassword1] = React.useState(false);
    const [showPassword2, setShowPassword2] = React.useState(false);
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
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    //Cuando se actualiza un valor de un input esta funcion actualiza los datos
    const handleChange = (textFieldAtributes) => {
        const {name, value} = textFieldAtributes.target;
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
        setSuccessMessage(null);
    }
    const handleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    }
    const handleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
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
        if (!selectedDriver.password1) {
            setPassword1Error(ERROR_MSG_EMPTY_PASSWORD);
            return false;
        } else if (selectedDriver.password1.length < 6) {
            setPassword1Error(ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS);
            return false;
        }/* else if (!REGEX_ONLY_NUMBER.test(selectedDriver.password1)) {
            setPassword1Error(ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS);
            return false;
        } else if (!REGEX_ONLY_UPPERCASE.test(selectedDriver.password1)) {
            setPassword1Error(ERROR_MSG_INVALID_NO_CAPITAL_LETTERS);
            return false;
        } else if (!REGEX_ONLY_LOWERCASE.test(selectedDriver.password1)) {
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
    const requestPost = async () => {
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
    const requestPut = async () => {
        if (validateForm()) {
            let putResponse = await putDrivers(selectedDriver, selectedDriver.id);

            if (putResponse.status === 200) {
                setSuccessMessage(`Se ha actualizado el chofer correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha actualizado el chofer correctamente`
                });
                openCloseModalUpdate();
                fetchData();
            } else if (putResponse?.status === 400) {
                setEmailError(putResponse.data.emailError);
                setNamesError(putResponse.data.namesError);
                setSurnameError(putResponse.data.surnameError);
                setPhoneNumberError(putResponse.data.phoneNumberError);
                setPassword1Error(putResponse.data.passwordError1);
                setPassword2Error(putResponse.data.passwordError2);
            } else if (putResponse?.status === 500) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: putResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_PUT_DRIVER} ${putResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_DRIVER} ${putResponse}`
                });
            }
        }
    }
    //Aca elimino a un chofer
    const requestDelete = async () => {
        let deleteResponse = await deleteDrivers(selectedDriver.id);

        if (deleteResponse.status === 200) {
            openCloseModalDelete();
            setSuccessMessage(`Se ha eliminado el chofer correctamente`);
            setOptions({
                ...options, open: true, type: 'success',
                message: `Se ha eliminado el chofer correctamente`
            });
            fetchData();
        } else if (deleteResponse?.status === 500 || deleteResponse?.status === 400) {
            openCloseModalDelete();
            setSuccessMessage(deleteResponse.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: deleteResponse.data
            });
        } else {
            setSuccessMessage(`${ERROR_MSG_API_DELETE_DRIVER} ${deleteResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_DELETE_DRIVER} ${deleteResponse}`
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
            setShowPassword1(false);
            setShowPassword2(false);
        }
        console.log(password1Error);
        console.log(password2Error);
    }

    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
        if (viewModal) {
            setSelectedDriver(formatSelectedDriver);
            setShowPassword1(false);
            setShowPassword2(false);
        }
    }
    const openCloseModalUpdate = () => {
        setUpdateModal(!updateModal);
        if (updateModal) {
            setSelectedDriver(formatSelectedDriver);
            setDefaultErrorMessages();
            setShowPassword1(false);
            setShowPassword2(false);
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

            if (getDriversResponse?.status === 200) {
                let data = getDriversResponse.data;
                setData(data);
            } else {
                setSuccessMessage(`${ERROR_MSG_API_GET_DRIVERS} ${getDriversResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_GET_DRIVERS} ${getDriversResponse}`
                });
            }
        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_DRIVERS} ${error}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    //Inputs para 2 diferentes modales
    const inputsToCreateOrModify = (
        <div>
            <TextField className={styles.inputMaterial} label="Nombre" name="names"
                       required
                       inputProps={{maxLength: 45, style: {textTransform: 'capitalize'}}}
                       autoComplete='off'
                       error={(namesError) ? true : false}
                       helperText={(namesError) ? namesError : false}
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.names}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Apellido" name="surname"
                       required
                       inputProps={{maxLength: 45, style: {textTransform: 'capitalize'}}}
                       autoComplete='off'
                       error={(surnameError) ? true : false}
                       helperText={(surnameError) ? surnameError : false}
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.surname}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Teléfono" name="phoneNumber"
                required
                inputProps={{maxLength: 30}}
                autoComplete='off'
                error={(phoneNumberError) ? true : false}
                helperText={(phoneNumberError) ? phoneNumberError : false}
                onChange={handleChange}
                value={selectedDriver && selectedDriver.phoneNumber}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Correo electrónico" name="email" onChange={handleChange}
                       required
                       inputProps={{maxLength: 70}}
                       autoComplete='off'
                       error={(emailError) ? true : false}
                       helperText={(emailError) ? emailError : false}
                       value={selectedDriver && selectedDriver.email}/>
            <br/>
            <FormControl className={styles.inputMaterial} error={(password1Error) ? true : false}>
                <InputLabel htmlFor="password1">Contraseña</InputLabel>
                <Input
                    id="password1"
                    required
                    inputProps={{maxLength: 100}}
                    autoComplete='off'
                    type={showPassword1 ? 'text' : 'password'}
                    name="password1"
                    onChange={handleChange}
                    value={selectedDriver && selectedDriver.password1}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleShowPassword1}
                                edge="end"
                            >
                                {showPassword1 ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            <FormHelperText>{(password1Error) ? password1Error : false}</FormHelperText>
            </FormControl>
            <FormControl className={styles.inputMaterial} error={(password2Error) ? true : false}>
                <InputLabel htmlFor="password2">Repita la contraseña</InputLabel>
                <Input
                    id="password2"
                    required
                    inputProps={{maxLength: 100}}
                    autoComplete='off'
                    type={showPassword2 ? 'text' : 'password'}
                    name="password2"
                    onChange={handleChange}
                    value={selectedDriver && selectedDriver.password2}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleShowPassword2}
                                edge="end"
                            >
                                {showPassword2 ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <FormHelperText>{(password2Error) ? password2Error : false}</FormHelperText>
            </FormControl>
            <br/><br/>
        </div>
    )
    // Modal de creacion
    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO CHOFER</h3>
            {inputsToCreateOrModify}
            <div align="right">
                <Button color="primary" onClick={() => requestPost()}>GUARDAR</Button>
                <Button onClick={() => openCloseModalCreate()}>CANCELAR</Button>
            </div>
        </div>
    )
    // Modal de vizualizacion
    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE EL CHOFER</h3>
            <TextField className={styles.inputMaterial} label="Estado" name="active"
                       value={selectedDriver && selectedDriver.active} autoComplete="off"/>
            <br/>
            <TextField className={styles.inputMaterial} label="Nombre" name="names"
                       value={selectedDriver && selectedDriver.names} autoComplete="off"/>
            <br/>
            <TextField className={styles.inputMaterial} label="Apellido" name="surname"
                       value={selectedDriver && selectedDriver.surname} autoComplete="off"/>
            <br/>
            <TextField className={styles.inputMaterial} label="Teléfono" name="phoneNumber"
                       value={selectedDriver && selectedDriver.phoneNumber} autoComplete="off"/>
            <br/>
            <TextField className={styles.inputMaterial} label="Correo electrónico" name="email" onChange={handleChange}
                value={selectedDriver && selectedDriver.email} autoComplete="off"/>
            <br/>
            <FormControl className={styles.inputMaterial}>
                <InputLabel htmlFor="password1">Contraseña</InputLabel>
                <Input
                    id="password1"
                    autoComplete='off'
                    type={showPassword1 ? 'text' : 'password'}
                    name="password1"
                    value={selectedDriver && selectedDriver.password1}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleShowPassword1}
                                edge="end"
                            >
                                {showPassword1 ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <br/><br/>
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
            </div>
        </div>
    )
    // Modal de actualizacion
    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR CHOFER</h3>
            <Tooltip title="Debe eliminar el chofer para cambiar el estado">
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                           value={selectedDriver && selectedDriver.active} disabled/>
            </Tooltip>
            {inputsToCreateOrModify}
            <div align="right">
                <Button color="primary" onClick={() => requestPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    )
    //Modal de elimincacion
    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar el chofer con correo
                electrónico <b>{selectedDriver && selectedDriver.email}</b> ?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => requestDelete()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>
            </div>
        </div>
    )

    return (
        <div className="App">
            {   // Esto es para que se muestre la ventanita del mensaje
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
                    id="btnNewDriver"
                    startIcon={<AccessibilityIcon/>}
                    onClick={() => openCloseModalCreate()}>NUEVO CHOFER</Button>
            <br/><br/>
            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de choferes"
                actions={[
                    {
                        icon: () => <VisibilityIcon/>,
                        tooltip: 'Visualización de chofer',
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

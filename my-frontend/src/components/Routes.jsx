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
import MaterialTable from '@material-table/core';
import { Message } from "./Message";
import Tooltip from '@material-ui/core/Tooltip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// La configuracion en castellano
import { materialTableConfiguration } from '../const/materialTableConfiguration';
//Los estilos de los modals
import { useStyles } from '../const/modalStyle';

//Nombre de las columnas de los datos a mostrar y la aclaracion de que campo representan
const columns = [
    { title: 'Ciudad origen', field: 'cityOrigin' },
    { title: 'Provincia de origen', field: 'provOrigin' },
    { title: 'Ciudad de destino', field: 'cityDest' },
    { title: 'Provincia de destino', field: 'provDest' },
    { title: 'Ciudad de origen', field: 'cityOrigin' },
    { title: 'Duración', field: 'duration' },
    { title: 'Combi', field: 'transport' },
    { title: 'Distancia', field: 'km' },
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


    const styles = useStyles();
    //Aca se guarda los datos al hacer el get
    const [data, setData] = useState([]);
    //Mensaje de error de los inputs
    const [cityOrNamesError, setCityOrNamesError] = React.useState(null);
    const [cityDestNamesError, setCityDestNamesError] = React.useState(null);
    const [provOrNamesError, setProvOrNamesError] = React.useState(null);
    const [provDestNamesError, setProvDestNamesError] = React.useState(null);
    //Para abrir y cerrar los modales
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    //Aca se guarda los datos de la fila seleccionada
    const [selectedRoute, setSelectedRoute] = useState(formatSelectedRoute);
    //Elementos para configurar los mensajes
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    //Cuando se actualiza un valor de un input esta funcion actualiza los datos
    const handleChange = (textFieldAtributes) => {
        const { name, value } = textFieldAtributes.target;
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
                });
                openCloseModalCreate();
                fetchData();
            } else if (postResponse?.status === 400) {
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
            } else if (postResponse?.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });
                return true
            } else {
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
                });
                openCloseModalUpdate();
                fetchData();
            } else if (putResponse?.status === 400) {
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
            } else if (putResponse?.status === 500) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: putResponse.data
                });
                return true
            } else {
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
            });
            openCloseModalDelete();
            fetchData();
        } else if (deleteResponse?.status === 500 || deleteResponse?.status === 400) {
            setSuccessMessage(deleteResponse.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: deleteResponse.data
            });
        } else {
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
            setSelectedRoute(formatSelectedRoute);
            setDefaultErrorMessages();            
        }
    }

    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
        if (viewModal) {
            setSelectedRoute(formatSelectedRoute);
        }
    }
    const openCloseModalUpdate = () => {
        setUpdateModal(!updateModal);
        if (updateModal) {
            setSelectedRoute(formatSelectedRoute);
            setDefaultErrorMessages();
        }
    }

    const openCloseModalDelete = () => {
        setDeleteModal(!deleteModal);
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
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    //Inputs para 2 diferentes modales
    const inputsToCreateOrModify = (
        <div>
            <TextField className={styles.inputMaterial} label="Nombre de Ciudad Origen" name="cityOrigin"
                required
                inputProps={{ maxLength: 45, style: { textTransform: 'capitalize' } }}
                autoComplete='off'
                error={(cityOrNamesError) ? true : false}
                helperText={(cityOrNamesError) ? cityOrNamesError : false}
                onChange={handleChange}
                value={selectedRoute && selectedRoute.cityOrigin} />
        </div>
    )
    // Modal de creacion
    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVA RUTA</h3>
            {inputsToCreateOrModify}
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
            <h3>DETALLE DE LA RUTA</h3>
            <TextField className={styles.inputMaterial} label="Estado" name="active"
                value={selectedRoute && selectedRoute.active} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Ciudad de origen" name="cityOrigin" onChange={handleChange}
                value={selectedRoute && selectedRoute.cityOrigin} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Provincia de origen" name="provOrigin" onChange={handleChange}
                       value={selectedRoute && selectedRoute.provOrigin} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Ciudad de destino" name="cityDest" onChange={handleChange}
                value={selectedRoute && selectedRoute.cityDest} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Provincia de destino" name="provDest" onChange={handleChange}
                value={selectedRoute && selectedRoute.provDest} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Duración" name="duration"
                       value={selectedRoute && selectedRoute.duration} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Combi" name="transport"
                       value={selectedRoute && selectedRoute.transport} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Distancia" name="km"
                       value={selectedRoute && selectedRoute.km} autoComplete="off" />
            <br />
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>SALIR</Button>
            </div>
        </div>
    )
    // Modal de actualizacion
    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR RUTA</h3>
            <Tooltip title="Debe eliminar la combi para cambiar el estado">
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                    value={selectedRoute && selectedRoute.active} disabled />
            </Tooltip>
            {inputsToCreateOrModify}
            <div align="right">
                <Button color="primary" onClick={() => peticionPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    )
    //Modal de elimincacion
    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar la ruta de <b>{selectedRoute && selectedRoute.cityOrigin}</b> a
            <b>{selectedRoute && selectedRoute.cityDest}</b> ?
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
                id="btnNewRoute"
                startIcon={<AccessibilityIcon />}
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
                        tooltip: (rowData.active === 'Activo') ? 'Editar ruta' : 'No se puede editar una rutar dado de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectRoute(rowData, "Editar")
                    }),
                    rowData => ({
                        icon: 'delete',
                        tooltip: (rowData.active === 'Activo') ? 'Eliminar ruta' : 'No se puede eliminar una ruta dado de baja',
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

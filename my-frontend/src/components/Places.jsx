import {
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Modal,
    TextField
} from '@material-ui/core';
// Importo los mensajes de error
import {
    ERROR_MSG_API_DELETE_PLACES,
    ERROR_MSG_API_GET_PLACES,
    ERROR_MSG_API_POST_PLACES,
    ERROR_MSG_API_PUT_PLACES,
    ERROR_MSG_EMPTY_NAME,
    ERROR_MSG_EMPTY_PROVINCE,
    ERROR_MSG_INVALID_NAME
} from "../const/messages";
import React, {useEffect, useState} from 'react';
import {
    deletePlace,
    getPlacesDeps,
    postPlace,
    putPlace
} from '../api/Places';

import MaterialTable from '@material-table/core';
import {Message} from "./Message";
import PinDropIcon from '@material-ui/icons/PinDrop';
// Importo las expresiones regulares
import {
    REGEX_ONLY_ALPHABETICAL
} from '../const/regex.js';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
// La configuracion en castellano
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import {useStyles} from '../const/componentStyles';

//Nombre de las columnas de los datos a mostrar y la aclaracion de que campo representan
const columns = [
    {title: 'Ciudad', field: 'cityName'},
    {title: 'Provincia', field: 'provinceName'},
    {title: 'Estado', field: 'active'},
];

const Provinces = [
    {province_name: "Buenos Aires", province_id: 1},
    {province_name: "Capital Federal (CABA)", province_id: 2},
    {province_name: "Catamarca", province_id: 3},
    {province_name: "Chaco", province_id: 4},
    {province_name: "Chubut", province_id: 5},
    {province_name: "Córdoba", province_id: 6},
    {province_name: "Corrientes", province_id: 7},
    {province_name: "Entre Rios", province_id: 8},
    {province_name: "Formosa", province_id: 9},
    {province_name: "Jujuy", province_id: 10},
    {province_name: "La Pampa", province_id: 11},
    {province_name: "La Rioja", province_id: 12},
    {province_name: "Mendoza", province_id: 13},
    {province_name: "Misiones", province_id: 14},
    {province_name: "Neuquén", province_id: 15},
    {province_name: "Río Negro", province_id: 16},
    {province_name: "Salta", province_id: 17},
    {province_name: "San Juan", province_id: 18},
    {province_name: "San Luis", province_id: 19},
    {province_name: "Santa Cruz", province_id: 20},
    {province_name: "Santa Fe", province_id: 21},
    {province_name: "Santiago del Estero", province_id: 22},
    {province_name: "Tierra del Fuego", province_id: 23},
    {province_name: "Tucumán", province_id: 12}
];

function Places() {
    //Configuracion del mensaje de exito o error
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const styles = useStyles();
    //Aca se guarda los datos al hacer el get
    const [data, setData] = useState([]);
    const [newData, setNewData] = useState(true);
    //Formato que tiene los datos al seleccionarlos para mostrarlos en un modal
    const formatSelectedPlace = {
        id: '',
        cityName: '',
        active: '',
        idProvince: '',
        provinceName: '',
        inRoute:''
    };    
    //Aca se guarda los datos de la fila seleccionada
    const [selectedPlace, setSelectedPlace] = useState(formatSelectedPlace);
    //Para abrir y cerrar los modales
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    //Elementos para configurar los mensajes
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});
    const [provinceSelectedError, setProvinceSelectedError] = useState(false);
    const [provinceSelected, setProvinceSelected] = useState('');
    //Mensaje de error de los inputs
    const [namesError, setNamesError] = useState(null);
    //Cuando se actualiza un valor de un input esta funcion actualiza los datos
    const handleChange = (textFieldAtributes) => {
        const {name, value} = textFieldAtributes.target;
        setSelectedPlace(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === 'provinceSelected') {
            setProvinceSelectedError(false);
            setProvinceSelected(value);
        }
        //Saca el mensaje de error segun el input que se modifico
        switch (name) {
            case 'IdProvince':
                setProvinceSelectedError(null);
                break;
            case 'cityName':
                setNamesError(null);
                break;
            case 'provinceName':
                setNamesError(null);
                break;
            default:
                console.log('Es necesario agregar un case más en el switch por el name:', name);
                break;
        }
    };

    const setDefaultErrorMessages = () => {
        setNamesError('');
    };

    //Aca arrancan las validaciones de los datos
    const validateForm = () => {
        return validateName() & validateProvince();
    };

    const validateName = () => {
        if (!selectedPlace.cityName) {
            setNamesError(ERROR_MSG_EMPTY_NAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(selectedPlace.cityName)) {
            setNamesError(ERROR_MSG_INVALID_NAME);
            return false;
        }

        setNamesError(null);
        return true;
    };

    const validateProvince = () => {
        if (provinceSelected || selectedPlace.idProvince) {
            setProvinceSelectedError(null);
            return true;
        } else {
            setProvinceSelectedError(ERROR_MSG_EMPTY_PROVINCE);
            return false;
        }
    };

    const peticionPost = async () => {
        if (validateForm()) {
            let postResponse = await postPlace(selectedPlace, provinceSelected);
            if (postResponse.status === 201) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: postResponse.data
                });
                setSelectedPlace(formatSelectedPlace);
                setProvinceSelected(false);
                setNamesError('');
                setDefaultErrorMessages(null);
                openCloseModalCreate();
                setNewData(true);
            } else if (postResponse?.status === 400) {
                setNamesError(postResponse.data);
            } else if (postResponse?.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_POST_PLACES} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_PLACES} ${postResponse}`
                });
            }
        }
    };


    const peticionPut = async () => {
        if (validateForm()) {
            let postResponse = await putPlace(selectedPlace, provinceSelected);

            if (postResponse.status === 200) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: postResponse.data
                });
                setSelectedPlace(formatSelectedPlace);
                setProvinceSelected(false);
                setNamesError('')
                setDefaultErrorMessages(null);
                await openCloseModalUpdate();
                setNewData(true);
            } else if (postResponse?.status === 400) {
                setNamesError(postResponse.data);
            } else if (postResponse?.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_PUT_PLACES} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_PLACES} ${postResponse}`
                });
            }
        }
    };

    const peticionDelete = async () => {
        let deleteResponse = await deletePlace(selectedPlace.id);
        if (deleteResponse.status === 200) {
            setSuccessMessage(deleteResponse.data);
            setOptions({
                ...options, open: true, type: 'success',
                message: deleteResponse.data
            });
            setSelectedPlace(formatSelectedPlace);
            setProvinceSelected(false);
            setNamesError('');
            setDefaultErrorMessages(null);
            openCloseModalDelete();
            setNewData(true);
        } else if ((deleteResponse?.status === 500) || (deleteResponse?.status === 400) || (deleteResponse?.status === 404)) {
            openCloseModalDelete();
            setSuccessMessage(deleteResponse.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: deleteResponse.data
            });
            return true
        } else {
            setSuccessMessage(`${ERROR_MSG_API_DELETE_PLACES} ${deleteResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_DELETE_PLACES} ${deleteResponse}`
            });
        }
    };

    const selectPlace = (place, action) => {
        setSelectedPlace(place);
        if (action === "Ver") {
            openCloseModalViewDetails()
        } else if (action === "Editar" && place.inRoute === 'false') {
            openCloseModalUpdate()
        } else if (action === "Eliminar" && place.inRoute === 'false'){
            openCloseModalDelete()
        } else {
            setSuccessMessage(`No se puede ${action.toLowerCase()}, el lugar figura en rutas activas`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `No se puede ${action.toLowerCase()}, el lugar figura en rutas activas`
            });
            setSelectedPlace(formatSelectedPlace);
            setDefaultErrorMessages();
        }

    };

    const openCloseModalCreate = () => {
        setCreateModal(!createModal);
        if (createModal) {
            setSelectedPlace(formatSelectedPlace);
            setProvinceSelected('');
            setDefaultErrorMessages();
        }
    };


    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
        if (viewModal) {
            setSelectedPlace(formatSelectedPlace);
        }
    };

    const openCloseModalUpdate = () => {
        setUpdateModal(!updateModal);
        if (updateModal) {
            setSelectedPlace(formatSelectedPlace);
            setDefaultErrorMessages();
        }
    };

    const openCloseModalDelete = () => {
        setDeleteModal(!deleteModal);
        if (deleteModal) {
            setSelectedPlace(formatSelectedPlace);
            setDefaultErrorMessages();
        }
    };
    //Aca busco los datos de los choferes del backend
    const fetchData = async () => {
        try {
            let getPlacesResponse = await getPlacesDeps();
            console.log(getPlacesResponse);
            if (getPlacesResponse.status === 200) {
                let data = getPlacesResponse.data;
                setData(data);
            }
        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_PLACES} ${error}`);
        }

    };


    useEffect(() => {
        if (newData) {
            fetchData();
        }
        return setNewData(false);
    }, [newData]);


    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO LUGAR</h3>
            <TextField className={styles.inputMaterial} label="Ciudad" name="cityName"
                       required
                       inputProps={{maxLength: 45, style: {textTransform: 'capitalize'}}}
                       autoComplete='off'
                       error={(namesError) ? true : false}
                       helperText={(namesError) ? namesError : false}
                       onChange={handleChange}
                       value={selectedPlace && selectedPlace.cityName}/>
            <br/>
            <FormControl className={styles.inputMaterial}
                         required
                         error={(provinceSelectedError) ? true : false}>
                <InputLabel>Provincia</InputLabel>
                <Select label="Provincia" id="provinceSelected" name="provinceSelected"
                        className={styles.inputMaterial}
                        value={(provinceSelected) ? provinceSelected : selectedPlace.id_province}
                        displayEmpty
                        onChange={handleChange}
                >
                    <MenuItem value={0} disabled>
                        Seleccione una provincia
                    </MenuItem>
                    {(Provinces) ?
                        Provinces.map((province) => (
                            <MenuItem
                                key={province.province_id}
                                value={province.province_id}
                            >
                                {province.province_name}
                            </MenuItem>
                        ))
                        : null
                    }
                </Select>
                <FormHelperText>{(provinceSelectedError) ? provinceSelectedError : false}</FormHelperText>
            </FormControl>
            <br/>
            <br/>
            <div align="right">
                <Button color="primary" onClick={() => peticionPost()}>GUARDAR</Button>
                <Button onClick={() => openCloseModalCreate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DEL LUGAR</h3>
            <TextField className={styles.inputMaterial} label="Ciudad" name="cityName"
                       value={selectedPlace && selectedPlace.cityName}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Provincia" name="provinceSelected"
                       value={selectedPlace && selectedPlace.provinceName}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Estado" name="active"
                       value={selectedPlace && selectedPlace.active}/>
            <br/><br/>           
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
            </div>
        </div>
    );

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR LUGAR</h3>
            <Tooltip title="Debe eliminar el lugar para cambiar el estado">
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                           value={selectedPlace && selectedPlace.active} disabled
                />
            </Tooltip>
            <br/>
            <TextField className={styles.inputMaterial} label="Ciudad" name="cityName"
                       onChange={handleChange}
                       value={selectedPlace && selectedPlace.cityName}
                       error={(namesError) ? true : false}
                       helperText={(namesError) ? namesError : false}
            />
            <br/>
            <FormControl className={styles.inputMaterial}
                         required>
                <InputLabel>Provincia</InputLabel>
                <Select label="Provincia" id="provinceSelected" name="idProvince"
                        className={styles.inputMaterial}
                        value={(provinceSelected) ? provinceSelected : selectedPlace.idProvince}
                        displayEmpty
                        onChange={handleChange}
                >
                    <MenuItem value={0} disabled>
                        Seleccione una provincia
                    </MenuItem>
                    {(Provinces) ?
                        Provinces.map((province) => (
                            <MenuItem
                                key={province.province_id}
                                value={province.province_id}
                            >
                                {province.province_name}
                            </MenuItem>
                        ))
                        : null
                    }
                </Select>
                <FormHelperText>{(provinceSelectedError) ? provinceSelectedError : false}</FormHelperText>
            </FormControl>
            <br/>
            <br/>
            <div align="right">
                <Button color="primary" onClick={() => peticionPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar este lugar con
                nombre <b>{selectedPlace && selectedPlace.cityName}</b> y
                provincia <b>{selectedPlace && selectedPlace.provinceName}</b>?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => peticionDelete()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>

            </div>

        </div>
    );

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
                    id="btnNewPlace"
                    startIcon={<PinDropIcon/>}
                    onClick={() => openCloseModalCreate()}>NUEVO LUGAR</Button>
            <br/><br/>
            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de lugares"
                actions={[
                    {
                        icon: () => <VisibilityIcon/>,
                        tooltip: 'Visualización de lugar',
                        onClick: (event, rowData) => selectPlace(rowData, "Ver")
                    },
                    rowData => ({
                        icon: 'edit',
                        tooltip: (rowData.active === 'Activo') ? 'Editar lugar' : 'No se puede editar un lugar dado de baja',
                        disabled: rowData.active !== 'Activo',
                        onClick: (event, rowData) => { selectPlace(rowData, 'Editar')}
                    }),
                    rowData => ({
                        icon: 'delete',
                        tooltip: (rowData.active === 'Activo') ? 'Eliminar lugar' : 'No se puede eliminar un lugar dado de baja',
                        disabled: rowData.active !== 'Activo',
                        onClick: (event, rowData) => { selectPlace(rowData, 'Eliminar')}
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

export default Places;

import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Modal, NativeSelect, TextField} from '@material-ui/core';
// Importo los mensajes de error
import {
    ERROR_MSG_API_DELETE_PLACES,
    ERROR_MSG_API_GET_PLACES,
    ERROR_MSG_API_GET_PROVINCES,
    ERROR_MSG_API_POST_PLACES,
    ERROR_MSG_API_PUT_PLACES,
    ERROR_MSG_EMPTY_NAME,
    ERROR_MSG_INTERNET,
    ERROR_MSG_INVALID_NAME
} from "../const/messages";
import React, {useEffect, useState} from 'react';
import {
    deletePlace,
    getPlace,
    getPlaces,
    getProvinces,
    postPlace,
    putPlace
} from '../api/Places';

import {BACKEND_URL} from '../const/config.js';
import MaterialTable from "material-table";
import { Message } from "./Message";
import PinDropIcon from '@material-ui/icons/PinDrop';
// Importo las expresiones regulares
import {
    REGEX_ONLY_ALPHABETICAL
} from '../const/regex.js';
import Select from '@material-ui/core/Select';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
// La configuracion en castellano
import { materialTableConfiguration } from '../const/materialTableConfiguration';

//Nombre de las columnas de los datos a mostrar y la aclaracion de que campo representan
const columns = [
    {title: 'Ciudad', field: 'CITY_NAME'},
    {title: 'Provincia', field: 'PROVINCE_NAME'}
];

const Provinces = [
    { label: "Buenos Aires", value: 1 },
    { label: "Capital Federal (CABA)", value: 2 },
    { label: "Catamarca", value: 3 },
    { label: "Chaco", value: 4 },
    { label: "Chubut", value: 5 },
    { label: "Córdoba", value: 6 },
    { label: "Corrientes", value: 7 },
    { label: "Entre Rios", value: 8 },
    { label: "Formosa", value: 9 },
    { label: "Jujuy", value: 10 },
    { label: "La Pampa", value: 11 },
    { label: "La Rioja", value: 12 },
    { label: "Mendoza", value: 13 },
    { label: "Misiones", value: 14 },
    { label: "Neuquén", value: 15 },
    { label: "Río Negro", value: 16 },
    { label: "Salta", value: 17 },
    { label: "San Juan", value: 18 },
    { label: "San Luis", value: 19 },
    { label: "Santa Cruz", value: 20 },
    { label: "Santa Fe", value: 21 },
    { label: "Santiago del Estero", value: 22 },
    { label: "Tierra del Fuego", value: 23 },
    { label: "Tucumán", value: 12 }
  ];
const baseUrl = `${BACKEND_URL}/lugares`;
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

function Places() {
    //Configuracion del mensaje de exito o error
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const styles = useStyles();
    //Aca se guarda los datos al hacer el get
    const [data, setData] = useState([]);
    //Aca se guarda los datos de la fila seleccionada
    const [selectedPlace, setSelectedPlace] = useState({
        city_id: "",
        city_name: "",
        id_province: "",
        active: ""
    })
    //Formato que tiene los datos al seleccionarlos para mostrarlos en un modal
    const formatSelectedPlace = {
            city_id: "",
            city_name: "",
            id_province: "",
            active: ""
        }
    //Para abrir y cerrar los modales
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    //Elementos para configurar los mensajes
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });
    const [provinceSelectedError, setProvinceSelectedError] = useState(false);
    const [provinceSelected, setProvinceSelected] = useState('');
    //Mensaje de error de los inputs
    const [namesError, setNamesError] = React.useState(null);
    //Cuando se actualiza un valor de un input esta funcion actualiza los datos
    const handleChange = (textFieldAtributes) => {
        const { name, value } = textFieldAtributes.target;
        setSelectedPlace(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const setDefaultErrorMessages = () => {
        setNamesError('');
    };

    //Aca arrancan las validaciones de los datos del chofer
    const validateForm = () => {
        return validateName();
    };

    const validateName = () => {
        if (!selectedPlace.city_name) {
            setNamesError(ERROR_MSG_EMPTY_NAME);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(selectedPlace.city_name)) {
            setNamesError(ERROR_MSG_INVALID_NAME);
            return false;
        }

        setNamesError(null);
        return true;
    }
    
    const peticionPost = async () => {
        if (validateForm()) {
            let postResponse = await postPlace(selectedPlace);
            if (postResponse.status === 201) {
                setSuccessMessage(`Se ha creado el lugar correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha creado el lugar correctamente`
                });
                openCloseModalCreate();
                fetchData();
            } else if (postResponse?.status === 400) {
                setNamesError(postResponse.data.namesError);
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
    }
    

    const peticionPut = async () => {
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
    }

    const peticionDelete = async () => {
        /*
        await axios.delete(baseUrl + "/" + selectedTransport.id)
            .then(response => {
                setData(data.filter(internal_identification => internal_identification.id !== selectedTransport.id));
                openCloseModalDelete();
            }).catch(error => {
                console.log(error);
            })
            */
    }

    const selectPlace = (place, action) => {
        setSelectedPlace(place);
        if (action === "Ver") {
            openCloseModalViewDetails()
        } else if (action === "Editar") {
            openCloseModalUpdate()
        } else {
            openCloseModalDelete()
        }

    }

    const openCloseModalCreate = () => {
        setCreateModal(!createModal);
        if (createModal) {
            setSelectedPlace(formatSelectedPlace);
            setDefaultErrorMessages();
        }
    }

    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
    }
    const openCloseModalUpdate = () => {
        setUpdateModal(!updateModal);
    }

    const openCloseModalDelete = () => {
        setDeleteModal(!deleteModal);
    }

    //Aca busco los datos de los choferes del backend
    const fetchData = async () => {
        try {
            let getPlacesResponse = await getPlaces();
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
        fetchData();
    }, []);

    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO LUGAR</h3>
            <TextField className={styles.inputMaterial} label="Ciudad" name="city_name"
                required
                inputProps={{ maxLength: 45, style: { textTransform: 'capitalize' } }}
                autoComplete='off'
                error={(namesError) ? true : false}
                helperText={(namesError) ? namesError : false}
                onChange={handleChange}
                value={selectedPlace && selectedPlace.city_name} />
            <br />
            <br />
{/* 
            <InputLabel>Provincia</InputLabel>
            <Select label="Provincia" id="Provincia" labelId={selectedPlace.id_province}
                        name="province"
                        className={styles.inputMaterial}
                        value={(selectedPlace.id_province) ? selectedPlace.id_province : 0}
                        displayEmpty
                        onClick={handleChange}
                >
                    <MenuItem value={0} disabled> Seleccione una provincia </MenuItem>
                    <MenuItem key={1} value={1}> Buenos Aires </MenuItem>
                    <MenuItem key={2} value={2}> CABA </MenuItem>
                </Select>
                 */}
                <FormControl className={styles.inputMaterial}
                         required
                         error={(provinceSelectedError) ? true : false}>
                <InputLabel>Provincia</InputLabel>
                <Select label="Provincia" id="id_province" name="province"
                        className={styles.inputMaterial}
                        value={selectedPlace.id_province}
                        displayEmpty
                        onChange={handleChange}
                >
                    <MenuItem value={0} disabled>
                        Seleccione una provincia
                    </MenuItem>
                    {(Provinces) ?
                        Provinces.map((province) => (
                            <MenuItem
                                key={province.label}
                                value={province.value}
                            >
                                {province.label}
                            </MenuItem>
                        ))
                        : null
                    }
                </Select>
                <FormHelperText>{(provinceSelectedError) ? provinceSelectedError : false}</FormHelperText>
            </FormControl>
            <div align="right">
                <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
                <Button onClick={() => openCloseModalCreate()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DEL LUGAR</h3>
            <TextField className={styles.inputMaterial} label="Ciudad" name="city_name"
                       value={selectedPlace && selectedPlace.city_name}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Provincia" name="province"
                       value={selectedPlace && selectedPlace.id_province}/>
            <br/><br/>
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR LUGAR</h3>
            <TextField className={styles.inputMaterial} label="Ciudad" name="city_name"
                       onChange={handleChange}
                       value={selectedPlace && selectedPlace.city_name}/>
            <br /><br />
            <InputLabel>Provincia</InputLabel>
            <Select label="Provincia" id="Provincia" labelId={selectedPlace.id_province}
                        name="province"
                        className={styles.inputMaterial}
                        value={(selectedPlace.id_province) ? selectedPlace.id_province : 0}
                        displayEmpty
                        onChange={handleChange}
                >
                    <MenuItem value={0} disabled> Seleccione una provincia </MenuItem>
                    <MenuItem key={1} value={1}> Buenos Aires </MenuItem>
                    <MenuItem key={2} value={2}> CABA </MenuItem>
                </Select>
            <br/>
            <br/>
            <div align="right">
                <Button color="primary" onClick={() => peticionPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    )

    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar este lugar con
                nombre <b>{selectedPlace && selectedPlace.city_name}</b> y
                provincia <b>{selectedPlace && selectedPlace.id_province}</b>?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => peticionDelete()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>

            </div>

        </div>
    )

    console.log("LA DATA ES:", data);
    console.log(selectedPlace[0]);

    return (
        <div className="App">
            {   // Esto es para que se muestre la ventanita del mensaje
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }
            <br/>
            <Button style={{marginLeft: '8px'}}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnNewCombi"
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
                    {
                        icon: 'edit',
                        tooltip: 'Editar lugar',
                        onClick: (event, rowData) => selectPlace(rowData, "Editar")
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Eliminar lugar',
                        onClick: (event, rowData) => selectPlace(rowData, "Eliminar")
                    }
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

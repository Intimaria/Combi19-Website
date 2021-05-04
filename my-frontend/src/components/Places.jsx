import {Button, Modal, TextField} from '@material-ui/core';
import React, {useEffect, useState} from 'react';

import {BACKEND_URL} from '../const/config.js';
import MaterialTable from "material-table";
import PinDropIcon from '@material-ui/icons/PinDrop';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';

const columns = [
    {title: 'Ciudad', field: 'city_name'},
    {title: 'Provincia', field: 'province'},
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
    const styles = useStyles();
    const [data, setData] = useState([
        {
            id: 1,
            city_name: 'Aguas Blancas',
            province: 'Rio Negro'
        },
        {
            id: 2,
            city_name: 'Azul',
            province: 'Buenos Aires'
        },
        {
            id: 3,
            city_name: 'Bahia Blanca',
            province: 'Buenos Aires'
        },
        {
            id: 4,
            city_name: 'Bariloche',
            province: 'Rio Negro'
        },
        {
            id: 5,
            city_name: 'Chivilcoy',
            province: 'Buenos Aires'
        },
        {
            id: 6,
            city_name: 'Aguas Blancas',
            province: 'Rio Negro'
        },
        {
            id: 7,
            city_name: 'Aguas Blancas',
            province: 'Rio Negro'
        },
        {
            id: 8,
            city_name: 'Aguas Blancas',
            province: 'Rio Negro'
        },
        {
            id: 9,
            city_name: 'Aguas Blancas',
            province: 'Rio Negro'
        },
        {
            id: 10,
            city_name: 'Aguas Blancas',
            province: 'Rio Negro'
        },
        {
            id: 1,
            city_name: 'Aguas Blancas',
            province: 'Rio Negro'
        },
    ]);
    const selectData = [
        { province: 'Rio Negro' },
        { province: 'Buenos Aires' }
      ];
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState({
        id: "",
        city_name: "",
        province: ""
    })
    /*
    const handleChange = e => {
        const {name, value} = e.target;
        setSelectedTransport(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    */
    const handleChange = e => {
        console.log('valor de e:', e);
        console.log('valor de e.target:', e.target);
        console.log('valor de {name} = e.target:', e.target.name);
        console.log('valor de {value} = e.target:', e.target.value);
        const {name, value} = e.target;
        setSelectedPlace(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const peticionGet = async () => {

        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            })

        return
    }

    const peticionPost = async () => {
        /*
        await axios.post(baseUrl, selectedTransport)
            .then(response => {
                setData(data.concat(response.data));
                openCloseModalCreate();
            }).catch(error => {
                console.log(error);
            })
            */
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

    useEffect(() => {
        //peticionGet();
    }, [])

    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO LUGAR</h3>
            <TextField className={styles.inputMaterial} label="Ciudad" name="city_name"
                       onChange={handleChange}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Provincia" name="province" onChange={handleChange}/>
            <br/><br/>
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
                       value={selectedPlace && selectedPlace.province}/>
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
            <br/>
            <Select className={styles.inputMaterial} label="Provincia" name="province" onClick={handleChange}
                  options={selectData} value={selectedPlace && selectedPlace.province}/>
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
                provincia <b>{selectedPlace && selectedPlace.province}</b>?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => peticionDelete()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>

            </div>

        </div>
    )

    console.log("LA DATA ES:", data);

    return (
        <div className="App">
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
                options={{
                    actionsColumnIndex: -1,
                }}
                localization={{
                    header: {
                        actions: "Acciones"
                    }
                }}
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

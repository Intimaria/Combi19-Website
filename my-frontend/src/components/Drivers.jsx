import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from "material-table";
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { BACKEND_URL } from '../const/config.js';

const columns = [
    { title: 'Nombre', field: 'driver_name' },
    { title: 'Apellido', field: 'driver_surname' },
    { title: 'Email', field: 'driver_email' }
];
const baseUrl = `${BACKEND_URL}/drivers`;


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
    const styles = useStyles();
    const [data, setData] = useState([]);

    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState({
        id: "",
        driver_name: "",
        driver_surname: "",
        driver_email: "",
        driver_phone_number: "",
        driver_password_1: "",
        driver_password_2: "",
    })

    const handleChange = (textFieldAtributes) => {
        const { name, value } = textFieldAtributes.target;
        setSelectedDriver(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const peticionGet = async () => {
        const token = localStorage.getItem('token');
        await axios.get(baseUrl,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setData(response.data);
                console.log(response.data)
            }).catch(error => {
                console.log(error);
            })
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
        peticionGet();
    }, [])

    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO CHOFER</h3>
            <TextField className={styles.inputMaterial} label="Nombre del chofer" name="driver_name"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.names} />
            <br />
            <TextField className={styles.inputMaterial} label="Apellido del chofer" name="driver_name"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.surname} />
            <br />
            <TextField className={styles.inputMaterial} label="Email del chofer" name="driver_email" onChange={handleChange}
                value={selectedDriver && selectedDriver.email} />
            <br />
            <TextField className={styles.inputMaterial} label="Numero de telefono del chofer" name="driver_phone_number"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.phoneNumber} />
            <br />
            <TextField className={styles.inputMaterial} label="Contraseña del chofer" name="driver_password_1"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.password1} />
            <br />
            <TextField className={styles.inputMaterial} label="Ingrese nuevamente la contraseña del chofer" name="driver_password_2" onChange={handleChange}
                value={selectedDriver && selectedDriver.password2} />
            <br /><br />
            <div align="right">
                <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
                <Button onClick={() => openCloseModalCreate()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE EL CHOFER</h3>
            <TextField className={styles.inputMaterial} label="Nombre del chofer" name="driver_name"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.names} />
            <br />
            <TextField className={styles.inputMaterial} label="Apellido del chofer" name="driver_name"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.surname} />
            <br />
            <TextField className={styles.inputMaterial} label="Email del chofer" name="driver_email" onChange={handleChange}
                value={selectedDriver && selectedDriver.email} />
            <br />
            <TextField className={styles.inputMaterial} label="Numero de telefono del chofer" name="driver_phone_number"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.phoneNumber} />
            <br />
            <TextField className={styles.inputMaterial} label="Contraseña del chofer" name="driver_password_1"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.password1} />
            <br /><br />
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR CHOFER</h3>
            <TextField className={styles.inputMaterial} label="Nombre del chofer" name="driver_name"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.names} />
            <br />
            <TextField className={styles.inputMaterial} label="Apellido del chofer" name="driver_name"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.surname} />
            <br />
            <TextField className={styles.inputMaterial} label="Email del chofer" name="driver_email" onChange={handleChange}
                value={selectedDriver && selectedDriver.email} />
            <br />
            <TextField className={styles.inputMaterial} label="Numero de telefono del chofer" name="driver_phone_number"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.phoneNumber} />
            <br />
            <TextField className={styles.inputMaterial} label="Contraseña del chofer" name="driver_password_1"
                onChange={handleChange}
                value={selectedDriver && selectedDriver.password1} />
            <br />
            <TextField className={styles.inputMaterial} label="Ingrese nuevamente la contraseña del chofer" name="driver_password_2" onChange={handleChange}
                value={selectedDriver && selectedDriver.password2} />
            <br /><br />
            <div align="right">
                <Button color="primary" onClick={() => peticionPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    )

    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar el chofer con email
                <b>{selectedDriver && selectedDriver.email}</b> ?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => peticionDelete()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>
            </div>
        </div>
    )
    
    return (
        <div className="App">
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
                        tooltip: 'Visualización de chofer',
                        onClick: (event, rowData) => selectDriver(rowData, "Ver")
                    },
                    {
                        icon: 'edit',
                        tooltip: 'Editar chofer',
                        onClick: (event, rowData) => selectDriver(rowData, "Editar")
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Eliminar chofer',
                        onClick: (event, rowData) => selectDriver(rowData, "Eliminar")
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

export default Drivers;
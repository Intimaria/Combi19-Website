import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import MaterialTable from "material-table";
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {getDrivers} from '../api/Drivers';
import {BACKEND_URL} from '../const/config.js';
import {ERROR_MSG_API_GET_DRIVERS} from "../const/messages";

const columns = [
    {title: 'Nombre', field: 'NAME'},
    {title: 'Apellido', field: 'SURNAME'},
    {title: 'Email', field: 'EMAIL'},
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
        a: "ad",
        USER_ID: "",
        NAME: "",
        SURNAME: "",
        EMAIL: "",
        PHONE_NUMBER: "",
        PASSWORD: "",
        PASSWORD_REPEAT: "",
    })

    const handleChange = (textFieldAtributes) => {
        const {name, value} = textFieldAtributes.target;
        setSelectedDriver(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const peticionPost = async () => {
        const token = localStorage.getItem('token');
        await axios.post(baseUrl, selectedDriver,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setData(data.concat(response.data));
                openCloseModalCreate();
            }).catch(error => {
                console.log(error);
            });
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
        const fetchData = async () => {
            try {
                let data = await getDrivers();

                setData(data);
            } catch (error) {
                console.log(`${ERROR_MSG_API_GET_DRIVERS} ${error}`);
            }
        };
        fetchData();
    }, []);

    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO CHOFER</h3>
            <TextField className={styles.inputMaterial} label="Nombre del chofer" name="NAME"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.NAME}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Apellido del chofer" name="SURNAME"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.SURNAME}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Email del chofer" name="EMAIL" onChange={handleChange}
                       value={selectedDriver && selectedDriver.EMAIL}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Numero de telefono del chofer" name="PHONE_NUMBER"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.PHONE_NUMBER}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Contraseña del chofer" name="PASSWORD"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.PASSWORD}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Ingrese nuevamente la contraseña del chofer"
                       name="PASSWORD_REPEAT" onChange={handleChange}
                       value={selectedDriver && selectedDriver.PASSWORD_REPEAT}/>
            <br/><br/>
            <div align="right">
                <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
                <Button onClick={() => openCloseModalCreate()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE EL CHOFER</h3>
            <TextField className={styles.inputMaterial} label="Nombre del chofer" name="NAME"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.NAME}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Apellido del chofer" name="SURNAME"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.SURNAME}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Email del chofer" name="EMAIL" onChange={handleChange}
                       value={selectedDriver && selectedDriver.EMAIL}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Numero de telefono del chofer" name="PHONE_NUMBER"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.PHONE_NUMBER}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Contraseña del chofer" name="PASSWORD"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.PASSWORD}/>
            <br/><br/>
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR CHOFER</h3>
            <TextField className={styles.inputMaterial} label="Nombre del chofer" name="NAME"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.NAME}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Apellido del chofer" name="SURNAME"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.SURNAME}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Email del chofer" name="EMAIL" onChange={handleChange}
                       value={selectedDriver && selectedDriver.EMAIL}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Numero de telefono del chofer" name="PHONE_NUMBER"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.PHONE_NUMBER}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Contraseña del chofer" name="PASSWORD"
                       onChange={handleChange}
                       value={selectedDriver && selectedDriver.PASSWORD}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Ingrese nuevamente la contraseña del chofer"
                       name="PASSWORD_REPEAT" onChange={handleChange}/>
            <br/><br/>
            <div align="right">
                <Button color="primary" onClick={() => peticionPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    )

    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar el chofer con email <b>{selectedDriver && selectedDriver.EMAIL}</b> ?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => peticionDelete()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>
            </div>
        </div>
    )

    return (
        <div className="App">
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

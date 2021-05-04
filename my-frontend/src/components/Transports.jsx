import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import MaterialTable from "material-table";
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {BACKEND_URL} from '../const/config.js';
a
const columns = [
    {title: 'Identificación', field: 'internal_identification'},
    {title: 'Patente', field: 'registration_number'},
    {title: 'Modelo', field: 'model'},
    {title: 'Tipo de confort', field: 'type_comfort'},
    {title: 'Chofer', field: 'driver'}
];
const baseUrl = `${BACKEND_URL}/artistas`;


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

function Transports() {
    const styles = useStyles();
    const [data, setData] = useState([
        {
            id: 1,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 10,
            type_comfort: 'Súper-cómoda',
            driver: 'Mansilla Carlos Eduardo Fabian'
        },
        {
            id: 2,
            internal_identification: 'C002',
            registration_number: 'ZX987CV',
            model: 'Renault Trafic',
            seating: 20,
            type_comfort: 'Cómoda',
            driver: 'Gonzalez Belisle Betina Mabel'
        },
        {
            id: 3,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 30,
            driver: 'Mansilla Carlos Eduardo Fabian',
            type_comfort: 'Súper-cómoda'
        },
        {
            id: 4,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 40,
            type_comfort: 'Súper-cómoda',
            driver: 'Mansilla Carlos Eduardo Fabian'
        },
        {
            id: 5,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 50,
            type_comfort: 'Súper-cómoda',
            driver: 'Mansilla Carlos Eduardo Fabian'
        },
        {
            id: 6,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 60,
            type_comfort: 'Súper-cómoda',
            driver: 'Mansilla Carlos Eduardo Fabian'
        },
        {
            id: 7,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 70,
            type_comfort: 'Súper-cómoda',
            driver: 'Mansilla Carlos Eduardo Fabian'
        },
        {
            id: 8,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 80,
            type_comfort: 'Súper-cómoda',
            driver: 'Mansilla Carlos Eduardo Fabian'
        },
        {
            id: 9,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 90,
            type_comfort: 'Súper-cómoda',
            driver: 'Mansilla Carlos Eduardo Fabian'
        },
        {
            id: 10,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 100,
            type_comfort: 'Súper-cómoda',
            driver: 'Mansilla Carlos Eduardo Fabian'
        },
        {
            id: 1,
            internal_identification: 'C001',
            registration_number: 'AB123CD',
            model: 'Mercedes Benz Bmo 390',
            seating: 110,
            type_comfort: 'Súper-cómoda',
            driver: 'Mansilla Carlos Eduardo Fabian'
        },
    ]);
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedTransport, setSelectedTransport] = useState({
        id: "",
        internal_identification: "",
        registration_number: "",
        model: "",
        seating: "",
        type_comfort: "",
        driver: ""
    })

    const handleChange = e => {
        const {name, value} = e.target;
        setSelectedTransport(prevState => ({
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

    const selectTransport = (transport, action) => {
        setSelectedTransport(transport);
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
            <h3>AGREGAR NUEVA COMBI</h3>
            <TextField className={styles.inputMaterial} label="Identificador interno" name="internal_identification"
                       onChange={handleChange}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Patente" name="registration_number"
                       onChange={handleChange}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Modelo" name="model" onChange={handleChange}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Cantidad de asientos" name="seating"
                       onChange={handleChange}/>
            <TextField className={styles.inputMaterial} label="Tipo de confort" name="type_comfort"
                       onChange={handleChange}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Chofer" name="driver" onChange={handleChange}/>
            <br/><br/>
            <div align="right">
                <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
                <Button onClick={() => openCloseModalCreate()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE LA COMBI</h3>
            <TextField className={styles.inputMaterial} label="Identificador interno" name="internal_identification"
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
            <TextField className={styles.inputMaterial} label="Tipo de confort" name="type_comfort"
                       value={selectedTransport && selectedTransport.type_comfort}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Chofer" name="driver"
                       value={selectedTransport && selectedTransport.driver}/>
            <br/><br/>
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR COMBI</h3>
            <TextField className={styles.inputMaterial} label="Identificador interno" name="internal_identification"
                       onChange={handleChange}
                       value={selectedTransport && selectedTransport.internal_identification}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Patente" name="registration_number"
                       onChange={handleChange}
                       value={selectedTransport && selectedTransport.registration_number}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Modelo" name="model" onChange={handleChange}
                       value={selectedTransport && selectedTransport.model}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Cantidad de asientos" name="seating"
                       onChange={handleChange}
                       value={selectedTransport && selectedTransport.seating}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Tipo de confort" name="type_comfort"
                       onChange={handleChange}
                       value={selectedTransport && selectedTransport.type_comfort}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Chofer" name="driver" onChange={handleChange}
                       value={selectedTransport && selectedTransport.driver}/>
            <br/><br/>
            <div align="right">
                <Button color="primary" onClick={() => peticionPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    )

    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar la combi con
                identificación <b>{selectedTransport && selectedTransport.internal_identification}</b> y
                patente <b>{selectedTransport && selectedTransport.registration_number}</b>?
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
                    {
                        icon: 'edit',
                        tooltip: 'Editar combi',
                        onClick: (event, rowData) => selectTransport(rowData, "Editar")
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Eliminar combi',
                        onClick: (event, rowData) => selectTransport(rowData, "Eliminar")
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

export default Transports;

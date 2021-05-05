import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import MaterialTable from "material-table";
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import Search from '@material-ui/icons/Search';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {getTransports} from '../api/Transport';
import {useStyles} from '../const/modalStyle';
import {materialTableConfiguration} from '../const/materialTableConfiguration';

const columns = [
    {title: 'Identificación', field: 'internal_identification'},
    {title: 'Patente', field: 'registration_number'},
    {title: 'Modelo', field: 'model'},
    {title: 'Tipo de confort', field: 'comfort.type_comfort_name'},
    {
        title: 'Chofer', render: (data) => `${data.driver.surname}, ${data.driver.name}`,
        customFilterAndSearch: (term, data) => (`${data.driver.surname.toLowerCase()}, ${data.driver.name.toLowerCase()}`).indexOf(term.toLowerCase()) != -1
    },
    {title: 'Estado', field: 'active'}
];


function Transports() {
    const styles = useStyles();
    const [data, setData] = useState([]);
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
        }
    })

    const handleChange = async e => {
        const {name, value} = e.target;
        setSelectedTransport(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const postTransport = async () => {
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
    }

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

    useEffect(async () => {
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
            <TextField className={styles.inputMaterial} label="Tipo de confort" name="type_comfort_name"
                       onChange={handleChange}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Chofer" name="driver" onChange={handleChange}/>
            <br/><br/>
            <div align="right">
                <Button color="primary" onClick={() => postTransport()}>Insertar</Button>
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
            <TextField className={styles.inputMaterial} label="Tipo de confort" name="type_comfort_name"
                       value={selectedTransport && selectedTransport.comfort.type_comfort_name}/>
            <br/>

            <TextField className={styles.inputMaterial} label="Chofer" name="driver"
                       value={selectedTransport && `${selectedTransport.driver.surname}, ${selectedTransport.driver.name}`}/>
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
            <TextField className={styles.inputMaterial} label="Tipo de confort" name="type_comfort_name"
                       onChange={handleChange}
                       value={selectedTransport && selectedTransport.comfort.type_comfort_name}/>
            <br/>
            <TextField className={styles.inputMaterial} label="Chofer" name="driver" onChange={handleChange}
                       value={selectedTransport && `${selectedTransport.driver.surname}, ${selectedTransport.driver.name}`}/>
            <br/><br/>
            <div align="right">
                <Button color="primary" onClick={() => putTransport()}>CONFIRMAR CAMBIOS</Button>
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
                <Button color="secondary" onClick={() => deleteTransport()}>SÍ, ELIMINAR</Button>
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
                    id="btnNewCombi"
                    startIcon={<AirportShuttleIcon/>}
                    onClick={() => openCloseModalCreate()}>NUEVA COMBI</Button>
            <br/><br/>
            <MaterialTable
                columns={columns}
                data={data}
                icons={{Filter: () => <Search/>}}
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

import {Button, Modal, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import {useStyles} from '../const/componentStyles';
import MaterialTable from '@material-table/core';
import {Message} from './Message';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PeopleIcon from '@material-ui/icons/People';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useHistory } from 'react-router-dom';
import moment from "moment";
/* USER IMPORTS */
// All error messages for API requests, verifications, etc
import {
    ERROR_MSG_API_GET_TRIPS,
    ERROR_MSG_API_FINISH_TRIP,
} from '../const/messages';

import React, {useEffect, useState} from 'react';
/* Import all API request async functions,
 this brings all user comments from database &
 adds CRUD functionality (will call backend API functions) */
import {
    getDriverTrips,
    finishTrip
} from '../api/DriverTrips';
import { TripPassengers } from './TripPassengers';


/* FORMATTING & STYLES */ 

// Styles for comments modal
const modalStyles = makeStyles((theme) => ({
    paper: {
            position: 'absolute',
            width: "75%",
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            top:'10%',
            left:'10%',
            overflow:'scroll',
            height:'90%',
            display:'block'
         },
    small: {
            position: 'absolute',
            width: "60%",
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
         },
  }));




function DriverListTrips() {
    //Configures any success or error messages for API functionality
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };
   
    // Columns for trips list - overflow formatting to keep list simple & neat
    const columns = [
        {title: 'ID de Viaje', field: 'tripId'},
        {title: 'Origen', field: 'route.departure'},
        {title: 'Destino', field: 'route.destination'},
        {
            title: 'Precio', field: 'price'
        },
        {
            title: 'Fecha de salida',
            render: (data) => `${moment(data.departureDay).format('DD/MM/YYYY HH:mm')}hs`,
            customFilterAndSearch: (term, data) => (`${moment(data.departureDay).format('DD/MM/YYYY HH:mm')}hs`).indexOf(term.toLowerCase()) !== -1
        },
        {title: 'Fecha de llegada', field: 'arrivalDay'},
        {
            title: 'Combi',
            render: (data) => `${data.transport.internalIdentification} -  ${data.transport.registrationNumber}`,
            customFilterAndSearch: (term, data) => (`${data.transport.internalIdentification.toLowerCase()}, ${data.transport.registrationNumber.toLowerCase()}`).indexOf(term.toLowerCase()) !== -1
        }
    ];
    // Formats the selected comment using fetched fields 
    const formatSelectedTrip = {
        tripId: "",
        ticketId: "",
        price: "",
        departureDay: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        arrivalDay: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        duration: "",
        active: "",
        route: {
            routeId: "",
            departureId: "",
            departure: "",
            destinationId: "",
            destination: ""
        },
        transport: {
            transportId: "",
            internalIdentification: "",
            registrationNumber: ""
        }
    };

    /* HOOKS SETTINGS */ 

    // styles configuration 
    const modal = modalStyles();

    //Saves user data and informs new data has been loaded 
    const [data, setData] = useState([]);
    const [newData, setNewData] = useState(true);

    // Saves state of error messages for user information
    const [tripError, setTripError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    // Modal settings
    const [finishModal, setFinishModal] = useState(false);
    const [listModal, setListModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    //Saves the state current comment selected by the user 
    const [selectedTrip, setSelectedTrip] = useState(formatSelectedTrip);

    // Sets information of logged in user as default [TODO]
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
    // Saves user information from local storage (from login)
    const newUser = JSON.parse(localStorage.getItem('userData'));
    // Sets state based on the current url 
    const history = useHistory()
    const [url, setUrl] = useState(history.location.pathname.substring(1))
   
 

    // Sets state of new user whenever component mounts to keep data consistent [TODO]
    useEffect(() => {
        setUserData(newUser)
    }, []);
    console.log("user", newUser)

    /* FUNCTIONALITY - VALIDATION & MODALS*/ 

    //Error messages default to none 
    const setDefaultErrorMessages = () => {
        setTripError('');
    };
    /* This function is called when icons are pressed in the data table.
       A different Modal opens depending on which choice was selected */
    const selectTrip = async (trip, action) => {
        setSelectedTrip(trip);
        localStorage.setItem('tripId', selectedTrip.tripId);
        localStorage.setItem('departurePlace', selectedTrip.route.departurePlace);
        localStorage.setItem('destinationPlace', selectedTrip.route.destinationPlace);
        localStorage.setItem('departureDay', selectedTrip.route.departureDay);   
        if (action === "Terminar") {
            openCloseModalFinish(trip)
        } else if (action === "Lista") {
            openCloseModalList(trip)
        } else if (action === "Ver") {
            openCloseModalViewDetails()
        }    
    };
    // The following functions are used to open Modal dialogues for API functionality
    const openCloseModalFinish = () => {
        setFinishModal(!finishModal);
        if (finishModal) {
            setSelectedTrip(formatSelectedTrip);;
            setDefaultErrorMessages();
        }
    };
    const openCloseModalList = () => {
        setListModal(!listModal);
        if (listModal) {
            setSelectedTrip(formatSelectedTrip);;
            setDefaultErrorMessages();
        }
    };
    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
        if (viewModal) {
            setSelectedTrip(formatSelectedTrip);;
            setDefaultErrorMessages();
        }
    };

    /* API CALLS & DATABASE FUNCTIONS*/

    // API: sets all the passenger tickets in this trip to status 5
    const finishThisTrip = async () => {
        try {
            let getTripsResponse = await finishTrip(selectedTrip.tripId);
            if (getTripsResponse?.status === 200) {
                openCloseModalFinish();
                setSuccessMessage(`Se ha terminado el viaje correctamente`);
                 setOptions({
                ...options, open: true, type: 'success',
                message: `Se ha terminado el viaje correctamente`
            });
            setNewData(true);
            } else {
                setSuccessMessage(`${ERROR_MSG_API_FINISH_TRIP} ${getTripsResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_FINISH_TRIP} ${getTripsResponse}`
                });
            }
        } catch (error) {
            console.log(`${ERROR_MSG_API_FINISH_TRIP} ${error}`);
        }
    };
    //API: gets driver trips according to url and refreshes on ("newData")
        const fetchData = async () => {
            try {
                let getTripsResponse;
                getTripsResponse = await getDriverTrips(userData.userId, url, 1);
                if (getTripsResponse?.status === 200) {
                    let data = getTripsResponse.data;
                    setData(data);
                } else {
                    setSuccessMessage(`${ERROR_MSG_API_GET_TRIPS} ${getTripsResponse}`);
                    setOptions({
                        ...options, open: true, type: 'error',
                        message: `${ERROR_MSG_API_GET_TRIPS} ${getTripsResponse}`
                    });
                }
            } catch (error) {
                console.log(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
            }
        };

    useEffect(() => {
        if (newData) {
        fetchData();
        }
        return setNewData(false);
    }, [newData]);

    useEffect(() => {
        fetchData();
    }, [url]);

    /* JSX COMPONENTS & FORMATTING */

    // The following functions format the CRUD functionality for the user
    const bodyFinishDetails = (
        <div className={modal.small}>
          <Typography variant="h5" label="ID de viaje" name="tripId" gutterBottom>
             ¿Estás seguro de dar por terminado el viaje con id {selectedTrip.tripId}?
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>{selectedTrip.route.departure} y {selectedTrip.route.destination}</Typography>
            <br/>     
            <div align="right">
                <Button color="secondary" onClick={() =>finishThisTrip()}>SÍ, TERMINAR</Button>
                <Button onClick={() => openCloseModalFinish()}>NO, CANCELAR</Button>
            </div>
        </div>
      );

      const bodyConfirmPassangers = (
        <div className={modal.paper}>
          <TripPassengers trip={selectedTrip} />
          <br/>     
            <div align="right">
                <Button onClick={() => openCloseModalList()}>CERRAR</Button>
            </div>
        </div>
      );
      const bodyViewDetails = (
        <div className={modal.small}>
          <Typography variant="h5" label="ID de viaje" name="tripId" gutterBottom>
             Viaje con id {selectedTrip.tripId}
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            Origen: {selectedTrip.route.departure}</Typography>
          <Typography variant="body1" component="p" gutterBottom>
            Destino: {selectedTrip.route.destination}</Typography>
          <Typography variant="body1" component="p" gutterBottom>
            Precio: ${selectedTrip.price}</Typography>
          <Typography variant="body1" component="p" gutterBottom>
            Duración: {selectedTrip.duration}hs</Typography>
          <Typography variant="body1" component="p" gutterBottom>
            Fecha de partida: {selectedTrip.departureDay}</Typography>
        <Typography variant="body1" component="p" gutterBottom>
            Fecha de llegada: {selectedTrip.arrivalDay}</Typography>
        <Typography variant="body1" component="p" gutterBottom>
            Combi: {selectedTrip.transport.internalIdentification} - {selectedTrip.transport.registrationNumber}</Typography>
            <br/>     
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
            </div>
        </div>
      );


    return (
        <div className="App">
            {/* Sets error or success messages for user interactivity */}
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                            handleClose={options.handleClose}/>
                    : null
            }
            <br/>
            {/* Lists all of the comments and gives user option to view, edit or delete */}
            <MaterialTable
                columns={columns}
                data={data}
                title={"Viajes pendientes"}
                actions={[
                    {
                        icon: () => <VisibilityIcon/>,
                        tooltip: 'Ver viaje',
                        onClick: (event, rowData) => selectTrip(rowData, "Ver")
                    },
                    {
                        icon: () => <CheckCircleIcon/>,
                        tooltip: 'Terminar viaje',
                        onClick: (event, rowData) => selectTrip(rowData, "Terminar")
                    },
                    {
                        icon: () => <PeopleIcon/>,
                        tooltip: 'Confirmar pasajeros',
                        onClick: (event, rowData) => selectTrip(rowData, "Lista") 
                    }
                ]}
                options={materialTableConfiguration.options}
                localization={materialTableConfiguration.localization}
            />
            {/* This section formats the modals for user CRUD interaction */}

            <Modal
                open={finishModal}
                onClose={openCloseModalFinish}>
                {bodyFinishDetails}
            </Modal>
            <Modal
                open={listModal}
                onClose={openCloseModalList}>
                {bodyConfirmPassangers}
            </Modal>
            <Modal
                open={viewModal}
                onClose={openCloseModalViewDetails}>
                {bodyViewDetails}
            </Modal>


        </div>
    );
}


export default DriverListTrips;

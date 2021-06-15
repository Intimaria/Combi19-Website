import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
    Grid,
    Modal,
    TextField,
    Typography
} from '@material-ui/core';
import {
    ERROR_MSG_API_CANCEL_PASSENGER_TRIP,
    ERROR_MSG_API_GET_TRIPS
} from "../const/messages";
import React, {useEffect, useState} from 'react';
import {
    cancelPassengerTrip,
    getPassengerTrips
} from '../api/PassengerTrips';

import { CancelTrip } from './CancelTrip'
import CardTravelIcon from '@material-ui/icons/CardTravel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MaterialTable from '@material-table/core';
import {Message} from '../components/Message';
import {PassengerTicket} from './PassengerTicket';
import {makeStyles} from '@material-ui/core/styles';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import moment from "moment";
import {useStyles} from '../const/componentStyles';

const columns = [
    {title: 'Origen', field: 'route.departure'},
    {title: 'Destino', field: 'route.destination'},
    {
        title: 'Precio', field: 'price'
    },
    {title: 'Fecha de llegada', field: 'departureDay'},
    {title: 'Fecha de llegada', field: 'arrivalDay'},
    {title: 'Duración', field: 'duration'},
    {
        title: 'Combi',
        render: (data) => `${data.transport.internalIdentification} -  ${data.transport.registrationNumber}`,
        customFilterAndSearch: (term, data) => (`${data.transport.internalIdentification.toLowerCase()}, ${data.transport.registrationNumber.toLowerCase()}`).indexOf(term.toLowerCase()) !== -1
    }
];


function PassengerTrips() {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const formatSelectedTrip = {
        tripId: "",
        price: "",
        departureDay: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        active: "",
        status: "",
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

    const styles = useStyles();

    const [data, setData] = useState([]);
    const [newData, setNewData] = useState(true);

    const [viewModal, setViewModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(formatSelectedTrip);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))
    const [tripType, setTripType] = useState([]);
    const [activeTrips, setActiveTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    const [pendingTrips, setPendingTrips] = useState([]);
    const [rejectedTrips, setRejectedTrips] = useState([]); 
    
    const newUser = JSON.parse(localStorage.getItem('userData'));
  
    useEffect(() => {
       setUserData(newUser)
    }, []);


    const setDefaultValues = () => {
        setDefaultObjectsValues();
        setDefaultErrorMessages();
    };

    const setDefaultObjectsValues = () => {
        setSelectedTrip(formatSelectedTrip);
    };

    const setDefaultErrorMessages = () => {
        setDefaultErrorMessages();
    };

      const handleData = (data) => {
        const pendingTrips = data.filter(d => d.status === 1);
        const activeTrips = data.filter(d => d.status === 2);
        const rejectedTrips = data.filter(d => d.status === 3 || d.status === 4);
        const pastTrips = data.filter(d => d.status === 5);
        setPendingTrips (pendingTrips);
        setActiveTrips (activeTrips);
        setRejectedTrips (rejectedTrips);
        setPastTrips (pastTrips)
    };


    /*
    const requestCancel = async () => {
        let cancelResponse = await cancelPassengerTrip(selectedTrip.tripId);
        if (cancelResponse?.status === 200) {
            openCloseModalCancel();
            setSuccessMessage(cancelResponse.data);
            setOptions({
                ...options, open: true, type: 'success',
                message: cancelResponse.data
            });
            fetchData();
        } else {
            setSuccessMessage(`${ERROR_MSG_API_CANCEL_PASSENGER_TRIP} ${cancelResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_CANCEL_PASSENGER_TRIP} ${cancelResponse}`
            });
        }
    };
    */
    const fetchData = async () => {
        try {
            let getTripsResponse = await getPassengerTrips(userData.userId);

            if (getTripsResponse.status === 200) {
                let data = getTripsResponse.data;
                setData(data);
                handleData(data);
            } else if (getTripsResponse.status === 500) {
                setSuccessMessage(getTripsResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: getTripsResponse.data
                });

                return true
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
    const eventhandler = (cancel) => {
        if (cancel) {
            // call view modal
            // call API cancel trip with id 
            // show modal with success message
            // if there's errors, show these instead
     } 
    }

    useEffect(() => {
        fetchData()
  }, []);

    return (
        <div className="App" style={{maxWidth: "80%",margin: 'auto',float: "center"}}>
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="viaje activo"
                id="activo"
                >
                Viajes activos
                </AccordionSummary>
                <AccordionDetails>
                <Grid container
                direction="row"
                justifycontent="flex-start"
                alignItems="flex-start"
                wrap="wrap"
                alignContent="center"
                spacing={3}>
                { activeTrips.length ?
                 activeTrips.map((elem, index) => (
                    <Grid style = {{width: "100%"}}
                    item>
                    <PassengerTicket 
                        key={index} myTicket={elem} 
                        mainColor={"#E65100"}
                        lightColor={"#FFE0B2"}
                        insert={"#FFB74D"}/>
                    </Grid>
                    ))
                    : 
                    <Typography  variant="subtitle2" gutterBottom>
                      Usted no posee viajes activos
                    </Typography>
                }
                </Grid>
                </AccordionDetails>
            </Accordion>
            <Divider  />
            <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="viajes pendientes"
                id="pendiente"
                >
                Viajes pendientes
                </AccordionSummary>
                <AccordionDetails>
                <Grid container
                direction="row"
                justifycontent="flex-start"
                alignItems="flex-start"
                wrap="wrap"
                alignContent="center"
                spacing={3}>
               {pendingTrips.length ? 
                pendingTrips.map((elem, index) => (
                    <Grid style = {{width: "100%"}}
                    item>
                    <PassengerTicket 
                        key={index} myTicket={elem} 
                        mainColor={"#00796B"}
                        lightColor={"#E0F2F1"}
                        insert={"#80CBC4"}
                        onClick={console.log("click")}/>
                    <br/>
                    <Box textAlign='right'>
                    <CancelTrip onChange={eventhandler} trip={elem}/>
                    </Box>
                    </Grid>
                    ))
                    : 
                        <Typography  variant="subtitle2" gutterBottom>
                          Usted no posee viajes pendientes
                        </Typography>
                }
                </Grid>
                
                </AccordionDetails>
                <Divider />
            </Accordion>
            <Divider />
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="viajes finalizados"
                id="finalizados"
                >
                Viajes finalizados
                </AccordionSummary>
                <AccordionDetails>
                        
                <Grid container
                direction="row"
                justifycontent="flex-start"
                alignItems="flex-start"
                wrap="wrap"
                alignContent="center"
                spacing={3}>
                    { pastTrips.length ? 
                 pastTrips.map((elem, index) => (
                    <Grid style = {{width: "100%"}}
                    item>
                    <PassengerTicket 
                        key={index} myTicket={elem} 
                        mainColor={"#003399"}
                        lightColor={"#ecf2ff"}
                        insert={"#bed0f5"}
                        />
                    </Grid>
                    ))
                    :
                    <Typography  variant="subtitle2" gutterBottom>
                        Usted no posee viajes finalizados
                    </Typography>
                }
                </Grid>
                </AccordionDetails>
            </Accordion>
            <Divider />
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="viajes rechazados"
                id="rechazados"
                >
                Viajes dados de baja
                </AccordionSummary>
                <AccordionDetails>
                <Grid container
                direction="row"
                justifycontent="flex-start"
                alignItems="flex-start"
                wrap="wrap"
                alignContent="center"
                spacing={3}>
                {rejectedTrips.length ?
                rejectedTrips.map((elem, index) => (
                    <Grid style = {{width: "100%"}}
                    item>
                    <PassengerTicket 
                        key={index} myTicket={elem} 
                        mainColor={"#BF360C"}
                        lightColor={"#FFCCBC"}
                        insert={"#FF8A65"}/>
                    </Grid>
                ))
                : 
                <Typography  variant="subtitle2" gutterBottom>
                  Usted no posee viajes dados de baja
                </Typography>
                }
                </Grid>
                </AccordionDetails>
            </Accordion>
          
        </div>
    );
}

export default PassengerTrips;

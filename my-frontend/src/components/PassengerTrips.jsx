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
    Typography,
    MaterialTable
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {useEffect, useState} from 'react';
import moment from "moment";
import {useStyles} from '../const/componentStyles';

/* USER IMPORTS */
import {Message} from '../components/Message';
import {PassengerTicket} from './PassengerTicket';
import {CancelTrip} from './CancelTrip'
import {
    ERROR_MSG_API_CANCEL_PASSENGER_TRIP,
    ERROR_MSG_API_GET_TRIPS
} from "../const/messages";
import {
    cancelPassengerTrip,
    getPassengerTrips
} from '../api/PassengerTrips';

/* FORMATTING & STYLES */ 

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
        ticketId: "",
        price: "",
        departureDay: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        active: "",
        status: "",
        percentage: "",
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
    const styles = useStyles();

    //Saves user data and informs new data has been loaded 
    const [data, setData] = useState([]);
    const [newData, setNewData] = useState(true);

    // Modal settings
    const [viewModal, setViewModal] = useState(false);

    // Saves state of error messages for user information
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    //Saves the state current ticket selected by the user 
    const [selectedTrip, setSelectedTrip] = useState(formatSelectedTrip);

    // Saves ticket data in different arrays according to their status
    const [activeTrips, setActiveTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    const [pendingTrips, setPendingTrips] = useState([]);
    const [rejectedTrips, setRejectedTrips] = useState([]);
    const [cancelledTrips, setCancelledTrips] = useState([]);

    //const newUser = JSON.parse(localStorage.getItem('userData'));

    // Sets information of logged in user on component mount [TODO]
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
    useEffect(() => {
        setUserData(userData)
    }, []);

/* [TODO]
    const setDefaultValues = () => {
        setDefaultObjectsValues();
        setDefaultErrorMessages("");
    };

    const setDefaultObjectsValues = () => {
        setSelectedTrip(formatSelectedTrip);
    };

    const setDefaultErrorMessages = () => {
        setSuccessMessage("");
    };
*/
    // Called when fetchData API gets user ticket data from Database: divides by status
    const handleData = (data) => {
        const pendingTrips = data.filter(d => d.status === 1);
        const activeTrips = data.filter(d => d.status === 2);
        const rejectedTrips = data.filter(d => d.status === 3);
        const cancelledTrips = data.filter(d => d.status === 4);
        const pastTrips = data.filter(d => d.status === 5);
        setPendingTrips(pendingTrips);
        setActiveTrips(activeTrips);
        setRejectedTrips(rejectedTrips);
        setPastTrips(pastTrips)
        setCancelledTrips(cancelledTrips)
    };

    /* API CALLS & DATABASE FUNCTIONS*/

    // API: gets all the user trips from the database
    const fetchData = async () => {
        try {
            let getTripsResponse = await getPassengerTrips(userData.userId);
            console.log(getTripsResponse)
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
    // This call to fetchData only occurs when the component first mounts (gets trips from DB)
    useEffect(() => {
        fetchData()
    }, []);
    useEffect(() => {
        fetchData()
    }, [newData]);

    /* FUNCTIONALITY - CHILD COMPONENT */ 
    // Called when a trip is cancelled by the user, will fetch new data from the DB
    const eventHandler = async (cancel, data, ticket) => {
        console.log("se llamo eventHandler", cancel, data, ticket)
        if (cancel) {
            setNewData(true);
        }
    };

        /* JSX COMPONENTS & FORMATTING */

    return (
        <div className="App" style={{maxWidth: "80%", margin: 'auto', float: "center"}}>
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
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
                        {activeTrips.length ?
                            activeTrips.map((elem, index) => (
                                <Grid style={{width: "100%"}}
                                    key={index} 
                                    item>
                                    <PassengerTicket
                                        myTicket={elem}
                                        mainColor={"#E65100"}
                                        lightColor={"#FFE0B2"}
                                        insert={"#FFB74D"}/>
                                </Grid>
                            ))
                            :
                            <Typography variant="subtitle2" gutterBottom>
                                Usted no posee viajes activos
                            </Typography>
                        }
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Divider/>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
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
                                <Grid style={{width: "100%"}}
                                    key={index}
                                    item>
                                    <PassengerTicket
                                        myTicket={elem}
                                        mainColor={"#00796B"}
                                        lightColor={"#E0F2F1"}
                                        insert={"#80CBC4"}
                                    />
                                    <br/>
                                    <Box textAlign='right'>
                                        <CancelTrip 
                                        onClick={eventHandler} 
                                        trip={elem} 
                                        user={userData}/>
                                    </Box>
                                </Grid>
                            ))
                            :
                            <Typography variant="subtitle2" gutterBottom>
                                Usted no posee viajes pendientes
                            </Typography>
                        }
                    </Grid>

                </AccordionDetails>
                <Divider/>
            </Accordion>
            <Divider/>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
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
                        {pastTrips.length ?
                            pastTrips.map((elem, index) => (
                                <Grid style={{width: "100%"}}
                                    key={index}
                                    item>
                                    <PassengerTicket
                                         myTicket={elem}
                                        mainColor={"#003399"}
                                        lightColor={"#ecf2ff"}
                                        insert={"#bed0f5"}
                                    />
                                </Grid>
                            ))
                            :
                            <Typography variant="subtitle2" gutterBottom>
                                Usted no posee viajes finalizados
                            </Typography>
                        }
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Divider/>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="viajes rechazados"
                    id="rechazados"
                >
                    Viajes rechazados
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
                                <Grid style={{width: "100%"}}
                                    key={index} 
                                    item>
                                    <PassengerTicket
                                        myTicket={elem}
                                        mainColor={"#7B1FA2"}
                                        lightColor={"#F3E5F5"}
                                        insert={"#CE93D8"}/>
                                </Grid>
                            ))
                            :
                            <Typography variant="subtitle2" gutterBottom>
                                Usted no posee viajes rechazados
                            </Typography>
                        }
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Divider/>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="viajes cancelados"
                    id="cancelados"
                >
                    Viajes cancelados
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container
                          direction="row"
                          justifycontent="flex-start"
                          alignItems="flex-start"
                          wrap="wrap"
                          alignContent="center"
                          spacing={3}>
                        {cancelledTrips.length ?
                            cancelledTrips.map((elem, index) => (
                                <Grid style={{width: "100%"}}
                                    key={index} 
                                    item>
                                    <PassengerTicket
                                        myTicket={elem}
                                        cancelled={true}
                                        mainColor={"#BF360C"}
                                        lightColor={"#FFCCBC"}
                                        insert={"#FF8A65"}/>
                                </Grid>
                            ))
                            :
                            <Typography variant="subtitle2" gutterBottom>
                                Usted no posee viajes cancelados
                            </Typography>
                        }
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default PassengerTrips;

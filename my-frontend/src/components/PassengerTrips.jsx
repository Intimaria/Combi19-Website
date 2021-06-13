import {Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Divider, Grid, Modal, TextField} from '@material-ui/core';
import React, {useEffect, useState} from 'react';

import CardTravelIcon from '@material-ui/icons/CardTravel';
import {
    ERROR_MSG_API_GET_TRIPS
} from "../const/messages";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MaterialTable from '@material-table/core';
import {Message} from '../components/Message';
import {PassengerTicket} from './PassengerTicket';
import {
    getPassengerTrips
} from '../api/PassengerTrips';
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
                justifyContent="flex-start"
                alignItems="flex-start"
                wrap="wrap"
                alignContent="center"
                spacing={3}>
                {activeTrips.map((elem, index) => (
                    <Grid style = {{width: "100%"}}
                    direction="column"
                    item
                    flexGrow={0}
                    flexShrink={0}>
                    <PassengerTicket key={index} tripToBuy={elem}/>
                    </Grid>
                    ))
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
                justifyContent="flex-start"
                alignItems="flex-start"
                wrap="wrap"
                alignContent="center"
                spacing={3}>
                {pendingTrips.map((elem, index) => (
                    <Grid style = {{width: "100%"}}
                    direction="column"
                    item
                    flexGrow={0}
                    flexShrink={0}>
                    <PassengerTicket 
                        key={index} tripToBuy={elem}/>
                    </Grid>
                    ))
                }
                </Grid>
                </AccordionDetails>
                <Divider />
{/*                 <AccordionActions>
                    <Button size="small">Cancel</Button>
                    <Button size="small" color="primary">
                        Save
                    </Button>
                 </AccordionActions> */}
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
                justifyContent="flex-start"
                alignItems="flex-start"
                wrap="wrap"
                alignContent="center"
                spacing={3}>
                {pastTrips.map((elem, index) => (
                    <Grid style = {{width: "100%"}}
                    direction="column"
                    item
                    flexGrow={0}
                    flexShrink={0}>
                    <PassengerTicket 
                        key={index} tripToBuy={elem}/>
                    </Grid>
                    ))
                }
                </Grid>
                {/* <MaterialTable
                title={null}
                columns={columns}
                data={pastTrips}/> */}
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
                justifyContent="flex-start"
                alignItems="flex-start"
                wrap="wrap"
                alignContent="center"
                spacing={3}>
                {rejectedTrips.map((elem, index) => (
                    <Grid style = {{width: "100%"}}
                    direction="column"
                    item
                    flexGrow={0}
                    flexShrink={0}>
                    <PassengerTicket 
                        key={index} tripToBuy={elem}/>
                    </Grid>
                ))
                }
                </Grid>
                </AccordionDetails>
            </Accordion>
          
        </div>
    );
}

export default PassengerTrips;

import {Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Divider, Grid, Modal, TextField} from '@material-ui/core';
import React, {useEffect, useState} from 'react';

import { CancelTrip } from './CancelTrip'
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
import {makeStyles} from '@material-ui/core/styles';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import moment from "moment";
import {useStyles} from '../const/componentStyles';

const mainColor = '#003399';
const lightColor = '#ecf2ff';
const borderRadius = 12;

const ticketStyles = makeStyles(({palette, breakpoints}) => ({
  card: {
      overflow: 'visible',
      background: 'none',
      display: 'flex',
      minWidth: 343,
      minHeight: 150,
      filter: 'drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3))',
      '& $moveLeft, $moveRight': {
          transition: '0.3s',
      },
      [breakpoints.up('sm')]: {
          minWidth: 400,
      },
  },
  left: {
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      flexBasis: '20%',
      display: 'flex',
      backgroundColor: '#fff',
  },
  media: {
      margin: 'auto',
      width: 80,
      height: 80,
      borderRadius: '50%',
  },
  right: {
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
      flex: 1,
      padding: 12,
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: lightColor,
  },
  label: {
      padding: '0 8px',
  },
  heading: {
      fontSize: 24,
      fontWeight: 'bold',
      margin: 0,
      marginBottom: 4,
  },
  subheader: {
      fontSize: 12,
      margin: 0,
      color: palette.text.secondary,
  },
  path: {
      flex: 1,
      flexBasis: 72,
      padding: '0 4px',
  },
  line: {
      position: 'relative',
      margin: '20px 0 16px',
      borderBottom: '1px dashed rgba(0,0,0,0.38)',
  },
  plane: {
      position: 'absolute',
      display: 'inline-block',
      padding: '0 4px',
      fontSize: 32,
      backgroundColor: lightColor,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
  },
  flight: {
      fontSize: 14,
      lineHeight: '24px',
      minWidth: 48,
      padding: '0 8px',
      borderRadius: 40,
      backgroundColor: '#bed0f5',
      color: mainColor,
      display: 'block',
  },
  departureDay: {
      fontSize: 14,
      lineHeight: '24px',
      minWidth: 48,
      padding: '0 8px',
      borderRadius: 40,
      backgroundColor: '#bed0f5',
      color: mainColor,
      display: 'block',
      transform: 'rotate(270deg)',
  },
  moveLeft: {},
  moveRight: {},
}));




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
    
    const newUser = JSON.parse(localStorage.getItem('userData'))
  
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
        const pendingTrips = data.filter(d => d.status == 1)
        const activeTrips = data.filter(d => d.status == 2)
        const rejectedTrips = data.filter(d => d.status == 3 || d.status == 4)
        const pastTrips = data.filter(d => d.status == 5)
        setPendingTrips (pendingTrips)
        setActiveTrips (activeTrips);
        setRejectedTrips (rejectedTrips);
        setPastTrips (pastTrips)
    };

    const fetchData = async () => {
        try {
            let getTripsResponse = await getPassengerTrips(userData.userId);

            if (getTripsResponse.status === 200) {
                let data = getTripsResponse.data;
                setData(data)
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
                Viajes Activos
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
                    item>
                    <PassengerTicket 
                        key={index} myTicket={elem} 
                        useStyles={ticketStyles}
                        mainColor={mainColor}
                        lightColor={lightColor}/>
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
                Viajes Pendientes
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
                    item>
                    <PassengerTicket 
                        key={index} myTicket={elem} 
                        useStyles={ticketStyles}
                        mainColor={mainColor}
                        lightColor={lightColor}
                        onClick={console.log("click")}/>
                    <CancelTrip />
                    </Grid>
                    ))
                }
                </Grid>
                </AccordionDetails>
                {/*                 <AccordionActions>
                    <Button size="small">Cancel</Button>
                    <Button size="small" color="primary">
                        Save
                    </Button>
                 </AccordionActions> */}
                <Divider />
            </Accordion>
            <Divider />
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="viajes finalizados"
                id="finalizados"
                >
                Viajes Finalizados
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
                    item>
                    <PassengerTicket 
                        key={index} myTicket={elem} 
                        useStyles={ticketStyles} 
                        mainColor={mainColor}
                        lightColor={lightColor}
                        />
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
                Viajes Dados de Baja
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
                    item>
                    <PassengerTicket 
                        key={index} myTicket={elem} 
                        useStyles={ticketStyles}
                        mainColor={mainColor}
                        lightColor={lightColor}/>
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

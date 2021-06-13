import {Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Divider, Modal, TextField} from '@material-ui/core';
import React, {useEffect, useState} from 'react';

import CardTravelIcon from '@material-ui/icons/CardTravel';
import {
    ERROR_MSG_API_GET_TRIPS
} from "../const/messages";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpIcon from '@material-ui/icons/Help';
import MaterialTable from '@material-table/core';
import MenuItem from '@material-ui/core/MenuItem';
import {Message} from '../components/Message';
import MomentUtils from "@date-io/moment";
import {PassengerTicket} from './PassengerTicket';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
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
    },
    {title: 'Estado', field: 'status'}
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
    const [tripType, setTripType] = useState(null);
    const [active, setActiveTrip] = useState(null);
    const [pastTrips, setPastTrips] = useState(null);
    const [pendingTrips, setPendingTrips] = useState(null);
    const [rejectedTrips, setRejectedTrips] = useState(null); 
    
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


    const fetchData = async () => {
        try {
            let getTripsResponse = await getPassengerTrips(userData.userId);

            if (getTripsResponse.status === 200) {
                let data = getTripsResponse.data;

                setData(data);
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
        <div className="App">
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <Accordion defaultExpanded>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="viaje activo"
                id="activo"
                >
                "Viajes Activos"
                </AccordionSummary>
                <AccordionDetails>
                <MaterialTable
                columns={columns}
                data={data}/>
                </AccordionDetails>
                <Divider />
                <AccordionActions>
                    <Button size="small">Cancel</Button>
                    <Button size="small" color="primary">
                        Save
                    </Button>
                 </AccordionActions>
                
            </Accordion>
          
        </div>
    );
}

export default PassengerTrips;

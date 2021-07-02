import React, {useState, useEffect} from 'react';
import {Modal, TextField, Button} from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialTable from '@material-table/core';
import Tooltip from '@material-ui/core/Tooltip';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import HelpIcon from '@material-ui/icons/Help';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {useStyles} from '../const/componentStyles';
import {Message} from '../components/Message';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { ExportPdf } from '@material-table/exporters';

import {
    getTrips,
    getTripDependenceById,
    postTrip,
    putTrip,
    deleteTrip
} from '../api/Trips';

import {getAvailableRoutes} from "../api/Routes";

import {
    ERROR_MSG_API_GET_TRIPS,
    ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE,
    ERROR_MSG_EMPTY_ROUTE_DEPARTURE,
    ERROR_MSG_EMPTY_ROUTE_DESTINATION,
    ERROR_MSG_EMPTY_DEPARTURE_DAY,
    ERROR_MSG_INVALID_DEPARTURE_DAY,
    ERROR_MSG_INVALID_MIN_VALUE,
    ERROR_MSG_EMPTY_PRICE,
    ERROR_MSG_INVALID_PRICE,
    ERROR_MSG_INVALID_MIN_PRICE,
    ERROR_MSG_INVALID_MAX_PRICE,
    ERROR_MSG_API_POST_TRIP,
    ERROR_MSG_API_PUT_TRIP,
    ERROR_MSG_API_PUT_TRIP_TICKET_DEPENDENCE,
    ERROR_MSG_API_DELETE_TRIP,
    ERROR_MSG_API_DELETE_TRIP_TICKET_DEPENDENCE

} from "../const/messages";

import {
    REGEX_DATE_YYYY_MM_DD_HH_MM, REGEX_ONLY_DECIMAL_NUMBER
} from "../const/regex";

import {formatDecimalNumber} from "../helpers/numbers";
import { LocalPrintshopSharp } from '@material-ui/icons';
import ClearableDateRange from './ClearableDateRange';




const columns = [
    {title: 'Origen', field: 'route.departure'},
    {title: 'Destino', field: 'route.destination'},
    {
        title: 'Precio', field: 'price'
    },
    {
        title: 'Fecha de salida',
        type: 'date',
        field: 'departureDay',
        render: (data) => `${moment(data.departureDay).format('DD/MM/YYYY HH:mm')}hs`,
        filterComponent: (props) => <ClearableDateRange {...props} />, 
        customFilterAndSearch: (term, data) => {
            let date = moment(data.departureDay)
            let start = moment(`${term[0]?.year}-${term[0]?.month.number}-${term[0]?.day} 00:00`).add(-1, 'minutes')
            let end = moment(`${term[1]?.year}-${term[1]?.month.number}-${term[1]?.day} 23:59`)
            let includes = date.isBetween(start, end)
            return includes;
            }
    },
    {   
        title: 'Fecha de llegada',
        type: 'date',
        field: 'arrivalDay',
        render: (data) => `${moment(data.arrivalDay).format('DD/MM/YYYY HH:mm')}hs`,
        filterComponent: (props) => <ClearableDateRange {...props} />, 
        customFilterAndSearch: (term, data) => {
                                let date = moment(data.arrivalDay)
                                let start = moment(`${term[0]?.year}-${term[0]?.month.number}-${term[0]?.day}  00:00`).add(-1, 'minutes')
                                let end = moment(`${term[1]?.year}-${term[1]?.month.number}-${term[1]?.day} 23:59`)
                                let includes = date.isBetween(start, end)
                                return includes;
                                }
    },
    {
        title: 'Combi',
        field: 'transport.registrationNumber',
        render: (data) => `${data.transport.registrationNumber}`,
        customFilterAndSearch: (term, data) => (`${data.transport.registrationNumber.toLowerCase()}`).indexOf(term.toLowerCase()) !== -1
    },
    {title: 'Chofer', field: 'driver'}
];


function TripsReport() {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const formatSelectedTrip = {
        price: "",
        departureDay: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        arrivalDay: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        active: "",
        status: "",
        driver: "",
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
    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [departureRouteSelected, setDepartureRouteSelected] = useState('');
    const [destinationRouteSelected, setDestinationRouteSelected] = useState('');
    const [routeTransport, setRouteTransport] = useState(' - ');
    const [departureRouteSelectedError, setDepartureRouteSelectedError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [destinationRouteSelectedError, setDestinationRouteSelectedError] = useState(false);
    const [departureDayError, setDepartureDayError] = useState(false);
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(formatSelectedTrip);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const setDefaultValues = () => {
        setDefaultObjectsValues();
        setDefaultErrorMessages();
    };

    const setDefaultObjectsValues = () => {
        setSelectedTrip(formatSelectedTrip);
        setAvailableRoutes([]);
        setFilteredRoutes([]);
        setDepartureRouteSelected('');
        setDestinationRouteSelected('');
        setRouteTransport(' - ');
    };

    const setDefaultErrorMessages = () => {
        setDefaultApiErrorMessages();
        setPriceError(false);
        setDepartureRouteSelectedError(false);
        setDestinationRouteSelectedError(false);
        setDepartureRouteSelectedError(false);
    };

    const setDefaultApiErrorMessages = () => {
        setDepartureDayError(false);
    };

    const fetchData = async () => {
        try {
            let getTripsResponse = await getTrips();

            if (getTripsResponse.status === 200) {
                let data = getTripsResponse.data;
                const pastTrips = data.filter(d => d.status === 'Finalizado');
                setData(pastTrips);
                
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
        fetchData();
    }, []);

    return (
        <div className="App">
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <br/>
            <MaterialTable
                columns={columns}
                data={data}
                title="Buscar viajes"
                options={{
                  search: false,
                  actionsColumnIndex: -1,
                  exportButton: true,
                  exportAllData: true,
                  filtering: true,
                  exportMenu: [{
                    label: 'Exportar a PDF',
                    exportFunc: (cols, datas) => {
                        return ExportPdf(cols, datas, 'Historial de viajes')
                    }
                }]
              }}
                localization={materialTableConfiguration.localization}
            />

        </div>
    );
}

export default TripsReport;

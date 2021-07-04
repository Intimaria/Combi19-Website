import React, {useState, useEffect} from 'react';
import MaterialTable from '@material-table/core';
import {Message} from '../components/Message';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import moment from "moment";
import {ExportPdf} from '@material-table/exporters';

import {
    getTrips
} from '../api/Trips';


import {
    ERROR_MSG_API_GET_TRIPS

} from "../const/messages";

import ClearableDateRange from './ClearableDateRange';


const columns = [
    {title: 'Origen', field: 'route.departure'},
    {title: 'Destino', field: 'route.destination'},
    {
        title: 'Precio', field: 'report.price'
    },
    {
        title: 'Fecha de salida',
        type: 'date',
        field: 'report.departureDay',
        render: (data) => `${moment(data.departureDay).format('DD/MM/YYYY HH:mm')}hs`,
        filterComponent: (props) => <ClearableDateRange {...props} />,
        customFilterAndSearch: (term, data) => {
            let date = moment(data.departureDay);
            let start = moment(`${term[0]?.year}-${term[0]?.month.number}-${term[0]?.day} 00:00`).add(-1, 'minutes');
            let end = moment(`${term[1]?.year}-${term[1]?.month.number}-${term[1]?.day} 23:59`);
            return date.isBetween(start, end);
        }
    },
    {
        title: 'Fecha de llegada',
        type: 'date',
        field: 'report.arrivalDay',
        render: (data) => `${moment(data.arrivalDay).format('DD/MM/YYYY HH:mm')}hs`,
        filterComponent: (props) => <ClearableDateRange {...props} />,
        customFilterAndSearch: (term, data) => {
            let date = moment(data.arrivalDay);
            let start = moment(`${term[0]?.year}-${term[0]?.month.number}-${term[0]?.day}  00:00`).add(-1, 'minutes');
            let end = moment(`${term[1]?.year}-${term[1]?.month.number}-${term[1]?.day} 23:59`);
            return date.isBetween(start, end);
        }
    },
    {
        title: 'Combi',
        field: 'report.transport',
    },
    {title: 'Chofer', field: 'driver'}
];


function TripsReport() {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const [data, setData] = useState([]);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const fetchData = async () => {
        try {
            let getTripsResponse = await getTrips();

            if (getTripsResponse.status === 200) {
                let data = getTripsResponse.data;
                const finishedTrips = data.filter(d => d.status === 3);
                setData(finishedTrips);

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

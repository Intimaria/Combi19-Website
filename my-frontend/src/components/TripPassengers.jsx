import React, {useState, useEffect} from 'react';
import {Modal, TextField, Button} from '@material-ui/core';
import FormGroup from "@material-ui/core/FormGroup";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import MaterialTable from '@material-table/core';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import ListAltIcon from '@material-ui/icons/ListAlt';
import {useStyles} from '../const/componentStyles';
import {Message} from '../components/Message';

import {materialTableConfiguration} from '../const/materialTableConfiguration';

import {
    getPassengersByTrip,
    absentPassengersByTrip
} from '../api/TripPassengers';

import {
    confirmPassengerTrip,
    rejectPassengerTrip
} from "../api/PassengerTrips";

import {
    ERROR_MSG_API_GET_TRIP_PASSENGERS,
    ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET,
} from "../const/messages";


const columns = [
    {title: 'Nombre', field: 'passengerName'},
    {title: 'Apellido', field: 'passengerSurname'},
    {title: 'E-mail', field: 'passengerEmail'},
    {title: 'Estado', field: 'ticketStatus'},
];


export const TripPassengers = (props) => {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };
    const {trip} = props;

    const formatSelectedPassenger = {
        tripId: "",
        passengerId: "",
        passengerName: "",
        passengerSurname: "",
        passengerEmail: "",
        ticketId: "",
        ticketStatus: ""
    };

    const formatQuestionnaire = {
        temperature: false,
        respiratoryDistress: false,
        soreThroat: false,
        fever: false,
        tasteSmell: false
    };

    const styles = useStyles();
    const [data, setData] = useState([]);
    const [selectedPassenger, setSelectedPassenger] = useState(formatSelectedPassenger);
    const [checkSymptomsModal, setCheckSymptomsModal] = useState(false);
    // Questionnaire
    const [questionnaire, setQuestionnaire] = useState(formatQuestionnaire);
    const [riskyPassenger, setRiskyPassenger] = useState(false);
    const [questionnaireResultModal, setQuestionnaireResultModal] = useState(false);

    const [massiveUpdateModal, setMassiveUpdateModal] = useState(false);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const setDefaultValues = () => {
        setQuestionnaire(formatQuestionnaire);
        setSelectedPassenger(formatSelectedPassenger);
    };

    const fetchData = async () => {

        try {
            let getPassengerTripResponse = await getPassengersByTrip(trip.tripId);

            if (getPassengerTripResponse.status === 200) {
                let data = getPassengerTripResponse.data;

                setData(data);
            } else if (getPassengerTripResponse.status === 500) {
                setSuccessMessage(getPassengerTripResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: getPassengerTripResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_GET_TRIP_PASSENGERS} ${getPassengerTripResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_GET_TRIP_PASSENGERS} ${getPassengerTripResponse}`
                });
            }
        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_TRIP_PASSENGERS} ${error}`);
        }
    };

    const requestMassiveUpdate = async () => {
        const tripId = trip.tripId;

        let putResponse = await absentPassengersByTrip(tripId);

        handleMassiveUpdateModal();

        if (putResponse.status === 200) {
            setSuccessMessage(putResponse.data);
            setOptions({
                ...options, open: true, type: 'success',
                message: putResponse.data
            });

            await fetchData();
            return true
        } else if (putResponse.status === 500) {
            setSuccessMessage(putResponse.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: putResponse.data
            });

            return true
        } else {
            setSuccessMessage(`${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${putResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${putResponse}`
            });
        }
    };

    const handleCheckSymptomsModal = (passenger, action) => {
        setSelectedPassenger(passenger);

        setCheckSymptomsModal(!checkSymptomsModal);

        if (checkSymptomsModal) {
            setDefaultValues();
        }
    };

    const handleQuestionnaireResult = async (isRiskyPassenger) => {
        setQuestionnaireResultModal(!questionnaireResultModal);

        if (questionnaireResultModal) {
            setDefaultValues();
        } else {
            let putResponse;

            if (isRiskyPassenger) {
                putResponse = await rejectPassengerTrip(selectedPassenger.ticketId);
            } else {
                putResponse = await confirmPassengerTrip(selectedPassenger.ticketId);
            }

            if (putResponse.status === 200) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: (isRiskyPassenger) ? 'warning' : 'success',
                    message: putResponse.data
                });

                await fetchData();
                return true
            } else if (putResponse.status === 500) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: putResponse.data
                });

                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${putResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${putResponse}`
                });
            }
        }
    };

    const handleMassiveUpdateModal = () => {
        setMassiveUpdateModal(!massiveUpdateModal);
    };

    const verifyPassengerRisk = async () => {
        let isRiskyPassenger;

        if (questionnaire.temperature) {
            isRiskyPassenger = true;
            setRiskyPassenger(isRiskyPassenger);
        } else {
            let symptoms = 0;

            for (const property in questionnaire) {
                if (questionnaire[property]) {
                    symptoms++;
                }
            }

            if (symptoms >= 2) {
                isRiskyPassenger = true;
                setRiskyPassenger(isRiskyPassenger);
            } else {
                isRiskyPassenger = false;
                setRiskyPassenger(isRiskyPassenger);
            }

        }

        handleCheckSymptomsModal();
        await handleQuestionnaireResult(isRiskyPassenger);
    };

    const handleChange = (event) => {
        setQuestionnaire({...questionnaire, [event.target.name]: event.target.checked});
    };

    useEffect(() => {
        fetchData();
    }, []);

    const bodyQuestionnaireModal = (
        <div className={styles.modal}>
            <h3 align="center">VERIFICACIÓN DE SÍNTOMAS</h3>
            <FormGroup> 
                <Typography style={{fontWeight: 600}}>¿La temperatura del pasajero es mayor o igual a 38°C?</Typography>
                <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>No</Grid>
                        <Grid item>
                            <Switch checked={questionnaire.temperature} onChange={handleChange}
                                    name="temperature"
                                    id={"temperature"}
                                    color="primary"
                            />
                        </Grid>
                        <Grid item>Sí</Grid>
                    </Grid>
                </Typography>

                <Typography style={{fontWeight: 600}}>¿El pasajero tiene dificultad para respirar?</Typography>
                <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>No</Grid>
                        <Grid item>
                            <Switch checked={questionnaire.respiratoryDistress} onChange={handleChange}
                                    name="respiratoryDistress"
                                    id={"respiratoryDistress"}
                                    color="primary"
                            />
                        </Grid>
                        <Grid item>Sí</Grid>
                    </Grid>
                </Typography>

                <Typography style={{fontWeight: 600}}>¿El pasajero tiene dolor de garganta?</Typography>
                <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>No</Grid>
                        <Grid item>
                            <Switch checked={questionnaire.soreThroat} onChange={handleChange}
                                    name="soreThroat"
                                    id={"soreThroat"}
                                    color="primary"
                            />
                        </Grid>
                        <Grid item>Sí</Grid>
                    </Grid>
                </Typography>

                <Typography style={{fontWeight: 600}}>¿El pasajero tuvo fiebre la última semana?</Typography>
                <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>No</Grid>
                        <Grid item>
                            <Switch checked={questionnaire.fever} onChange={handleChange}
                                    name="fever"
                                    id={"fever"}
                                    color="primary"
                            />
                        </Grid>
                        <Grid item>Sí</Grid>
                    </Grid>
                </Typography>

                <Typography style={{fontWeight: 600}}>¿El pasajero tuvo pérdida de gusto y olfato en la última
                    semana?</Typography>
                <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>No</Grid>
                        <Grid item>
                            <Switch checked={questionnaire.tasteSmell} onChange={handleChange}
                                    name="tasteSmell"
                                    id={"tasteSmell"}
                                    color="primary"
                            />
                        </Grid>
                        <Grid item>Sí</Grid>
                    </Grid>
                </Typography>
            </FormGroup>
            <br/>
            <div align="right">
                <Button color="primary" onClick={() => verifyPassengerRisk()}>VERIFICAR RIESGO</Button>
                <Button onClick={() => handleCheckSymptomsModal()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyQuestionnaireResultModal = (
        <div className={riskyPassenger? styles.warning : styles.ok}>
            <h3 align="center">RESULTADO DE VERIFICACIÓN DE SÍNTOMAS</h3>
            {(riskyPassenger)
                ? <Typography>
                    El pasajero presenta síntomas compatibles a COVID-19, por lo cual no podrá realizar el
                    viaje, y tampoco podrá viajar durante los próximos 15 días. Asimismo no se le reintegrará el monto
                    del pasaje.</Typography>
                : <Typography>El pasajero NO presenta síntomas compatibles a COVID-19, por lo cual podrá realizar el
                    viaje.</Typography>
            }
            <br/>
            <div align="right">
                <Button color="primary" onClick={() => handleQuestionnaireResult()}>OK, ENTENDIDO</Button>
            </div>
        </div>
    );

    const bodyMassiveUpdate = (
        <div className={styles.modal}>
            <p>¿Estás seguro que desea establecer como AUSENTE a los pasajeros que están en estado PENDIENTE?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => requestMassiveUpdate()}>SÍ, AUSENTAR</Button>
                <Button onClick={() => handleMassiveUpdateModal()}>NO, CANCELAR</Button>

            </div>

        </div>
    );

    return (
        <div className="App">
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <br/>
            <Button style={{marginLeft: '8px'}}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnUpdateStatus"
                    startIcon={<TimerOffIcon/>}
                    onClick={() => handleMassiveUpdateModal()}>AUSENTAR MASIVAMENTE</Button>
            <br/><br/>
            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de pasajeros"
                actions={[
                    rowData => ({
                        icon: () => <ListAltIcon/>,
                        tooltip: (rowData.ticketStatus === 'Pendiente') ? 'Chequear síntomas' : 'Sólo se puede chequear síntomas si el estado es PENDIENTE',
                        disabled: rowData.ticketStatus !== "Pendiente",
                        onClick: (event, rowData) => handleCheckSymptomsModal(rowData, "Chequear síntomas")
                    }),
                ]}
                options={materialTableConfiguration.options}
                localization={materialTableConfiguration.localization}
            />

            <Modal
                open={massiveUpdateModal}
                onClose={handleMassiveUpdateModal}>
                {bodyMassiveUpdate}
            </Modal>

            <Modal
                open={checkSymptomsModal}
                onClose={handleCheckSymptomsModal}>
                {bodyQuestionnaireModal}
            </Modal>

            <Modal
                open={questionnaireResultModal}
                onClose={handleQuestionnaireResult}>
                {bodyQuestionnaireResultModal}
            </Modal>
        </div>
    );
};

export default TripPassengers;

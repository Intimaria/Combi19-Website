import React, {useState} from 'react'
import {CustomDatePicker} from '../components/CustomDatePicker';
import moment from "moment";
import {TextField, Button} from '@material-ui/core';
import {useStyles} from '../const/componentStyles';
import FormHelperText from '@material-ui/core/FormHelperText';
import HelpIcon from '@material-ui/icons/Help';
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import {Message} from './Message';

import {
    ERROR_MSG_EMPTY_EMAIL,
    ERROR_MSG_INVALID_EMAIL,
    ERROR_MSG_EMPTY_DATE,
    ERROR_MSG_INVALID_DATE,
    ERROR_MSG_INVALID_AGE
} from '../const/messages.js';

import {
    REGEX_EMAIL,
    REGEX_DATE_YYYY_MM_DD,
    REGEX_ONLY_NUMBER
} from "../const/regex.js";
import {validateAccountToSellTrip} from '../api/Drivers';
import {postPassengerTrip} from '../api/Drivers';


const DriverSellTrip = (props) => {
    //Configures any success or error messages for API functionality
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const styles = useStyles();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [birthday, setBirthday] = useState(moment()
        .subtract(18, "years")
        .set({hour: 0, minute: 0, second: 0, millisecond: 0})
        .format('YYYY-MM-DD')
    );
    const [birthdayError, setBirthdayError] = useState(null);
    const [ticketsQuantity, setTicketsQuantity] = useState('');
    const [ticketsQuantityError, setTicketsQuantityError] = useState(null);

    const [userInformation, setUserInformation] = useState(null);
    const [priceToPay, setPriceToPay] = useState(null);

    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const mySubmitEmailBirthdayHandler = async (event) => {
        event.preventDefault();

        if (validateEmail(email) & validateBirthday(birthday)) await validateAccount();

        return true;
    };

    const validateAccount = async () => {
        let postRequest = await validateAccountToSellTrip(email, birthday);
        if (postRequest?.status === 201 || postRequest?.status === 200) {
            setUserInformation(postRequest.data);
            let messageToShow;
            if (postRequest?.status === 201) {
                messageToShow = "El usuario se ha creado con exito";
            } else if (postRequest.data.isGold) {
                messageToShow = "El usuario ya existe en el sistema y posee beneficios GOLD";
            } else {
                messageToShow = "El usuario ya existe en el sistema";
            }

            setSuccessMessage(messageToShow);
            setOptions({
                ...options, open: true, type: 'success',
                message: messageToShow
            });
        } else if (postRequest?.status === 400) {
            setEmailError(postRequest.data.emailError);
            setBirthdayError(postRequest.data.birthdayError);
        } else if (postRequest?.status === 401 || postRequest?.status === 500) {
            setSuccessMessage(postRequest.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: postRequest.data
            });
        }
    };

    const handleEmail = (newValue) => {
        setEmail(newValue.target.value);
        setEmailError(null);
    };

    const handleBirthday = (newValue) => {
        if (!newValue) {
            setBirthday(null)
        } else {
            let formattedDate = newValue.format('YYYY-MM-DD');
            if (formattedDate === 'Fecha inválida') {
                setBirthday(newValue);
            } else {
                setBirthday(formattedDate);
            }
            setBirthdayError(null);
        }

        //setSuccessMessage(null);
    };

    const validateEmail = (email) => {
        if (!email) {
            setEmailError(ERROR_MSG_EMPTY_EMAIL);
            return false;
        }
        if (!REGEX_EMAIL.test(email)) {
            setEmailError(ERROR_MSG_INVALID_EMAIL);
            return false;
        }

        setEmailError(null);
        return true;
    };

    const validateBirthday = () => {
        function calculateAge() {
            let birthdayDate = new Date(birthday);
            let todayDate = new Date();

            let age = todayDate.getFullYear() - birthdayDate.getFullYear();
            let differenceOfMonths = todayDate.getMonth() - birthdayDate.getMonth();
            if (differenceOfMonths < 0 || (differenceOfMonths === 0 && (todayDate.getDate() < (birthdayDate.getDate() + 1))))
                age--;
            return age;
        }

        if (!birthday) {
            setBirthdayError(ERROR_MSG_EMPTY_DATE);
            return false;
        }

        if (!REGEX_DATE_YYYY_MM_DD.test(birthday)) {
            setBirthdayError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const parts = birthday.split("-");
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);

        if (year < (new Date().getFullYear() - 100) || year > (new Date().getFullYear()) || month === 0 || month > 12) {
            setBirthdayError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        if (!(day > 0 && day <= monthLength[month - 1])) {
            setBirthdayError(ERROR_MSG_INVALID_DATE);
            return false;
        }

        if (calculateAge() < 18) {
            setBirthdayError(ERROR_MSG_INVALID_AGE);
            return false;
        }
        setBirthdayError(null);
        return true;
    };

    const validateEmailAndBirthdayToSellTrips = (
        <div className="">
            <form onSubmit={mySubmitEmailBirthdayHandler}>
                <h2 align={'center'}> Ingrese datos de la cuenta </h2>
                <br/>
                <h5 align={'center'}> Ingrese correo electrónico </h5>
                <TextField className={styles.inputMaterial} label="Correo electrónico *" name="email"
                           id="email"
                           type={"email"}
                           inputProps={{maxLength: 70}}
                           autoComplete='off'
                           error={(emailError) ? true : false}
                           helperText={(emailError) ? emailError : false}
                           value={email}
                           onChange={newValue => handleEmail(newValue)}
                />

                <FormHelperText>
                    <HelpIcon color='primary' fontSize="small"/>
                    Se enviara la contraseña al email en caso de no tener una cuenta
                </FormHelperText>

                <br/>
                <h5 align={'center'}> Ingrese fecha de nacimiento </h5>
                <CustomDatePicker
                    underlineDisabled={false}
                    label={'Fecha de nacimiento *'}
                    handleDate={handleBirthday}
                    invalidDateMessage={birthdayError}
                    selectedDate={birthday}
                    futureDisabled={true}
                    pastDisabled={false}
                />
                <br/><br/>
                <Button style={{width: '100%'}}
                        variant="contained"
                        size="large"
                        color="primary"
                        id="btnRegister"
                        type="submit"
                        onClick={() => ""}
                >Buscar</Button>
            </form>
        </div>
    );

    const mySubmitSellTripHandler = async (event) => {
        event.preventDefault();

        if (validateTicketsQuantity(ticketsQuantity)) await sellTrip();

        return true;
    };

    const sellTrip = async () => {
        const cart = {
            products: [],
            tripId: props.trip.tripId,
            ticket: {
                quantity: ticketsQuantity,
                price: props.trip.numberPrice
            }
        };

        const postRequest = await postPassengerTrip(cart, null, userInformation.id, userInformation.isGold);

        if (postRequest.status === 200) {
            // setDefaultValues();
            setPriceToPay(userInformation.isGold ? (props.trip.numberPrice * ticketsQuantity) * 0.9 : props.trip.numberPrice * ticketsQuantity);

            return true
        } else if (postRequest.status === 500) {
            setSuccessMessage(postRequest.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: postRequest.data
            });
        }
    }

    const setDefaultValues = () => {
        setEmail('');
        setBirthday('');
        setTicketsQuantity('');
    }

    const validateTicketsQuantity = (ticketsQuantity) => {
        if (!ticketsQuantity) {
            setTicketsQuantityError('* Debe comprar al menos un pasaje');
            return false;
        } else if (!REGEX_ONLY_NUMBER.test(ticketsQuantity)) {
            setTicketsQuantityError('* Sólo se permite valores numéricos');
            return false;
        } else if (parseInt(ticketsQuantity) === 0) {
            setTicketsQuantityError('* Debe comprar al menos un pasaje');
            return false;
        } else if (parseInt(props.trip.availableSeatings) < parseInt(ticketsQuantity)) {
            setTicketsQuantityError('* Debe ser menor o igual a la cantidad de asientos disponibles');
            return false;
        } else {
            setTicketsQuantityError(null);
            return true;
        }
    };

    const handleTicketsQuantity = (newValue) => {
        setTicketsQuantity(newValue.target.value);
        setTicketsQuantityError(null);
    };

    const selectQuantityToBuy = (
        <div className="">
            <form onSubmit={mySubmitSellTripHandler}>
                <h2 align={'center'}> Ingrese cantidad de pasaje a comprar </h2>
                <br/>
                <Grid container>
                    <Grid item xs={12} style={{paddingRight: "50px"}}>
                        <Grid container>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial}
                                           label="Asientos disponibles *"
                                           name="availableSeating"
                                           id="availableSeating"
                                           disabled
                                           style={{paddingRight: "10px"}}
                                           value={props.trip.availableSeatings}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial}
                                           label="Precio unitario del pasaje *"
                                           name="ticketPrice"
                                           id="ticketPrice"
                                           disabled
                                           style={{paddingRight: "10px", marginLeft: "10px"}}
                                           value={`$ ${props.trip.numberPrice.replace('.', ',')}`}
                                />
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial} label="Cantidad de pasajes *"
                                           name="ticketsQuantity"
                                           id="ticketsQuantity"
                                           inputProps={{maxLength: 2}}
                                           autoComplete='off'
                                           error={(ticketsQuantityError) ? true : false}
                                           helperText={(ticketsQuantityError) ? ticketsQuantityError : false}
                                           value={ticketsQuantity}
                                           onChange={newValue => handleTicketsQuantity(newValue)}
                                />
                            </Grid>
                            <Grid container alignItems="flex-start" item xs={6}>
                                <Grid container alignItems={"flex-end"}
                                      item xs={12}>
                                    <Grid item xs={9}>
                                        <TextField className={styles.inputMaterial} label="Total pasajes *"
                                                   name="totalTickets"
                                                   id="totalTickets"
                                                   disabled
                                                   style={{marginLeft: '10px'}}
                                                   value={`$ ${(props.trip.numberPrice * ticketsQuantity).toFixed(2).replace('.', ',')}`}
                                        />
                                    </Grid>
                                    <Grid item xs={3} align={'right'}>
                                        <Tooltip
                                            title="Total = Cantidad pasajes * Precio del pasaje">
                                            <HelpIcon color='primary' fontSize="small"/>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <br/><br/>
                <Button style={{width: '100%'}}
                        variant="contained"
                        size="large"
                        color="primary"
                        id="btnRegister"
                        type="submit"
                        onClick={() => ""}
                >Confirmar</Button>
            </form>
        </div>
    );

    const tripSuccessfullySoldModal = (
        <div className="">
            <h3 align={'center'}> Se ha vendido el pasaje satisfactoriamente </h3>
            <h4 align={'center'}> El monto a pagar es: ${priceToPay} </h4>
        </div>
    );

    return (
        <div>
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            {!userInformation ? validateEmailAndBirthdayToSellTrips : null}
            {userInformation && !priceToPay ? selectQuantityToBuy : null}
            {priceToPay ? tripSuccessfullySoldModal : null}
        </div>
    )
};

export default DriverSellTrip

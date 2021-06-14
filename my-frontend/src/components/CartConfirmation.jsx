import React, {useEffect} from 'react';
import {Message} from '../components/Message';
import {TextField, Button} from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import moment from "moment";
import {useStyles} from '../const/componentStyles';
import {CardPaymentForm} from '../components/CardPaymentForm';

import {
    ERROR_MSG_EMPTY_TYPE_CARD,
    ERROR_MSG_EMPTY_CARD_NUMBER,
    ERROR_MSG_INVALID_CARD_NUMBER,
    ERROR_MSG_DEBIT_CARD,
    ERROR_MSG_DISABLED_CARD,
    ERROR_MSG_INSUFFICIENT_AMOUNT,
    ERROR_MSG_EMPTY_SECURITY_CODE,
    ERROR_MSG_INVALID_SECURITY_CODE,
    ERROR_MSG_WRONG_SECURITY_CODE,
    ERROR_MSG_EMPTY_EXPIRATION_DATE,
    ERROR_MSG_INVALID_EXPIRATION_DATE,
    ERROR_MSG_OVERDUE_EXPIRATION_DATE,
    ERROR_MSG_EMPTY_NAME_SURNAME_CARD_OWNER,
    ERROR_MSG_INVALID_NAME_SURNAME_CARD_OWNER,
    ERROR_MSG_EMPTY_DOCUMENT_NUMBER_CARD_OWNER,
    ERROR_MSG_INVALID_DOCUMENT_NUMBER_CARD_OWNER,
    ERROR_MSG_API_PUT_PASSENGER_TRIP
} from '../const/messages.js';


import {
    REGEX_DATE_MM_YY,
    REGEX_ONLY_ALPHABETICAL,
    REGEX_ONLY_NUMBER
} from '../const/regex';

import {postPassengerTrip} from "../api/CartConfirmation";
import {getCardsByUser} from "../api/Cards";


function CartConfirmation() {
    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const styles = useStyles();

    const [userData, setUserData] = React.useState('');
    const [userCart, setUserCart] = React.useState('');
    const [userCards, setUserCards] = React.useState([]);
    const [cardSelected, setCardSelected] = React.useState('');

    const [totalTickets, setTotalTickets] = React.useState(0);
    const [totalProducts, setTotalProducts] = React.useState(0);
    const [discountTickets, setDiscountTickets] = React.useState(0);
    const [totalCart, setTotalCart] = React.useState(0);

    const [typeCardSelected, setTypeCardSelected] = React.useState('');
    const [cardNumber, setCardNumber] = React.useState('');
    const [securityCode, setSecurityCode] = React.useState('');
    const [expirationDate, setExpirationDate] = React.useState(moment().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    }));
    const [nameSurnameCardOwner, setNameSurnameCardOwner] = React.useState('');
    const [documentNumberCardOwner, setDocumentNumberCardOwner] = React.useState('');

    const [typeCardSelectedError, setTypeCardSelectedError] = React.useState(null);
    const [cardNumberError, setCardNumberError] = React.useState(null);
    const [securityCodeError, setSecurityCodeError] = React.useState(null);
    const [expirationDateError, setExpirationDateError] = React.useState(null);
    const [nameSurnameCardOwnerError, setNameSurnameCardOwnerError] = React.useState(null);
    const [documentNumberCardOwnerError, setDocumentNumberCardOwnerError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const requestPutPassengerTrip = async (event) => {
        //event.preventDefault();

        if (validateForm()) {
            let putResponse = await postPassengerTrip(userCart, cardSelected.cardId, userData.userId);

            if (putResponse.status === 200) {
                setDefaultValues();

                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: putResponse.data
                });

                return true
            } else if (putResponse.status === 500) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: putResponse.data
                });

                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_PUT_PASSENGER_TRIP} ${putResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_PASSENGER_TRIP} ${putResponse}`
                });
            }
        }
    };

    const setDefaultValues = () => {
        setTypeCardSelected('');
        setCardNumber('');
        setSecurityCode('');
        setExpirationDate(moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}));
        setNameSurnameCardOwner('');
        setDocumentNumberCardOwner('');
    };

    const handleTypeCard = (newValue) => {
        setTypeCardSelected(newValue.target.value);
        setSuccessMessage(null);
        setTypeCardSelectedError(false);
    };

    const handleCardNumber = (newValue) => {
        setCardNumber(newValue.target.value);
        setSuccessMessage(null);
        setCardNumberError(null);
    };

    const handleSecurityCode = (newValue) => {
        setSecurityCode(newValue.target.value);
        setSuccessMessage(null);
        setSecurityCodeError(null);
    };

    const handleExpirationDate = (newValue) => {
        if (!newValue) {
            setExpirationDate(null)
        } else {
            setExpirationDate(newValue);
            setExpirationDateError(null);
        }

        setSuccessMessage(null);
    };

    const handleNameSurnameCardOwner = (newValue) => {
        setNameSurnameCardOwner(newValue.target.value);
        setSuccessMessage(null);
        setNameSurnameCardOwnerError(null);
    };

    const handleDocumentNumberCardOwner = (newValue) => {
        setDocumentNumberCardOwner(newValue.target.value);
        setSuccessMessage(null);
        setDocumentNumberCardOwnerError(null);
    };

    const validateForm = () => {
        return validateCard();
    };

    const validateCard = () => {
        let resultValidateTypeCard = true,
            resultValidateCardNumber = true,
            resultValidateSecurityCode = true,
            resultValidateExpirationDate = true,
            resultValidateNameSurnameCardOwner = true,
            resultValidateDocumentNumberCardOwner = true;

        if (!typeCardSelected || typeCardSelected === 0) {
            setTypeCardSelectedError(ERROR_MSG_EMPTY_TYPE_CARD);
            resultValidateTypeCard = false;
        }

        if (!cardNumber) {
            setCardNumberError(ERROR_MSG_EMPTY_CARD_NUMBER);
            resultValidateCardNumber = false;
        }

        if (!securityCode) {
            setSecurityCodeError(ERROR_MSG_EMPTY_SECURITY_CODE);
            resultValidateSecurityCode = false;
        }

        if (!expirationDate) {
            setExpirationDateError(ERROR_MSG_EMPTY_EXPIRATION_DATE);
            resultValidateExpirationDate = false;
        }

        if (!nameSurnameCardOwner) {
            setNameSurnameCardOwnerError(ERROR_MSG_EMPTY_NAME_SURNAME_CARD_OWNER);
            resultValidateNameSurnameCardOwner = false;
        }

        if (!documentNumberCardOwner) {
            setDocumentNumberCardOwnerError(ERROR_MSG_EMPTY_DOCUMENT_NUMBER_CARD_OWNER);
            resultValidateDocumentNumberCardOwner = false;
        }

        if (resultValidateTypeCard & resultValidateCardNumber & resultValidateSecurityCode & resultValidateExpirationDate & resultValidateNameSurnameCardOwner & resultValidateDocumentNumberCardOwner) {
            return validateTypeCard() & validateCardNumber() & validateSecurityCode() & validateExpirationDate() & validateNameSurnameCardOwner() & validateDocumentNumberCardOwner() & validateBankConnection();
        } else {
            return false;
        }
    };

    const validateTypeCard = () => {
        setTypeCardSelectedError(null);
        return true;
    };

    const validateCardNumber = () => {
        if (!REGEX_ONLY_NUMBER.test(cardNumber)) {
            setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
            return false;
        }

        if (cardNumber.length < 15) {
            setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
            return false;
        }

        if (typeCardSelected === 1) {
            if (cardNumber.length !== 15) {
                setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
                return false;
            }
            if (securityCode.length !== 4) {
                setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
                return false;
            }
        }

        if (typeCardSelected === 2 || typeCardSelected === 3) {
            if (cardNumber.length !== 16) {
                setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
                return false;
            }
            if (securityCode.length !== 3) {
                setCardNumberError(ERROR_MSG_INVALID_CARD_NUMBER);
                return false;
            }
        }

        if (cardNumber === '1111111111111111') {
            setCardNumberError(ERROR_MSG_DEBIT_CARD);
            return false;
        }

        if (cardNumber === '2222222222222222') {
            setCardNumberError(ERROR_MSG_DISABLED_CARD);
            return false;
        }

        if (cardNumber === '3333333333333333') {
            setCardNumberError(ERROR_MSG_INSUFFICIENT_AMOUNT);
            return false;
        }

        setCardNumberError(null);
        return true;

    };

    const validateSecurityCode = () => {
        if (!REGEX_ONLY_NUMBER.test(securityCode)) {
            setSecurityCodeError(ERROR_MSG_INVALID_SECURITY_CODE);
            return false;
        }

        if (cardNumber === '4444444444444444') {
            setSecurityCodeError(ERROR_MSG_WRONG_SECURITY_CODE);
            return false;
        }

        setSecurityCodeError(null);
        return true;
    };

    const validateExpirationDate = () => {
        if (!REGEX_DATE_MM_YY.test(expirationDate.format('MM/YY'))) {
            setExpirationDateError(ERROR_MSG_INVALID_EXPIRATION_DATE);
            return false;
        }

        if (expirationDate.set({hour: 0, minute: 0, second: 0, millisecond: 0}) < moment().set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        })) {
            setExpirationDateError(ERROR_MSG_OVERDUE_EXPIRATION_DATE);
            return false;
        }

        setExpirationDateError(null);
        return true;
    };

    const validateNameSurnameCardOwner = () => {
        if (!REGEX_ONLY_ALPHABETICAL.test(nameSurnameCardOwner)) {
            setNameSurnameCardOwnerError(ERROR_MSG_INVALID_NAME_SURNAME_CARD_OWNER);
            return false;
        }

        if (cardNumber === '5555555555555555') {
            setNameSurnameCardOwnerError(ERROR_MSG_INVALID_NAME_SURNAME_CARD_OWNER);
            return false;
        }

        setNameSurnameCardOwnerError(null);
        return true;
    };

    const validateDocumentNumberCardOwner = () => {
        if (!REGEX_ONLY_NUMBER.test(documentNumberCardOwner)) {
            setDocumentNumberCardOwnerError(ERROR_MSG_INVALID_DOCUMENT_NUMBER_CARD_OWNER);
            return false;
        }

        if (cardNumber === '6666666666666666') {
            setDocumentNumberCardOwnerError(ERROR_MSG_INVALID_DOCUMENT_NUMBER_CARD_OWNER);
            return false;
        }

        setDocumentNumberCardOwnerError(null);
        return true;
    };

    const validateBankConnection = () => {
        if (cardNumber === '7777777777777777') {
            setSuccessMessage(`Ocurrió un error al verificar el pago. Intente nuevamente.`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `Ocurrió un error al verificar el pago. Intente nuevamente.`
            });
            return false;
        }

        return true;
    };

    useEffect(() => {
        const fetchData = async () => {
            const userDataStorage = JSON.parse(localStorage.getItem('userData'));
            setUserData(userDataStorage);

            const userId = userDataStorage.userId;

            // Cart con viaje, cantidad de pasajes, y productos
            const userCartStorage = JSON.parse(localStorage.getItem('userCart'));

            setUserCart(userCartStorage);

            const resultTotalTickets = userCartStorage.ticket.quantity * userCartStorage.ticket.price;

            setTotalTickets(`${resultTotalTickets.toFixed(2).replace('.', ',')}`);

            let resultTotalProducts = 0;

            for (let product of userCartStorage.products) {
                resultTotalProducts += (product.quantity * product.price);
            }

            setTotalProducts(resultTotalProducts);

            let resultDiscountTickets = 0;

            if (userDataStorage.goldMembershipExpiration && moment() <= moment(userDataStorage.goldMembershipExpiration)) {
                resultDiscountTickets = ((resultTotalTickets + resultTotalProducts) * 0.1).toFixed(2);
                setDiscountTickets(resultDiscountTickets)
            }

            const resultTotalCart = resultTotalTickets * resultTotalProducts;

            setTotalCart(resultTotalCart);

            setTotalCart(resultTotalTickets + resultTotalProducts - resultDiscountTickets);

            const requestUserCards = await getCardsByUser(userId);

            console.log('requestUserCards es:', requestUserCards)

            if (requestUserCards.data.length > 0) {
                setUserCards(requestUserCards);

                const lastCard = requestUserCards.data[requestUserCards.data.length - 1];

                setCardSelected(lastCard);

                setTypeCardSelected(lastCard.cardNetworkId);
                setCardNumber(lastCard.number);
                setExpirationDate(
                    moment().set({
                        year: `20${lastCard.expirationDate.substr(3, 2)}`,
                        month: lastCard.expirationDate.substr(0, 2),
                        hour: 0,
                        minute: 0,
                        second: 0,
                        millisecond: 0
                    })
                );

                setNameSurnameCardOwner(lastCard.nameSurname);
                setDocumentNumberCardOwner(lastCard.ownerDocumentNumber);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.root}>
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <div className={styles.form}>
                <h2 align={'center'}>Confirmación de compra</h2>
                <div className="row ">
                    <div>
                        <Grid container>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial} label="Total pasajes *"
                                           name="totalTickets"
                                           id="subtotalTickets"
                                           disabled
                                           style={{paddingRight: '10px'}}
                                           value={`$ ${totalTickets}`}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial} label="Total productos *"
                                           name="totalProducts"
                                           id="totalProducts"
                                           disabled
                                           style={{paddingRight: '10px', marginLeft: '10px'}}
                                           value={`$ ${totalProducts.toFixed(2).replace('.', ',')}`}
                                />
                            </Grid>

                        </Grid>

                        <Grid container>
                            <Grid item xs={6}>
                                <TextField className={styles.inputMaterial} label="Descuento gold *"
                                           name="discountTickets"
                                           id="discountTickets"
                                           disabled
                                           style={{paddingRight: '10px'}}
                                           value={`$ ${discountTickets}`}
                                />
                            </Grid>
                            <Grid container alignItems="flex-start" item xs={6}>
                                <Grid container alignItems={"flex-end"}
                                      item xs={12}>
                                    <Grid item xs={9}>
                                        <TextField className={styles.inputMaterial} label="Total de la compra *"
                                                   name="total"
                                                   id="total"
                                                   disabled
                                                   style={{marginLeft: '10px'}}
                                                   value={`$ ${totalCart.toFixed(2).replace('.', ',')}`}
                                        />
                                    </Grid>
                                    <Grid item xs={3} align={'right'}>
                                        <Tooltip
                                            title="Total = Total pasajes + Total productos - Descuento gold">
                                            <HelpIcon color='primary' fontSize="small"/>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <CardPaymentForm
                                goldCheck={true}

                                typeCardSelected={typeCardSelected}
                                cardNumber={cardNumber}
                                securityCode={securityCode}
                                expirationDate={expirationDate}
                                nameSurnameCardOwner={nameSurnameCardOwner}
                                documentNumberCardOwner={documentNumberCardOwner}

                                handleTypeCard={handleTypeCard}
                                handleCardNumber={handleCardNumber}
                                handleSecurityCode={handleSecurityCode}
                                handleExpirationDate={handleExpirationDate}
                                handleNameSurnameCardOwner={handleNameSurnameCardOwner}
                                handleDocumentNumberCardOwner={handleDocumentNumberCardOwner}

                                typeCardSelectedError={typeCardSelectedError}
                                cardNumberError={cardNumberError}
                                securityCodeError={securityCodeError}
                                expirationDateError={expirationDateError}
                                nameSurnameCardOwnerError={nameSurnameCardOwnerError}
                                documentNumberCardOwnerError={documentNumberCardOwnerError}
                            />


                            <Grid item xs={12}>
                                <br/><br/>
                                <Button style={{width: '100%'}}
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        id="btnRegister"
                                        onClick={() => requestPutPassengerTrip()}
                                >CONFIRMAR COMPRA</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <br/>
                                <Button style={{width: '100%'}}
                                        variant="contained"
                                        size="large"
                                        color="secondary"
                                        id="btnCancel"
                                    //onClick={volver atrás}
                                >CANCELAR COMPRA</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <br/>
                                <Button style={{width: '100%'}}
                                        variant="contained"
                                        size="large"
                                        color="secondary"
                                        id="btnBack"
                                    //onClick={volver atrás}
                                >VOLVER</Button>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
            <br/><br/>
        </div>
    );
}

export default CartConfirmation

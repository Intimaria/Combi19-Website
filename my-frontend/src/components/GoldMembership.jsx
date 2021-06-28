import React, {useState} from 'react';
import {Message} from '../components/Message';
import {TextField, Button, Modal} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InfoIcon from '@material-ui/icons/Info';
import Grid from "@material-ui/core/Grid";
import moment from "moment";

import {
    postGoldMembership,
    putGoldMembership
} from '../api/Passengers';

import {useStyles} from '../const/componentStyles';
import {
    ERROR_MSG_API_PUT_GOLD_MEMBERSHIP, ERROR_MSG_API_PUT_PASSENGER_TRIP,
    ERROR_MSG_DEBIT_CARD,
    ERROR_MSG_DISABLED_CARD,
    ERROR_MSG_EMPTY_CARD_NUMBER,
    ERROR_MSG_EMPTY_DOCUMENT_NUMBER_CARD_OWNER,
    ERROR_MSG_EMPTY_EXPIRATION_DATE,
    ERROR_MSG_EMPTY_NAME_SURNAME_CARD_OWNER,
    ERROR_MSG_EMPTY_SECURITY_CODE,
    ERROR_MSG_EMPTY_TYPE_CARD,
    ERROR_MSG_INSUFFICIENT_AMOUNT, ERROR_MSG_INVALID_BANK_CONNECTION,
    ERROR_MSG_INVALID_CARD_NUMBER,
    ERROR_MSG_INVALID_DOCUMENT_NUMBER_CARD_OWNER,
    ERROR_MSG_INVALID_EXPIRATION_DATE,
    ERROR_MSG_INVALID_NAME_SURNAME_CARD_OWNER,
    ERROR_MSG_INVALID_SECURITY_CODE,
    ERROR_MSG_OVERDUE_EXPIRATION_DATE,
    ERROR_MSG_WRONG_SECURITY_CODE
} from "../const/messages";
import {CardPaymentForm} from "./CardPaymentForm";
import {REGEX_DATE_MM_YY, REGEX_ONLY_ALPHABETICAL, REGEX_ONLY_NUMBER} from "../const/regex";


function GoldMembership() {
    let userData = JSON.parse(localStorage.getItem('userData'));

    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const styles = useStyles();
    const [expirationGoldMembershipDate, setExpirationGoldMembershipDate] = React.useState(
        (userData.goldMembershipExpiration)
            ? `${moment(userData.goldMembershipExpiration).format('DD/MM/YYYY HH:mm')}hs`
            : 'Membresía GOLD no vigente'
    );
    const [automaticRenewal, setAutomaticRenewal] = React.useState(userData.automaticDebit);

    const [newGoldMembershipModal, setNewGoldMembershipModal] = useState(false);

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

    const setDefaultValues = () => {
        setTypeCardSelected('');
        setCardNumber('');
        setSecurityCode('');
        setExpirationDate(moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}));
        setNameSurnameCardOwner('');
        setDocumentNumberCardOwner('');
    };

    const handleAutomaticRenewal = (newValue) => {
        setAutomaticRenewal(newValue.target.value);
        setSuccessMessage(null);
    };

    const handleNewGoldMembershipModal = () => {
        setNewGoldMembershipModal(!newGoldMembershipModal);

        if(!newGoldMembershipModal) {
            setDefaultValues();
        }
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
            date: 1,
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
            setSuccessMessage(ERROR_MSG_INVALID_BANK_CONNECTION);
            setOptions({
                ...options, open: true, type: 'error',
                message: ERROR_MSG_INVALID_BANK_CONNECTION
            });
            return false;
        }

        return true;
    };

    const requestPutGoldMembership = async () => {
        let putResponse = await putGoldMembership(userData.userId, automaticRenewal);

        if (putResponse.status === 200) {
            userData.automaticDebit = automaticRenewal;

            localStorage.setItem('userData', JSON.stringify(userData));

            setSuccessMessage(putResponse.data);
            setOptions({
                ...options, open: true, type: 'success',
                message: putResponse.data
            });
        } else if (putResponse.status === 500) {
            setSuccessMessage(putResponse.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: putResponse.data
            });
        } else {
            setSuccessMessage(`${ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} ${putResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} ${putResponse}`
            });
        }

    };

    const requestPostNewGoldMembership = async () => {
        if (validateForm()) {
            let putResponse = await postGoldMembership(userData.userId, typeCardSelected, cardNumber, expirationDate, nameSurnameCardOwner, documentNumberCardOwner);

            if (putResponse.status === 201) {
                setDefaultValues();

                userData.automaticDebit = 1;
                userData.goldMembershipExpiration = moment();

                setAutomaticRenewal(1);
                setExpirationGoldMembershipDate(`${moment(userData.goldMembershipExpiration).format('DD/MM/YYYY HH:mm')}hs`);

                localStorage.setItem('userData', JSON.stringify(userData));

                handleNewGoldMembershipModal();

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

    const bodyNewGoldMembership = (
        <div className={styles.modal}>
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
                            onClick={() => requestPostNewGoldMembership()}
                    >CONFIRMAR COMPRA</Button>
                </Grid>
                <Grid item xs={12}>
                    <br/>
                    <Button style={{width: '100%'}}
                            variant="contained"
                            size="large"
                            color="secondary"
                            id="btnCancel"
                            onClick={() => handleNewGoldMembershipModal()}
                    >CANCELAR</Button>
                </Grid>
            </Grid>
        </div>
    );

    return (
        <div className={styles.root}>

            <div className={styles.form} encType="multipart/form-data">
                <h2 align={'center'}>Membresía GOLD</h2>
                <div className="row ">
                    {
                        successMessage ?
                            <Message open={options.open} type={options.type} message={options.message}
                                     handleClose={options.handleClose}/>
                            : null
                    }
                    <div>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField className={styles.inputMaterial}
                                           label="Fecha de expiración *"
                                           name="inpExpirationGoldMembershipDate"
                                           id="inpExpirationGoldMembershipDate"
                                           value={expirationGoldMembershipDate}
                                />
                            </Grid>
                            {
                                (userData.goldMembershipExpiration) ?
                                    <FormControl className={styles.inputMaterial}
                                                 required>
                                        <InputLabel>Renovación automática de membresía</InputLabel>
                                        <Select label="Renovación automática de membresía"
                                                labelId="automaticRenewal"
                                                id="automaticRenewal"
                                                name="automaticRenewal"
                                                className={styles.inputMaterial}
                                                value={automaticRenewal}
                                                onChange={newValue => handleAutomaticRenewal(newValue)}
                                                displayEmpty
                                        >
                                            <MenuItem key={1} value={1}> Sí, deseo renovar la membresía </MenuItem>
                                            <MenuItem key={0} value={0}> No deseo renovar la membresía </MenuItem>
                                        </Select>
                                        <FormHelperText>
                                            <InfoIcon color='primary' fontSize="small"/>
                                            {` Al no solicitar la renovación, podrá seguir haciendo uso de la membresía
                                    hasta su fecha de expiración: ${expirationGoldMembershipDate}, luego
                                    dejará de tener acceso a sus beneficios`}
                                        </FormHelperText>
                                    </FormControl>
                                    : null
                            }
                            <Grid item xs={12}>
                                <br/><br/>
                                {
                                    (userData.goldMembershipExpiration) ?
                                        <Button style={{width: '100%'}}
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                id="btnConfirm"
                                                name="btnConfirm"
                                                onClick={() => requestPutGoldMembership()}
                                        >CONFIRMAR CAMBIOS</Button>
                                        :
                                        <Button style={{width: '100%'}}
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                id="btnRequestGoldMembership"
                                                name="btnRequestGoldMembership"
                                            onClick={() => handleNewGoldMembershipModal()}
                                        >SOLICITAR MEMBRESÍA GOLD</Button>
                                }
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
            <br/><br/>

            <Modal
                open={newGoldMembershipModal}
                onClose={handleNewGoldMembershipModal}>
                {bodyNewGoldMembership}
            </Modal>
        </div>
    );
}

export default GoldMembership

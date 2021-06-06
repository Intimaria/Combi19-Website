import React, {Fragment} from "react";
import {useStyles} from "../const/componentStyles";
import Grid from "@material-ui/core/Grid";
import {TextField} from "@material-ui/core";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import moment from "moment";

import {
    ERROR_MSG_INVALID_AGE,
    ERROR_MSG_INVALID_EXPIRATION_DATE,
    ERROR_MSG_OVERDUE_EXPIRATION_DATE
} from "../const/messages";

export const CardPaymentForm = (props) => {
    const styles = useStyles();

    const expirationDateConfiguration = {
        name: "expirationDate",
        label: "Vencimiento",
        invalidDateMessage: ERROR_MSG_INVALID_EXPIRATION_DATE,
        minDate: moment(),
        minDateMessage: ERROR_MSG_OVERDUE_EXPIRATION_DATE,
        maxDateMessage: ERROR_MSG_INVALID_AGE
    };

    return (
        <Fragment>
            <Grid item xs={6}>
                <FormControl className={styles.inputMaterial}
                             style={{paddingRight: '10px'}}
                             error={(props.typeCardSelectedError) ? true : false}>
                    <InputLabel>Tipo de tarjeta *</InputLabel>
                    <Select label="Tipo de tarjeta *" id="typeCardSelected"
                            labelId={"typeCardSelected"}
                            name="typeCardSelected"
                            className={styles.selectEmpty}
                            value={props.typeCardSelected}
                            displayEmpty
                            onChange={newValue => props.handleTypeCard(newValue)}
                    >
                        <MenuItem value={0} disabled> Seleccione un tipo de
                            tarjeta </MenuItem>
                        <MenuItem key={1} value={1}> American Express </MenuItem>
                        <MenuItem key={2} value={2}> MasterCard </MenuItem>
                        <MenuItem key={3} value={3}> Visa </MenuItem>
                    </Select>
                    <FormHelperText>{(props.typeCardSelectedError) ? props.typeCardSelectedError : false}</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <TextField className={styles.inputMaterial}
                           label="Número de tarjeta *"
                           name="cardNumber"
                           id="cardNumber"
                           inputProps={{maxLength: 16}}
                           style={{paddingRight: '10px', marginLeft: '10px'}}
                           autoComplete='off'
                           error={(props.cardNumberError) ? true : false}
                           helperText={(props.cardNumberError) ? props.cardNumberError : false}
                           value={props.cardNumber}
                           onChange={newValue => props.handleCardNumber(newValue)}
                />
            </Grid>

            <Grid container alignItems="flex-start" item xs={6}>
                <Grid container alignItems={(props.securityCodeError) ? "center" : "flex-end"}
                      item xs={12}>
                    <Grid item xs={9}>
                        <TextField className={styles.inputMaterial} label="CCV *"
                                   name="securityCode"
                                   id="securityCode"
                                   inputProps={{maxLength: 4}}
                                   autoComplete='off'
                                   error={(props.securityCodeError) ? true : false}
                                   helperText={(props.securityCodeError) ? props.securityCodeError : false}
                                   value={props.securityCode}
                                   onChange={newValue => props.handleSecurityCode(newValue)}
                        />
                    </Grid>
                    <Grid item xs={3} align={'center'}>
                        <Tooltip
                            title="Código de seguridad ubicado en el dorso de la tarjeta">
                            <HelpIcon color='primary' fontSize="small"/>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={6}>
                <MuiPickersUtilsProvider
                    libInstance={moment}
                    utils={MomentUtils}
                    locale={"es"}
                >
                    <KeyboardDatePicker
                        className={styles.inputMaterial}
                        style={{
                            paddingRight: '10px',
                            marginLeft: '10px',
                            marginTop: '-1px',
                            marginBottom: '-1px'
                        }}
                        //disablePast
                        disableToolbar
                        cancelLabel="CANCELAR"
                        okLabel="CONFIRMAR"
                        format="MM/YY"
                        margin="normal"
                        views={["year", "month"]}
                        autoComplete='off'
                        id={expirationDateConfiguration.name}
                        name={expirationDateConfiguration.name}
                        label={expirationDateConfiguration.label}
                        invalidDateMessage={expirationDateConfiguration.invalidDateMessage}
                        minDate={expirationDateConfiguration.minDate}
                        minDateMessage={expirationDateConfiguration.minDateMessage}
                        value={(props.goldCheck) ? props.expirationDate : ''}
                        onChange={newValue => props.handleExpirationDate(newValue)}
                        error={(props.expirationDateError) ? true : false}
                        helperText={(props.expirationDateError) ? props.expirationDateError : false}
                    />
                </MuiPickersUtilsProvider>
            </Grid>


            <Grid container alignItems={(props.nameSurnameCardOwnerError) ? "center" : "flex-end"}
                  item xs={12}>
                <Grid item xs={11}>
                    <TextField className={styles.inputMaterial} label="Titular *"
                               name="nameSurnameCardOwner"
                               id="nameSurnameCardOwner"
                               inputProps={{
                                   maxLength: 20,
                                   style: {textTransform: 'uppercase'}
                               }}
                               autoComplete='off'
                               error={(props.nameSurnameCardOwnerError) ? true : false}
                               helperText={(props.nameSurnameCardOwnerError) ? props.nameSurnameCardOwnerError : false}
                               value={props.nameSurnameCardOwner}
                               onChange={newValue => props.handleNameSurnameCardOwner(newValue)}
                    />
                </Grid>
                <Grid item xs={1} align={'right'}>
                    <Tooltip
                        title="Nombre completo ubicado en el frente de la tarjeta">
                        <HelpIcon color='primary' fontSize="small"/>
                    </Tooltip>
                </Grid>
            </Grid>


            <Grid container
                  alignItems={(props.documentNumberCardOwnerError) ? "center" : "flex-end"} item
                  xs={12}>
                <Grid item xs={11}>
                    <TextField className={styles.inputMaterial} label="Documento *"
                               name="documentNumberCardOwner"
                               id="documentNumberCardOwner"
                               inputProps={{maxLength: 10}}
                               style={{paddingRight: '10px'}}
                               autoComplete='off'
                               error={(props.documentNumberCardOwnerError) ? true : false}
                               helperText={(props.documentNumberCardOwnerError) ? props.documentNumberCardOwnerError : false}
                               value={props.documentNumberCardOwner}
                               onChange={newValue => props.handleDocumentNumberCardOwner(newValue)}
                    />
                </Grid>
                <Grid item xs={1} align={'right'}>
                    <Tooltip
                        title="Número de documento de la persona titular de la tarjeta">
                        <HelpIcon color='primary' fontSize="small"/>
                    </Tooltip>
                </Grid>
            </Grid>
        </Fragment>
    );
};

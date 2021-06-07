//import "date-fns";
import React from "react";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";
import {ERROR_MSG_INVALID_AGE} from "../const/messages";
import {useStyles} from "../const/componentStyles";

export const CustomDatePicker = (props) => {
    const styles = useStyles();

    const defaultOptions = {
        name: "birthday",
        label: "Fecha",
        invalidDateMessage: "* La fecha ingresada es inválida",
        minDate: moment()
            .subtract(150, "years")
            .set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        minDateMessage: "* La fecha ingresada es inválida",
        maxDate: moment()
            .subtract(18, "years")
            .set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        maxDateMessage: ERROR_MSG_INVALID_AGE
    };
    return (
        <MuiPickersUtilsProvider
            libInstance={moment}
            utils={MomentUtils}
            locale={"es"}
        >
            <KeyboardDatePicker
                InputProps={{disableUnderline: props.underlineDisabled}}
                className={props.className || styles.inputMaterial}
                style={ props.styles || {marginTop: '-1px', marginBottom: '-1px'}}
                //required
                disableFuture={props.futureDisabled}
                disablePast={props.pastDisabled}
                disableToolbar
                cancelLabel="CANCELAR"
                okLabel="CONFIRMAR"
                format="DD/MM/yyyy"
                margin="normal"
                id={props.name || defaultOptions.name}
                name={props.name || defaultOptions.name}
                label={props.label || defaultOptions.label}
                invalidDateMessage={props.invalidDateMessage || defaultOptions.invalidDateMessage}
                minDate={props.minDate || defaultOptions.minDate}
                minDateMessage={props.minDateMessage || defaultOptions.minDateMessage}
                maxDate={props.maxDate || defaultOptions.maxDate}
                maxDateMessage={props.maxDateMessage || defaultOptions.maxDateMessage}
                value={props.selectedDate}
                onChange={(event) => props.handleDate(event)}
                error={(props.invalidDateMessage) ? true : false}
                helperText={(props.invalidDateMessage) ? props.invalidDateMessage : false}
                KeyboardButtonProps={{
                    "aria-label": "Calendario"
                }}
            />
        </MuiPickersUtilsProvider>
    );
};

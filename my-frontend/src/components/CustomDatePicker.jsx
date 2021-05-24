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
import {useStyles} from "../const/modalStyle";

export const CustomDatePicker = (options) => {
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

    const [defaultDate, setDefaultDate] = React.useState(options.maxDate || defaultOptions.maxDate);
    const [selectedDate, setSelectedDate] = React.useState(false);

    /*
    const handleDateChange = (date) => {
        console.log('la fecha es:', date)
        setSelectedDate(date);
    };
    */

    console.log('options es:', options);

    return (
        <MuiPickersUtilsProvider
            libInstance={moment}
            utils={MomentUtils}
            locale={"es"}
        >
            <KeyboardDatePicker
                className={styles.inputMaterial}
                required
                disableFuture
                disableToolbar
                variant="inline"
                format="DD/MM/yyyy"
                margin="normal"
                id={options.name || defaultOptions.name}
                name={options.name || defaultOptions.name}
                label={options.label || defaultOptions.label}
                invalidDateMessage={options.invalidDateMessage || defaultOptions.invalidDateMessage}
                minDate={options.minDate || defaultOptions.minDate}
                minDateMessage={options.minDateMessage || defaultOptions.minDateMessage}
                maxDate={options.maxDate || defaultOptions.maxDate}
                maxDateMessage={options.maxDateMessage || defaultOptions.maxDateMessage}
                value={selectedDate ? selectedDate : defaultDate}
                onChange={(event) => options.handleDate(event)}
                error={(options.invalidDateMessage) ? true : false}
                helperText={(options.invalidDateMessage) ? options.invalidDateMessage : false}
                KeyboardButtonProps={{
                    "aria-label": "Calendario"
                }}
            />
        </MuiPickersUtilsProvider>
    );
};

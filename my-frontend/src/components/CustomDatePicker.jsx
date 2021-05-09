/*
import "date-fns";
import React from "react";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";
import {Fade} from "@material-ui/core";
import ERROR_MSG_INVALID_AGE from "../const/messages";

export const CustomDatePicker = (options) => {

    const defaultOptions = {
        minDate: moment()
            .subtract(150, "years")
            .set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        maxDate: moment()
            .subtract(18, "years")
            .set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        name: "birthday"
    };

    const minDate = options.minDate || defaultOptions.minDate;
    const maxDate = options.maxDate || defaultOptions.maxDate;
    const name = options.name || defaultOptions.name;
    const id = id;

    const [selectedDate, setSelectedDate] = React.useState(maxDate);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <MuiPickersUtilsProvider
            libInstance={moment}
            utils={MomentUtils}
            locale={"es"}
        >
            <KeyboardDatePicker
                required
                disableFuture
                disableToolbar
                variant="inline"
                format="DD/MM/yyyy"
                margin="normal"
                id={id}
                name={name}
                label="Fecha de nacimiento"
                invalidDateMessage="* La fecha ingresada es inválida"
                maxDateMessage="* Debe ser mayor a 18 años"
                minDateMessage="* La fecha ingresada es inválida"
                minDate={minDate}
                maxDate={maxDate}
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    "aria-label": "Calendario"
                }}
            />
        </MuiPickersUtilsProvider>
    );
};
*/

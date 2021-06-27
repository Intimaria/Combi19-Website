import React, {forwardRef, useState} from "react"
import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker"
import {InputAdornment, IconButton } from "@material-ui/core";
import EventIcon from '@material-ui/icons/Event';
import DatePanel from "react-multi-date-picker/plugins/date_panel"

export default function DateRange(props) {
  const [dates, setDates] = useState([])
  const [allDates, setAllDates] = useState([])
  React.useEffect(() =>{
      if (dates == null) {
        setDates([])
        setAllDates([])
      }
  })
  return (
    <DatePicker
      position="left-start"
      label="Seleccionar rango"
      inputVariant="outlined"
      variant="inline"
      format="DD/MM/YYYY"
      value={dates}
      minDate={new DateObject().subtract(2, "years")}
      maxDate={new DateObject().add(99, "years")}
      ampm
      animation
      scrollSensitive={false}
      placeholder={'Fechas'}
      autoOk
      range
      allowKeyboardControl
      style={{ maxWidth: 150, minHeight: 30 }}
      onChange={(event) => {
          setDates(event)
          setAllDates(getAllDatesInRange(event))
          props.onFilterChanged(props.columnDef.tableData.id, event);
      }}
      plugins={[
        <DatePanel />
      ]}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <EventIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

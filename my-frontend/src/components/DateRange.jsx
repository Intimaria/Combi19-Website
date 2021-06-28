import React, {forwardRef, useState} from "react"
import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker"
import {InputAdornment, IconButton } from "@material-ui/core";
import EventIcon from '@material-ui/icons/Event';
import DatePanel from "react-multi-date-picker/plugins/date_panel"

export default function DateRange(props) {
  const [dates, setDates] = useState([])
  const [allDates, setAllDates] = useState([])
 
  function CustomRangeInput({openCalendar, stringDates}) {
    let from = stringDates[0] || ""
    let to = stringDates[1] || ""
    let value = from && to ? from + "-" + to : from
    
    return (
      <input
      style={{
        height: "35px",
        maxWidth: "160px",
        borderRadius: "5px",
        fontSize: "14px",
        padding: "5px 5px",
        }}
        onFocus={openCalendar}
        value={value}
        readOnly
      />
    )
  }

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
      type="custom"
      render={<CustomRangeInput />}
      allowKeyboardControl
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

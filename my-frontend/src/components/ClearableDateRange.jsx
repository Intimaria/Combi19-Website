import React from 'react';
import DateRange from "./DateRange"
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

export default function ClearableDateRange(props) {

  function BtnWrapper() {
    props.onFilterChanged(props.columnDef.tableData.id, null); // (event, newValue)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end'
      }}
    >
      <div style={{flexGrow: '1'}}>
        <DateRange
          {...props}
        />
      </div>
      <div>
        <IconButton onClick={BtnWrapper} size="small" aria-label="clear">
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
}
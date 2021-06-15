import {
  CANCELLATION_INFORMATION,
  OK_MESSAGE_CANCELLATION_0,
  OK_MESSAGE_CANCELLATION_100,
  OK_MESSAGE_CANCELLATION_50
} from '../const/messages'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import React from 'react';
import {
  cancelPassengerTrip,
} from '../api/PassengerTrips';
import moment from "moment";

export const CancelTrip = (props) => {
  const [open, setOpen] = React.useState(false);
  const [cancel, setCancel] = React.useState(false);
  const [selectedTrip, setSelectedTrip] = React.useState(props.trip);
  const [verificando, setVerificando] = React.useState(false)

  const [dialogueText, setDialogueText] = React.useState(CANCELLATION_INFORMATION)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const apiCancel = async () => {
    const cancellation = await cancelPassengerTrip(selectedTrip.ticketId);
    return cancellation.data
  }
  const handleCancel = async() => {
    setVerificando(true)
    const ok = validateCancellationDate(props.trip);
    if (ok.cancelado){
        let cancelled = await apiCancel()
        let n = selectedTrip.price.replace(".","")
        let number =n.split(",")
        let newNumber = number[0]+"."+number[1]
        let finalPrice = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits:2 }).format(ok.diferencia * parseFloat(newNumber));      
        let prod = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits:2 }).format(cancelled); 
        if (ok.diferencia === 1 ) {
          setDialogueText(OK_MESSAGE_CANCELLATION_100 + finalPrice + " costo de productos: " + prod )
        } else if (ok.diferencia === 0.5) {
          setDialogueText(OK_MESSAGE_CANCELLATION_50 + finalPrice +  " costo de productos: " + prod )
        } 
    }else {
      setDialogueText(OK_MESSAGE_CANCELLATION_0) 
    }

  }
  
  const handleDeny = e => {setCancel(false); handleClose()};
  const handleAgree= e =>  {setCancel(true)};

  React.useEffect(() => {
    if (props.onChange) {
      props.onChange(cancel)
    }
  }, [cancel])

  React.useEffect(() => {
    if (props.onChange) {
      props.onChange(cancel)
    }
  }, [cancel])

  React.useEffect(() => {
    if (cancel) {
      handleCancel()
    }
  }, [cancel])

  const validateCancellationDate =() => {
    let d = selectedTrip.departureDay.slice(0, 2)
    let m = selectedTrip.departureDay.slice(3, 5)
    let y = selectedTrip.departureDay.slice(6, 10)
    let t = selectedTrip.departureDay.slice(11, 16)

    let departureDate = moment(y+"/"+m+"/"+d+" "+t) 
    
    let result = {
        diferencia: 1,
        cancelado: true
    }
        let diff = moment(departureDate).diff(moment(), 'minutes')
        // 48 hours is 2880 minutes
        if (diff > 2880) {
          return result
        } else if (diff > 0 ) {
          return {
            ...result,
            diferencia: 0.5,
            }
        } else {
          return {
            diferencia: 0,
            cancelado: false
            }
        }
}


  return (
    <div>
      <Fab variant="extended" color="primary" onClick={handleClickOpen}>
        Cancelar Viaje
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        { !verificando &&
        <DialogTitle id="alert-dialog-title">{`¿Estás seguro que deseas cancelar este viaje?`}</DialogTitle>
        }
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              {dialogueText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
         { !verificando &&
          <Button onClick={handleDeny} color="secondary" autoFocus>
              No estoy de acuerdo. Salir.
           </Button>
          }
        { !verificando && 
          <Button onClick={handleAgree} color="primary">
            Estoy de acuerdo, deseo cancelar este viaje.
          </Button>
          }
        { verificando &&
          <Button onClick={handleDeny} color="primary" autoFocus>
            Cerrar.
           </Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

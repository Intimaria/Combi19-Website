import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import React from 'react';

export const CancelTrip = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  

  return (
    <div>
      <Fab variant="contained" color="primary" onClick={handleClickOpen}>
        Cancelar Viaje
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`¿Estás seguro que deseas cancelar este viaje?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Le recordamos que las condiciones de cancelación de viaje forman parte del contrato 
            al momento de la compra del mismo. Haciendo la cancelación con más de 48hs de antelación,
            recibíra el 100% de reembolso del costo del mismo. 
            Si hace la cancelación con menos de 48hs de antelación, pero anterior al mismo,
            recibíra el 50% de reembolso del costo. 
            Fuera de este periodo, no es posible la cancelación. Si usted por cualquier motivo, 
            no puede presentarse en el momento del viaje, no hay reembolso del costo del viaje.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" autoFocus>
              No estoy de acuerdo. Salir.
           </Button>
          <Button onClick={handleClose} color="primary">
            Estoy de acuerdo, deseo cancelar este viaje.
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

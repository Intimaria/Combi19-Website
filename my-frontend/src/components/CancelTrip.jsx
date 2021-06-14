import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Cancelar Viaje
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`¿Estás seguro que deseas cancelar este viaje?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Le recordamos las condiciones de cancelacion de viaje adheridas al momento de compra,
            la cancelació con más de 48hs de antelación tiene el 100% de reembolso del costo del mismo. 
            La cancelación con menos de 48hs de antelación recibíra el 50% de reembolso del costo, 
            y fuera de este tiempo no es posible la cancelación. Si usted por cualquier motivo, 
            no puede presentarse en el momento del viaje, y no ha cancelado con antelación, no hay reembolso.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" autoFocus>
              No estoy de acuerdo. Salir.
           </Button>
          <Button onClick={handleClose} color="primary">
            Estoy de acuerdo, deseo cancelar.
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

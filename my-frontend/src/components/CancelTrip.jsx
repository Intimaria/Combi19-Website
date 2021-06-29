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

    // Used to open and close the user dialogue 
    const [open, setOpen] = React.useState(false);

    // If set as "true" it means the user has selected "Cancel ticket"
    const [cancel, setCancel] = React.useState(false);

    // Sets the trip that the user has selected, this is sent by father component 
    const [selectedTrip, setSelectedTrip] = React.useState(props.trip);

    // Hacky solve to change dialogue buttons, may be a better way to do this 
    const [verificando, setVerificando] = React.useState(false);

    // This sets the text for the dialogue 
    const [dialogueText, setDialogueText] = React.useState(CANCELLATION_INFORMATION);

    // Closes the dialogue when the user chooses not to cancel a ticket
    const handleDeny = e => {
        setCancel(false);
        handleClose()
    };
    const handleClose = () => {
        setOpen(false);
    };

    // Opens the dialogue when a user clicks the "Cancel ticket" button
    const handleClickOpen = () => {
        setOpen(true);
    };

    /* This functions sets the state for the dialogue text when cancellation has finished
       there could be a better alternative to this but currently the component doesn't 
       refresh automatically. Fixes some prior bugs with dialogue rendering */
    const handleFinish = () => {
        setOpen(false);
        setDialogueText(`Usted ha cancelado este viaje. Refresque la pagina para verlo
                        en el sector de viajes dados de baja`)
    }

    // Start the cancellation process by setting the "cancel" boolean to true
    const handleAgree = e => {
        setCancel(true)
    };
    
    /* When FAB is pressed, onClick() will send information back to the father component
   This is called only when "Cancel" variable changes state 
   */
   React.useEffect(() => {
    if (cancel && props.onClick) {
        const ok = validateCancellationDate(props.trip);
        setVerificando(true);
        if (ok){
            handleCancel(ok)
        } 
        props.onClick(cancel, ok, props.trip)
    }
   }, [cancel]);
 
    /* Validates if a ticket can be cancelled due to a date and also how much 
        refund they are are entitled to depending on when they cancel.
        Returns an obj w percentaje & boolean indicating if it can be cancelled.
    */
    const validateCancellationDate = () => {
        // Horrible magic to save a formatted date to a moment type
        let d = selectedTrip.departureDay.slice(0, 2);
        let m = selectedTrip.departureDay.slice(3, 5);
        let y = selectedTrip.departureDay.slice(6, 10);
        let t = selectedTrip.departureDay.slice(11, 16);
        let departureDate = moment(y + "/" + m + "/" + d + " " + t);
        // Sets default values for the returned object
        let result = {
            diferencia: 1,
            cancelado: true
        };
        let diff = moment(departureDate).diff(moment(), 'minutes');
        // 48 hours is 2880 minutes
        if (diff > 2880) {
            return result
        } else if (diff > 0) {
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
    };

    // API: Changes ticket status, sets refund percentage. Returns any product value if last ticket.
    const apiCancel = async ({diferencia}) => {
        let num = diferencia * 100;
        console.log("diff:", diferencia)
        const cancellation = await cancelPassengerTrip(selectedTrip.ticketId, num);
        return cancellation.data;
    };

    /* API: This function will call the API function to cancel the ticket 
    and set the dialogue text for the user */
    const handleCancel = async (ok) => {
        // const ok = validateCancellationDate(props.trip);
        if (ok.cancelado) {
            let cancelledProds = await apiCancel(ok);
            let ticketPrice = selectedTrip.price.replace(".", "");
            let number = ticketPrice.split(",");
            let newNumber = number[0] + "." + number[1];

            let finalPrice = new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 2
            }).format(ok.diferencia * parseFloat(newNumber));

            let prod = new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 2
            }).format(cancelledProds);
            setVerificando(true);
            if (ok.diferencia === 1) {
                setDialogueText(OK_MESSAGE_CANCELLATION_100 + finalPrice + " costo de productos: " + prod);
            } else if (ok.diferencia === 0.5) {
                setDialogueText(OK_MESSAGE_CANCELLATION_50 + finalPrice + " costo de productos: " + prod);
            }
        } else {
            setDialogueText(OK_MESSAGE_CANCELLATION_0)
        }
    };


/*
    // Called when "Cancel" changes state, if Cancel is "true", handleCancel() function is called
    React.useEffect(() => {
        if (cancel) {
            handleCancel()
        }
    }, [cancel]);



 */



     /* JSX COMPONENTS & FORMATTING */
     // Shows Floating Action Button for cancelling a pending passenger trip & sets dialogue accordingly
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
                {!verificando &&
                <DialogTitle id="alert-dialog-title">{`¿Estás seguro que deseas cancelar este viaje?`}</DialogTitle>
                }
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogueText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!verificando &&
                    <Button onClick={handleDeny} color="secondary" autoFocus>
                        No estoy de acuerdo. Salir.
                    </Button>
                    }
                    {!verificando &&
                    <Button onClick={handleAgree} color="primary">
                        Estoy de acuerdo, deseo cancelar este viaje.
                    </Button>
                    }
                    {verificando &&
                    <Button onClick={handleFinish} color="primary" autoFocus>
                        Cerrar.
                    </Button>
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
};

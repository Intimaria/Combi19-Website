import React from 'react';

import { Fade, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

export const Message = (options) => {

    const defaultOptions = {
        open: false,
        type: 'success',
        message: '',
        transition: Fade,
        duration: 5000,
        position: {
            vertical: 'top',
            horizontal: 'right'
        }
    };

    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        options.handleClose();
    }

    return (
        <Snackbar open={options.open}
                  autoHideDuration={options.duration || defaultOptions.duration}
                  TransitionComponent={defaultOptions.transition}
                  onClose={handleClose}
                  anchorOrigin={options.position || defaultOptions.position}
                  key={defaultOptions.transition.name}
        >
            <Alert severity={options.type || defaultOptions.type} onClose={handleClose} id="alertMessageId">
                {options.message}
            </Alert>
        </Snackbar>
    );
};

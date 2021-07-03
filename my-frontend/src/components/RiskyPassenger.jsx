import React from 'react'
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Box from '@material-ui/core/Box'
import moment from 'moment';

function RiskyPassenger (props) {

    return (
            <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="20vh">
            <Alert severity="error">
            <AlertTitle>Alerta:</AlertTitle>
              Usted ha demostrado posible riesgo de COVID-19. 
              Tiene inhabilitada la compra de pasajes hasta {moment(props.covidRisk).format('DD/MM/YYYY')}
            </Alert>
            </Box>
    )
}
export default RiskyPassenger;
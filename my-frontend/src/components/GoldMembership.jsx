import React from 'react';
import {Message} from '../components/Message';
import {TextField, Button} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InfoIcon from '@material-ui/icons/Info';
import Grid from "@material-ui/core/Grid";
import moment from "moment";

import {
    putGoldMembership
} from '../api/Passengers';

import {useStyles} from '../const/componentStyles';
import {ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} from "../const/messages";


function GoldMembership() {
    let userData = JSON.parse(localStorage.getItem('userData'));

    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const styles = useStyles();
    const [expirationDate, setExpirationDate] = React.useState(
        (userData.goldMembershipExpiration)
            ? `${moment(userData.goldMembershipExpiration).format('DD/MM/YYYY HH:mm')}hs`
            : 'Membresía GOLD no vigente'
    );
    const [automaticRenewal, setAutomaticRenewal] = React.useState(userData.automaticDebit);

    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});


    const handleAutomaticRenewal = (newValue) => {
        setAutomaticRenewal(newValue.target.value);
        setSuccessMessage(null);
    };

    const requestPutGoldMembership = async () => {
        let putResponse = await putGoldMembership(userData.userId, automaticRenewal);

        if (putResponse.status === 200) {
            userData.automaticDebit = automaticRenewal;

            localStorage.setItem('userData', JSON.stringify(userData));

            setSuccessMessage(putResponse.data);
            setOptions({
                ...options, open: true, type: 'success',
                message: putResponse.data
            });
        } else if (putResponse.status === 500) {
            setSuccessMessage(putResponse.data);
            setOptions({
                ...options, open: true, type: 'error',
                message: putResponse.data
            });
        } else {
            setSuccessMessage(`${ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} ${putResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} ${putResponse}`
            });
        }

    };

    return (
        <div className={styles.root}>

            <div className={styles.form} encType="multipart/form-data">
                <h2 align={'center'}>Membresía GOLD</h2>
                <div className="row ">
                    {
                        successMessage ?
                            <Message open={options.open} type={options.type} message={options.message}
                                     handleClose={options.handleClose}/>
                            : null
                    }
                    <div>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField className={styles.inputMaterial}
                                           label="Fecha de expiración *"
                                           name="inpExpirationDate"
                                           id="inpExpirationDate"
                                           value={expirationDate}
                                />
                            </Grid>
                            {
                                (userData.goldMembershipExpiration) ?
                                    <FormControl className={styles.inputMaterial}
                                                 required>
                                        <InputLabel>Renovación automática de membresía</InputLabel>
                                        <Select label="Renovación automática de membresía"
                                                labelId="automaticRenewal"
                                                id="automaticRenewal"
                                                name="automaticRenewal"
                                                className={styles.inputMaterial}
                                                value={automaticRenewal}
                                                onChange={newValue => handleAutomaticRenewal(newValue)}
                                                displayEmpty
                                        >
                                            <MenuItem key={1} value={1}> Sí, deseo renovar la membresía </MenuItem>
                                            <MenuItem key={0} value={0}> No deseo renovar la membresía </MenuItem>
                                        </Select>
                                        <FormHelperText>
                                            <InfoIcon color='primary' fontSize="small"/>
                                            {` Al no solicitar la renovación, podrá seguir haciendo uso de la membresía
                                    hasta su fecha de expiración: ${expirationDate}, luego
                                    dejará de tener acceso a sus beneficios`}
                                        </FormHelperText>
                                    </FormControl>
                                    : null
                            }
                            <Grid item xs={12}>
                                <br/><br/>
                                {
                                    (userData.goldMembershipExpiration) ?
                                        <Button style={{width: '100%'}}
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                id="btnConfirm"
                                                name="btnConfirm"
                                                onClick={() => requestPutGoldMembership()}
                                        >CONFIRMAR CAMBIOS</Button>
                                        :
                                        <Button style={{width: '100%'}}
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                id="btnRequestGoldMembership"
                                                name="btnRequestGoldMembership"
                                            //onClick={() => requestNewGoldMembership()}
                                        >SOLICITAR MEMBRESÍA GOLD</Button>
                                }
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
            <br/><br/>
        </div>
    );
}

export default GoldMembership

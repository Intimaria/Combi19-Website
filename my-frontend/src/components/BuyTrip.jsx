import React, {useEffect} from 'react'
import {useHistory} from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {Button, TextField} from "@material-ui/core";
import moment from "moment";
import {Ticket} from '../components/Ticket';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';
import {useStyles} from '../const/componentStyles';
import PaymentIcon from '@material-ui/icons/Payment';

const BuyTrip = () => {
    const styles = useStyles();

    const history = useHistory();
    // Get selected trip id
    const tripToBuy = JSON.parse(localStorage.getItem("tripToBuy"));
    const userData = JSON.parse(localStorage.getItem("userData"));

    const [totalTickets, setTotalTickets] = React.useState(0);
    const [totalProducts, setTotalProducts] = React.useState(0);
    const [discountTickets, setDiscountTickets] = React.useState(0);

    const [ticketToBuy, setTicketToBuy] = React.useState('1');
    const [ticketToBuyError, setTicketToBuyError] = React.useState('');

    // Verify that the user is not risky
    const verifyExpirationRisk = () => {
        const expirationRisk = JSON.parse(localStorage.getItem('userData')).expirationRisk;
        if (expirationRisk && moment(expirationRisk).isAfter(moment())) {
            history.push("/tripsResults");
        }
    };
    // Redirect in case a trip has not been selected
    const verifyTrip = () => {
        if (!tripToBuy) {
            history.push("/tripsResults");
        }
    };

    const handleTicketToBuy = (newValue) => {
        setTicketToBuy(newValue.target.value);
        setTicketToBuyError(null);
    };

    useEffect(() => {
        verifyTrip();
        verifyExpirationRisk();
    }, []);

    return (
        <div>
            <Ticket tripToBuy={tripToBuy}/>
            <Card style={{width: "90%", alignItems: "center", margin: '50px'}}>
                <CardContent>
                    <Grid container>
                        <Grid item xs={6} style={{paddingRight: "50px"}}>

                            <Typography align="center" variant="h6" style={{paddingBottom: '10px'}}>
                                Información de la compra de pasajes
                            </Typography>

                            <Grid container>
                                <Grid item xs={6}>
                                    <TextField className={styles.inputMaterial}
                                               label="Asientos disponibles *"
                                               name="availableSeating"
                                               id="availableSeating"
                                               disabled
                                               style={{paddingRight: "10px"}}
                                               value={tripToBuy.availableSeatings}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField className={styles.inputMaterial}
                                               label="Precio unitario del pasaje *"
                                               name="ticketPrice"
                                               id="ticketPrice"
                                               disabled
                                               style={{paddingRight: "10px", marginLeft: "10px"}}
                                               value={`$ ${tripToBuy.price.replace('.', ',')}`}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container>
                                <Grid item xs={6}>
                                    <TextField className={styles.inputMaterial}
                                               label="Pasajes a comprar *"
                                               name="ticketToBuy"
                                               id="ticketToBuy"
                                               autoFocus={true}
                                               inputProps={{maxLength: 2}}
                                               autoComplete='off'
                                               error={(ticketToBuyError) ? true : false}
                                               helperText={(ticketToBuyError) ? ticketToBuyError : false}
                                               style={{paddingRight: "10px"}}
                                               defaultValue={'1'}
                                               value={ticketToBuy}
                                               onChange={newValue => handleTicketToBuy(newValue)}
                                    />
                                </Grid>
                                <Grid container alignItems="flex-start" item xs={6}>
                                    <Grid container alignItems={"flex-end"}
                                          item xs={12}>
                                        <Grid item xs={9}>
                                            <TextField className={styles.inputMaterial} label="Total pasajes *"
                                                       name="totalTickets"
                                                       id="totalTickets"
                                                       disabled
                                                       style={{marginLeft: '10px'}}
                                                       value=
                                                           {(moment() < moment(userData.goldMembershipExpiration))
                                                               ? `$ ${(tripToBuy.price * ticketToBuy * 0.9).toFixed(2).replace('.', ',')}`
                                                               : `$ ${(tripToBuy.price * ticketToBuy).toFixed(2).replace('.', ',')}`
                                                           }
                                            />
                                        </Grid>
                                        <Grid item xs={3} align={'right'}>
                                            <Tooltip
                                                title="Total = Cantidad pasajes * Precio del pasaje - Descuento gold">
                                                <HelpIcon color='primary' fontSize="small"/>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={6} style={{paddingLeft: "50px"}}>

                            <Typography align="center" variant="h6" style={{paddingBottom: '10px'}}>
                                Información de la compra de productos
                            </Typography>

                            <Grid container>
                                <Grid item xs={6}>
                                    <TextField className={styles.inputMaterial}
                                               label="Cantidad de productos a comprar *"
                                               name="productsSelected"
                                               id="productsSelected"
                                               disabled
                                               style={{paddingRight: "10px"}}
                                               value={'10'}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField className={styles.inputMaterial}
                                               label="Precio total de los productos *"
                                               name="ticketPrice"
                                               id="ticketPrice"
                                               disabled
                                               style={{paddingRight: "10px", marginLeft: "10px"}}
                                               value={`$ 4214,15`}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                </CardContent>
            </Card>

            <Button style={{marginLeft: '50px', width: '90%'}}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnConfirmCart"
                    startIcon={<PaymentIcon/>}
                    onClick={() => console.log('hola')}>CONFIRMAR COMPRA</Button>
        </div>
    )
};

export default BuyTrip

import React, {useEffect, useState} from 'react'
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
import MaterialTable from '@material-table/core';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import {Message} from "./Message";

import {
    REGEX_ONLY_NUMBER
} from "../const/regex";
import {getAvailableProducts} from "../api/Products";
import {ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE} from "../const/messages";

const columns = [
    {title: 'Nombre', field: 'name', editable: "never"},
    {
        title: 'Precio',
        render: (data) => `${(data.price).replace('.', ',')}`,
        customFilterAndSearch: (term, data) => (`${data.price.replace('.', ',')}`).indexOf(term.toLowerCase()) !== -1,
        editable: "never"
    },
    {title: 'Tipo', field: 'typeProductDescription', editable: "never",},
    {
        title: 'Cantidad a comprar (máximo 99 por producto)',
        field: 'quantitySelected',
        render: (rowData) => (
            <TextField
                multiline
                size="small"
                variant="outlined"
                value={rowData.quantitySelected}
                rowsMax={4}
            />
        )
    },
];

const BuyTrip = () => {
    const styles = useStyles();

    const handleCloseMessage = () => {
        setOptions({...options, open: false});
    };

    const history = useHistory();
    // Get selected trip id
    const tripToBuy = JSON.parse(localStorage.getItem("tripToBuy"));
    const userData = JSON.parse(localStorage.getItem("userData"));

    const [ticketToBuy, setTicketToBuy] = React.useState('1');
    const [ticketToBuyError, setTicketToBuyError] = React.useState('');

    const [quantityProducts, setQuantityProducts] = React.useState(0);
    const [totalProducts, setTotalProducts] = React.useState(0);

    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

    const [data, setData] = useState([]);

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

        if (!newValue.target.value) {
            setTicketToBuyError('* Debe comprar al menos un pasaje');
        } else if (!REGEX_ONLY_NUMBER.test(newValue.target.value)) {
            setTicketToBuyError('* Sólo se permite valores numéricos');
        } else if (parseInt(newValue.target.value) === 0) {
            setTicketToBuyError('* Debe comprar al menos un pasaje');
        } else if (parseInt(tripToBuy.availableSeatings) < parseInt(newValue.target.value)) {
            setTicketToBuyError('* Debe ser menor o igual a la cantidad de asientos disponibles');
        } else {
            setTicketToBuyError(null);
        }


    };

    const fetchData = async () => {
        try {
            let getProductsResponse = await getAvailableProducts();

            if (getProductsResponse?.status === 200) {
                let data = getProductsResponse.data;

                for (let product of data) {
                    product['quantitySelected'] = 0;
                }

                console.log('data es:');
                console.log(data);

                setData(data);
            } else {
                setSuccessMessage(`${ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE} ${getProductsResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE} ${getProductsResponse}`
                });
            }
        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE} ${error}`);
        }
    };

    const updateQuantity = (newValue, index) => {
        let newData = [...data];

        if (!newValue) {
            newData[index].quantitySelected = 0;
        } else if (!REGEX_ONLY_NUMBER.test(newValue)) {
            newData[index].quantitySelected = newData[index].quantitySelected;
        } else if (newValue > 99) {
            newData[index].quantitySelected = 99;
        } else {
            newData[index].quantitySelected = newValue;
        }

        setData(newData);

        let quantityProducts = 0, totalProducts = 0;

        for (let product of newData) {
            let quantitySelected = parseInt(product.quantitySelected);
            let price = parseFloat(product.price);

            quantityProducts += quantitySelected;
            totalProducts += (quantitySelected * price);
        }

        totalProducts = totalProducts.toFixed(2).replace('.', ',');

        setQuantityProducts(quantityProducts);
        setTotalProducts(totalProducts);
    };

    const buyCart = async () => {
        if (ticketToBuyError) {
            setSuccessMessage('Verifique la cantidad de pasajes');
            setOptions({
                ...options, open: true, type: 'error',
                message: 'Verifique la cantidad de pasajes'
            });
        } else {
            let productsSelected = [];

            for (let product of data) {
                let quantitySelected = parseInt(product.quantitySelected);
                let price = parseFloat(product.price);

                if (quantitySelected !== 0) {
                    productsSelected.push(
                        {
                            productId: product.idProduct,
                            quantity: product.quantitySelected,
                            price: price
                        }
                    );
                }

            }

            let userCart = {
                tripId: tripToBuy.tripId,
                ticket: {
                    quantity: ticketToBuy,
                    price: tripToBuy.price
                },
                products: productsSelected
            };

            localStorage.setItem("userCart", JSON.stringify(userCart));
            /*if (!localStorage.getItem('userData')) {
                props.setRedirectPage("/cartConfirmation");
                history.push("/login");
                props.setRedirectBoolean(true);
            }
            else {
                history.push("/cartConfirmation");
            }*/
            history.push("/cartConfirmation");
        }
    };

    useEffect(() => {
        fetchData();
        verifyTrip();
        verifyExpirationRisk();
    }, []);

    return (
        <div>
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                             handleClose={options.handleClose}/>
                    : null
            }
            <Ticket tripToBuy={tripToBuy}/>
            <Card style={{width: "90%", alignItems: "center", margin: '25px 50px 25px 50px'}}>
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
                                                       value={`$ ${(tripToBuy.price * ticketToBuy).toFixed(2).replace('.', ',')}`}
                                            />
                                        </Grid>
                                        <Grid item xs={3} align={'right'}>
                                            <Tooltip
                                                title="Total = Cantidad pasajes * Precio del pasaje">
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
                                               name="quantityProducts"
                                               id="quantityProducts"
                                               disabled
                                               style={{paddingRight: "10px"}}
                                               value={quantityProducts}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField className={styles.inputMaterial}
                                               label="Precio total de los productos *"
                                               name="totalProducts"
                                               id="totalProducts"
                                               disabled
                                               style={{paddingRight: "10px", marginLeft: "10px"}}
                                               value={totalProducts}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {(moment() < moment(userData.goldMembershipExpiration))
                                        ?
                                        <Typography align="center" style={{padding: '20px 0px 0px 0px'}}>
                                            El descuento gold se aplicará en el paso siguente
                                        </Typography>
                                        : ``
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                </CardContent>
            </Card>

            <Button style={{margin: '0px 50px 25px 50px', width: '90%'}}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnConfirmCart"
                    startIcon={<PaymentIcon/>}
                    onClick={() => buyCart()}>REALIZAR
                PAGO</Button>

            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de productos"
                options={materialTableConfiguration.options}
                localization={materialTableConfiguration.localization}
                cellEditable={{
                    onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                        return new Promise((resolve, reject) => {
                            updateQuantity(newValue, rowData.tableData.id);
                            setTimeout(resolve, 1000);
                        });
                    }
                }}
            />
        </div>
    )
};

export default BuyTrip

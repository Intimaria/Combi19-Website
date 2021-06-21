import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import SearchTripsModal from "../components/SearchTripsModal";
import MaterialTable from '@material-table/core';
import { makeStyles } from "@material-ui/core";
// La configuracion en castellano
import { materialTableConfiguration } from '../const/materialTableConfiguration';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Message } from './Message';
import moment from "moment";
const columns = [
    { title: 'Origen', field: 'departure' },
    { title: 'Destino', field: 'destination' },
    {
        title: 'Fecha de salida',
        render: (data) => `${moment(data.departureDay).format('DD/MM/YYYY HH:mm')}hs`,
        customFilterAndSearch: (term, data) => (`${moment(data.departureDay).format('DD/MM/YYYY HH:mm')}hs`).indexOf(term.toLowerCase()) !== -1
    },
    { title: 'Combi', field: 'registrationNumber' },
    { 
    title: 'Precio',
    render: (data) => `$${(data.price).replace('.', ',')}`,
    customFilterAndSearch: (term, data) => (`$${data.price.replace('.', ',')}`).indexOf(term.toLowerCase()) !== -1
    },
    { title: 'Asientos disponibles', field: 'availableSeatings' },
];

const modalSearchStyles = makeStyles((theme) => ({
    modal: {
        margin: 'auto',
        float: "center",
        maxWidth: "80%",
        backgroundColor: "rgba(153,217,234)",
        backdropFilter: "blur(40)px",
        boxShadow: "10px 10px 10px rgba(30,30,30,.1)",
        borderRadius: 10,
        padding: theme.spacing(2, 1, 3, 4)
    },
    inputMaterial: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        paddingTop: '2px',
        paddingLeft: '10px',
        borderRadius: 10,
    },
    div: {
        float: "left",
        width: "30%",
        marginRight: "3.3%"
    },
    button: {
        width: '30%', 
        marginTop: "3px",
        margin: "auto"
    }
}));

const TripsResults = (props) => {
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    const [canBuy, setCanBuy] = React.useState(true);
    let riskMessage = null;

    const history = useHistory();
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    // Verify that the user is not risky if is logged in

    const verifyExpirationRisk = () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            const expirationRisk = userData.expirationRisk;
            if (expirationRisk && moment(expirationRisk).isAfter(moment())) {
                setCanBuy(false);
                setSuccessMessage(`Usted figura como persona riesgosa, no tiene permitido comprar hasta: ${moment(expirationRisk).format("DD/MM/YYYY")} a las ${moment(expirationRisk).format('LT')}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `Usted figura como persona riesgosa, no tiene permitido comprar hasta: ${moment(expirationRisk).format("DD/MM/YYYY")} a las ${moment(expirationRisk).format('LT')}`
                });
            }
        }
    };

    const verifyRole = () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            const isPassenger = userData.userRoleId.includes(3);
            if (!isPassenger) {
                setCanBuy(canBuy && isPassenger);
                setSuccessMessage(`Usted no posee el rol para realizar compras`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `Usted no posee el rol para realizar compras`
                });
            }
        }
    };

    const buyTrip = async (rowData) => {
        localStorage.setItem("tripToBuy", JSON.stringify(rowData));
        if (!localStorage.getItem('userData')) {
            props.setRedirectPage("/buyTrip");
            history.push("/login");
            props.setRedirectBoolean(true);
        }
        else {
            history.push("/buyTrip");
        }
    };

    useEffect(() => {
        verifyExpirationRisk();
        verifyRole();
    }, []);

    return (
        <div>
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }
            <h2 className="text-danger text-center">{riskMessage}</h2>
            <SearchTripsModal setSearchResults={props.setSearchResults} getSearchedData={props.getSearchedData} useStyles={modalSearchStyles} setSearchedData={props.setSearchedData} />
            <br />
            <MaterialTable
                style={{ maxWidth: "100%", paddingRight: "5px" }}
                columns={columns}
                localization={materialTableConfiguration.localization}
                data={props.getSearchResults}
                title="Viajes obtenidos"
                actions={[
                    {
                        icon: () => <ShoppingCartIcon />,
                        tooltip: canBuy ? 'Comprar viaje' : "Usted no puede realizar compras",
                        disabled: !canBuy,
                        onClick: (event, rowData) => buyTrip(rowData)
                    }
                ]}
            />
        </div>
    )
};

export default TripsResults

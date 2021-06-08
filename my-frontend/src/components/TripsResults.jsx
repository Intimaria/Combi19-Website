import React from 'react';
import { useHistory } from "react-router-dom";
import SearchTripsModal from "../components/SearchTripsModal";
import MaterialTable from '@material-table/core';
// La configuracion en castellano
import { materialTableConfiguration } from '../const/materialTableConfiguration';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const columns = [
    { title: 'Origen', field: 'departure' },
    { title: 'Destino', field: 'destination' },
    { title: 'Fecha de salida', field: 'departureDay' },
    { title: 'Combi', field: 'registrationNumber' },
    { title: 'Precio', field: 'price' }
];

const modalSearch = {
    margin: 'auto',
    float: "center"
}

const TripsResults = (props) => {
    let canBuy = true;
    let riskMessage = null;
    const history = useHistory();

    // Verify that the user is not risky if is logged in
    if (localStorage.getItem('userData')) {
        const expirationRisk = JSON.parse(localStorage.getItem('userData')).expirationRisk;

        if (expirationRisk && expirationRisk >= new Date().toISOString().substring(0, 10)) {
            canBuy = false;
        }
    }

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
    }

    return (
        <div>
            <h2 className="text-danger text-center">{riskMessage}</h2>
            <SearchTripsModal setSearchResults={props.setSearchResults} getSearchedData={props.getSearchedData} modal={modalSearch} />
            <br />
            <MaterialTable
                style={{ maxWidth: "100%", paddingRight: "5px" }}
                columns={columns}
                localization={materialTableConfiguration.localization}
                data={props.getSearchResults}
                title="Viajes Obtenidos"
                actions={[
                    {
                        icon: () => <ShoppingCartIcon />,
                        tooltip: canBuy ? 'Comprar Viaje' : "No puede comprar, usted figura como persona riesgosa",
                        disabled: !canBuy,
                        onClick: (event, rowData) => buyTrip(rowData)
                    }
                ]}
            />
        </div>
    )
}

export default TripsResults

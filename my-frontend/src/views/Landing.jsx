import { Grid, makeStyles } from "@material-ui/core/";

import React from 'react'
import SearchTripsModal from "../components/SearchTripsModal";
import TestimonialCard from '../components/TestimonialCard'
import WelcomeCard from '../components/WelcomeCard'
import { useHistory } from "react-router-dom";

document.title = `Combi-19: Tu lugar para viajes`;

const modalSearchStyles = makeStyles((theme) => ({
    modal: {
        marginLeft: "7%",
        float: "left",
        maxWidth: "35%",
        width:"35%",
        backgroundColor: "rgba(153,217,234)",
        backdropFilter: "blur(40)px",
        boxShadow: "10px 10px 10px rgba(30,30,30,.1)",
        borderRadius: 10,
        padding: theme.spacing(2, 4, 3)
    },
    inputMaterial: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        margin: 'auto',
        float: "center",
        paddingTop: '2px',
        paddingLeft: '10px',
        borderRadius: 10,
    },
    div: null,
    button: {

    }
}));

const Landing = (props) => {

    const history = useHistory();

    const userData = JSON.parse(localStorage.getItem('userData'));

    return (
        <div>
            <Grid>
                <SearchTripsModal setSearchResults={props.setSearchResults} setSearchedData={props.setSearchedData} useStyles={modalSearchStyles} />
                <WelcomeCard />
            </Grid>
            <br />
            <Grid>
                <TestimonialCard/>
            </Grid>
        </div>
    )
};

export default Landing

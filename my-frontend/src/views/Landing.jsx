import { Grid, makeStyles } from "@material-ui/core/";

import React from 'react'
import TestimonialCard from '../components/TestimonialCard'
import WelcomeCard from '../components/WelcomeCard'
import { useHistory } from "react-router-dom";
import SearchTripsModal from "../components/SearchTripsModal";

document.title = `Combi-19: Tu lugar para viajes`;

const Landing = (props) => {
    const modalSearch = {
        marginLeft: "10%",
        float: "left"
    }

    const history = useHistory();

    const userData = JSON.parse(localStorage.getItem('userData'));

    return (
        <div>
            <Grid>
                <SearchTripsModal setSearchResults={props.setSearchResults} setSearchedData={props.setSearchedData} modal={modalSearch}/>
                <WelcomeCard />
            </Grid>
            <br />
            <Grid>
                {/** aca van los comentarios */}
                <TestimonialCard />
            </Grid>
        </div>
    )
}

export default Landing

import { Grid, makeStyles } from "@material-ui/core/";

import React from 'react'
import TestimonialCard from '../components/TestimonialCard'
import WelcomeCard from '../components/WelcomeCard'
import { useHistory } from "react-router-dom";

document.title = `Combi-19: Tu lugar para viajes`;

const Landing = () => {
    const history = useHistory();

        const userData = JSON.parse(localStorage.getItem('userData'));

    return (     
        <div>
             <Grid>
                {/* reemplazar con busqueda, es solo un placeholder */}
                <WelcomeCard />
                </Grid>
                <br/>
                <Grid>
                {/** aca van los comentarios */}
                <TestimonialCard />
              </Grid>  
        </div>
    )
}

export default Landing

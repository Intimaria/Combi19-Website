import React from 'react'
import { makeStyles } from "@material-ui/core/";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import WelcomeCard from '../components/WelcomeCard'
import TestimonialCard from '../components/TestimonialCard'

import TestimonialCarousel from '../components/TestimonialCarousel'
import { useHistory } from "react-router-dom";
document.title = `Combi-19::Tu lugar para viajes`;

const Landing = () => {
    const history = useHistory();

        const userData = JSON.parse(localStorage.getItem('userData'));

    return (     
        <div>
             <Grid>
                {/* reemplazar con busqueda, es solo un placeholder */}<WelcomeCard />
                <br/>
                <Grid container item md={true} sm={8}>
                  {/** aca van los comentarios */}
                </Grid>
              </Grid>  
        </div>
    )
}

export default Landing
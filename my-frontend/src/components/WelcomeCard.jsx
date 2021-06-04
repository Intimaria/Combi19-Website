import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/";

const useStyles = makeStyles({
  root: {
    maxWidth: "95%",
    backgroundColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(40)px",
    backgroundImage:
      "linear-gradient(to right bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6))",
    boxShadow: "10px 10px 10px rgba(30,30,30,.1)",
    borderRadius: 10,
    margin: 'auto',
    float: "center"
  },
  media: {
    height: 200
  }
});

export default function WelcomeCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="../../public/welcome.jpg"
          title="Tu Lugar Para Viajes"
        />
        <CardContent>
          <Typography gutterBottom variant="h2" component="h3">
            Bienvenido a Combi 19
          </Typography>
          <Typography variant="subtitle1">
            Tu lugar para viajes en Argentina
            (reemplazar componente)
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

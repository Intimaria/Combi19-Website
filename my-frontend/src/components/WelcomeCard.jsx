import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/";

const useStyles = makeStyles({
  root: {
    maxWidth: "48%",
    marginLeft: "3%",
    maxHeight: "100%",
    backdropFilter: "blur(40)px",
    boxShadow: "10px 10px 10px rgba(30,30,30,.1)",
    borderRadius: 10,
    float: "left"
  },
  media: {
    height: 245
  }
});

export default function WelcomeCard() {
  const classes = useStyles();

  return (
    <div>
    <Card className={`${classes.root} bg-dark`}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="https://api.time.com/wp-content/uploads/2018/12/how-to-travel-for-free.jpg"
          title="Tu Lugar Para Viajes"
        />
        <CardContent>
          <Typography className="text-light" gutterBottom variant="h2" component="h3">
            Bienvenido a Combi 19
          </Typography>
          <Typography className="text-light" variant="subtitle1">
            Tu lugar para viajes en Argentina
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </div>
  );
}

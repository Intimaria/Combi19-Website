import { Box, Card, CardActionArea, CardContent, CardHeader, Grid, StepContent, Typography } from "@material-ui/core";
import React, {useEffect, useState} from 'react';
import {
    getAllComments,
    getLatestComments,
} from '../api/Comments';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import {Button} from '@material-ui/core';
import {
  ERROR_MSG_API_GET_COMMENT,
} from "../const/messages";
import { makeStyles } from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "10px 10px 10px rgba(30,30,30,.1)",
    margin: 'auto',
    float: "center",
  },
  item: {
  },
  header: {
    backgroundColor: "rgba(51, 156, 165, 1)",
    maxHeight: 2
  },
  content: {
    overflow: "scroll", 
    whiteSpace: "normal",
    textOverflow: "ellipsis",
    color: theme.palette.text.secondary,
    fontFamily: "Garamond",
    fontSize: "small",
    fontStyle: "oblique",
    minHeight: 180,
    maxHeight: 180,
    textAlign: "center",
    borderRadius: 20,
    padding: 20
  },
  footer: {
    color: "rgba(58, 100, 108, 1)",
    fontSize: 12,
    fontFamily: "Arial",
    textTransform: "capitalize",
  },
  subheader: {
    color: "prussian-blue",
  },
  container: {
    borderRadius: 10,
    maxWidth: "97%",
    float: "center",
    margin: 'auto',
    backdropFilter: "blur(40)px",
   // backgroundColor: "rgba(255,255,255,0.2)",
  },
}));



export default function TestimonialCard() {
  const classes = useStyles();
  const handleCloseMessage = () => {
            setOptions({...options, open: false});
        };
  const [seeAll, setSeeAll] = useState(true);
  useEffect(() => {
     fetchData()
  }, [seeAll])
  const [viewModal, setViewModal] = useState(false);
  const [data, setData] = useState([])
  const [content, setContent] = useState(false)
  useEffect(() => {
    if (data.length > 4) {
      setContent(true)
    }
 }, [setData, data])
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});
  const formatSelectedComment = {
        id: "",
        comment: "",
        datetime: "",
        user: {
            id: "",
            name: "",
            email: ""
        },
        active: "",
        };
      //Aca se guarda los datos de la fila seleccionada
    const [selectedComment, setSelectedComment] = useState(formatSelectedComment);
    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
        if (viewModal) {
            setSelectedComment(formatSelectedComment);
        }
    }
       const fetchData = async () => {
            try { 
                let getCommentsResponse;
                if (seeAll) {
                  getCommentsResponse = await getAllComments();
                }
                else {
                  getCommentsResponse = await getLatestComments();
                }
                if (getCommentsResponse?.status === 200) {
                    let data = getCommentsResponse.data;
                    setData(data)
                } else {
                    setSuccessMessage(`${ERROR_MSG_API_GET_COMMENT} ${getCommentsResponse}`);
                    setOptions({
                        ...options, open: true, type: 'error',
                        message: `${ERROR_MSG_API_GET_COMMENT} ${getCommentsResponse}`
                    });
                }
            } catch (error) {
                console.log(`${ERROR_MSG_API_GET_COMMENT} ${error}`);
            }
        };
    useEffect(() => {
        fetchData();
    }, []);
  return (
    <div className={classes.root}>
      <br/>
    {content && 
      <Box textAlign='center' color="lightgray"> 
      { !seeAll ?
        <Button 
            size="medium" 
            variant="outlined"
            color="inherit" 
            onClick={() => { setSeeAll(true) }}>
          <ArrowDropDownIcon/> Ver Más Testimonios de Usuarios 
          </Button>
          :
          <Button 
            size="medium" 
            color="inherit" 
            variant="outlined" 
            onClick={() => { setSeeAll(false)}}>
          <ArrowDropUpIcon/> Ver Menos Testimonios de Usuarios
          </Button>
      } 
      </Box>
    }
    <Grid 
        className={classes.container}
        container
        xs={12}
        direction="row"
        justify="center"
        alignItems="flex-start"
        spacing={4}
        wrap="wrap"
        alignContent="center"> 

     {data.map(elem => (
        <Grid item xs={3} sm={3} lg={'false'} key={data.indexOf(elem)}>
          <CardActionArea>
          <Card>
            <CardContent>
              <Typography className={classes.content} variant="body1" component="p">
                "{elem.comment}"
              </Typography>
              <Typography className={classes.footer} variant="body2" component="p">
                <br/>
                {elem.user.name}
                <br/>
                {elem.datetime}
              </Typography>
            </CardContent>
            <CardHeader className={classes.header} />
          </Card>
          </CardActionArea>
        </Grid>
     ))}
    </Grid>


  </div>
  );
}
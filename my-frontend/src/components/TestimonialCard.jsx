import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Fab,
  Grid,
  Modal,
  TextField,
  Typography
} from "@material-ui/core";
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
import {useStyles} from '../const/componentStyles';

const modalStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: "70%",
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
}));


const uiStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "10px 10px 10px rgba(30,30,30,.1)",
    margin: 'auto',
    float: "center",
    borderRadius: 10
  },
  item: {
  },
  header: {
    backgroundColor: "black",
    maxHeight: 2
  },
  content: {
    overflow: "auto", 
    whiteSpace: "normal",
    textOverflow: "ellipsis",
    color: "black",
    fontFamily: "Arial",
    fontSize: "small",
    fontStyle: "none",
    minHeight: 180,
    maxHeight: 190,
    textAlign: "center",
    padding: 10
  },
  footer: {
    color: "black",
    fontSize: 12,
    fontFamily: "Arial",
    textTransform: "capitalize",
  },
  subheader: {
    color: "prussian-blue",
  },
  container: {
    maxWidth: "88%",
    float: "center",
    margin: 'auto',
    backdropFilter: "blur(40)px",
    //backgroundColor: "rgba(255,255,255,0.2)",
  },
}));


export default function TestimonialCard() {
  const modal = modalStyles();
  const classes = uiStyles();
  const styles = useStyles();
  const handleCloseMessage = () => {
            setOptions({...options, open: false});
        };
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
  const [viewModal, setViewModal] = useState(false);
  const [seeAll, setSeeAll] = useState(false);
  const [data, setData] = useState([])
  const [content, setContent] = useState(false)
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});
  const [selectedComment, setSelectedComment] = useState(formatSelectedComment);
  useEffect(() => {
    if (data.length > 4) {
      setContent(true)
    }
 }, [setData, data])

 const bodyViewDetails = (
  <div className={modal.paper}>
    <Typography variant="overline" label="Comentario" name="comment" gutterBottom>
      Comentario:
    </Typography>
    <Typography variant="body2" gutterBottom>{selectedComment.comment}</Typography>
    <Typography variant="overline" label="Fecha y Hora" name="datetime" gutterBottom>
      Fecha y hora:
    </Typography>
    <Typography variant="body2" gutterBottom>
        {selectedComment && selectedComment.datetime}
    </Typography>
    <Typography variant="overline" label="Autor" name="user.name" gutterBottom>
      Usuario:
    </Typography>
    <Typography variant="body2" gutterBottom>
      {selectedComment && selectedComment.user.name} 
    </Typography>
    <Typography variant="overline" label="Email" name="user.email" gutterBottom>
      Contacto:
    </Typography>
    <Typography variant="body2" gutterBottom>
      {selectedComment && selectedComment.user.email} 
    </Typography>
      <br/>

{/*       <p label="Comentario" name="comment">{selectedComment && selectedComment.comment}</p>         
      <p label="Fecha y hora" name="datetime">{selectedComment && selectedComment.datetime}</p>
      <p label="Nombre y email" name="user.name">{selectedComment && selectedComment.user.name}</p>
      <p label="Email" name="user.email">{selectedComment && selectedComment.user.email}</p>   */}       
      <div align="right">
          <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
      </div>
  </div>
);

const selectComment = (elem) => {
  setSelectedComment(elem);
  openCloseModalViewDetails();
}
    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
        if (viewModal) {
            setSelectedComment(formatSelectedComment);
        }
    }
       const fetchData = async () => {
            try { 
                let getCommentsResponse = await getAllComments();
                if (getCommentsResponse?.status === 200) {
                    let data = getCommentsResponse.data;
                    if (!seeAll){
                      setData(data.slice(0, 4))
                    }
                    else {
                      setData(data)
                    };
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
    }, [seeAll]);
    
    const toggleSeeAll = () => {
      if (seeAll)  {
        setSeeAll(false)
      } else { setSeeAll(true)}
    }
  return (
    <div className={classes.root}>
     <Divider/>
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

     {data.map((elem, index) => (
        <Grid item xs={3} sm={3} lg={'false'} key={data.indexOf(elem)}>
          <CardActionArea onClick={() => selectComment(elem)}>
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
    {
      <Box textAlign='center'> 
      { 
        <Button
            variant="contained"
            color="primary" 
            onClick={() => { toggleSeeAll() }}>
           {!seeAll ? <Box> <ArrowDropDownIcon/>ver más</Box> : <Box> <ArrowDropUpIcon/>ver menos</Box>}
        </Button>
      } 
      </Box>
    }
          <Modal
                open={viewModal}
                onClose={openCloseModalViewDetails}>
                {bodyViewDetails}
            </Modal>

  </div>
  );
}
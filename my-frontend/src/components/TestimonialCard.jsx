import { Box, Card, CardActionArea, CardActions, CardContent, CardHeader, Divider, Fab, Grid, Modal, StepContent, Typography } from "@material-ui/core";
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
    overflow: "scroll", 
    whiteSpace: "normal",
    textOverflow: "ellipsis",
    color: "black",
    fontFamily: "Arial",
    fontSize: "small",
    fontStyle: "none",
    minHeight: 180,
    maxHeight: 180,
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
  <div className={styles.modal}>
      <h3>DETALLE DEL COMENTARIO</h3>
    </div>
  )
  /*
      <TextField className={styles.inputMaterial} label="Ciudad" name="cityName"
                 value={selectedComment && selectedComment.cityName}/>
      <br/>
      <TextField className={styles.inputMaterial} label="Provincia" name="provinceSelected"
                 value={selectedPlace && selectedPlace.provinceName}/>
      <br/>
      <TextField className={styles.inputMaterial} label="Estado" name="active"
                 value={selectedPlace && selectedPlace.active}/>
      <br/><br/>           
      <div align="right">
          <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
      </div>
  </div>
);
 */
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
            size="small" 
            variant="extended"
            color="primary" 
            onClick={() => { toggleSeeAll() }}>
           {!seeAll ? "ver mas" : "ver menos"}
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
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Typography,
  TextField
} from '@material-ui/core';
import MaterialTable from '@material-table/core';
import {makeStyles} from '@material-ui/core/styles';
import { Message } from "./Message";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {useEffect, useState} from 'react';
import moment from "moment";
import {useStyles} from '../const/componentStyles';

/* USER IMPORTS */

import {
  getRiskyPassengers
} from '../api/PassengerReports.js';

/* FORMATTING & STYLES */ 

const modalStyles = makeStyles((theme) => ({
  paper: {
          position: 'absolute',
          width: "60%",
          backgroundColor: theme.palette.background.paper,
          border: '2px solid #000',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
       },
}));

const columns = [
  { title: 'Id' , field: 'userId'},
  { title: 'Nombre y apellido', field: 'userName' },
  {
    title: 'Fecha de nacimiento',
    render: (data) => `${moment(data.birthday).format('DD/MM/YYYY')}`,
    customFilterAndSearch: (term, data) => (`${moment(data.birthday).format('DD/MM/YYYY')}`).indexOf(term.toLowerCase()) !== -1
  },
  { title: 'Email', field: 'email' },
  { title: 'Teléfono', field: 'phone' },  
  { title: 'Riesgo hasta', field: 'riskExpires' }
];

function Covid19Report() {
  const handleCloseMessage = () => {
      setOptions({...options, open: false});
  };

  const formatSelectedPassenger = {
    userId: "",
    userName: "",
    country: "",
    documentType: "",
    birthday: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
    email: "",
    goldMemberExpires: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
    phone:"",
    documentNum:"",
    riskExpires: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
    hasDebit:""
  }

  /* HOOKS SETTINGS */ 

  // styles configuration 
  const styles = useStyles();
  const modal = modalStyles();
  //Saves user data and informs new data has been loaded 
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState(true);

  // Modal settings
  const [viewModal, setViewModal] = useState(false);

  // Saves state of error messages for user information
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});

  //Saves the state current ticket selected by the user 
  const [selectedPassenger, setSelectedPassenger] = useState(formatSelectedPassenger);


  /* [TODO]*/
  const setDefaultValues = () => {
      setDefaultObjectsValues();
      setDefaultErrorMessages("");
  };

  const setDefaultObjectsValues = () => {
      setSelectedPassenger(formatSelectedPassenger);
  };

  const setDefaultErrorMessages = () => {
      setSuccessMessage("");
  };

  // Called when fetchData API 
  const handleData = (data) => {

  };
  const selectPassenger = async (passenger, action) => {
    setSelectedPassenger(passenger);
    if (action === "Ver") {
        openCloseModalViewDetails()
    } 
};

  const openCloseModalViewDetails = () => {
    setViewModal(!viewModal);
    if (viewModal) {
       setSelectedPassenger(formatSelectedPassenger);
    }
};
  /* API CALLS & DATABASE FUNCTIONS*/

  // API: gets all the user trips from the database
  const fetchData = async () => {
      try {
          let getPassengerResponse = await getRiskyPassengers();
          console.log(getPassengerResponse)
          if (getPassengerResponse.status === 200) {
              let data = getPassengerResponse.data;
              setData(data);
              console.log(data);
          } else if (getPassengerResponse.status === 500) {
              setSuccessMessage(getPassengerResponse.data);
              setOptions({
                  ...options, open: true, type: 'error',
                  message: getPassengerResponse.data
              });
              return true
          } else {
              setSuccessMessage(` ${getPassengerResponse}`);
              setOptions({
                  ...options, open: true, type: 'error',
                  message: ` ${getPassengerResponse}`
              });
          }
      } catch (error) {
          console.log(` ${error}`);
      }
  };
  // This call to fetchData only occurs when the component first mounts (gets Passenger from DB)
  useEffect(() => {
      fetchData()
  },[])

  /* FUNCTIONALITY - CHILD COMPONENT */ 
  // Called when a trip is cancelled by the user, will fetch new data from the DB


      /* JSX COMPONENTS & FORMATTING 
    */
    // Modal de vizualizacion
    const bodyViewDetails = (
      <div className={modal.paper}>
          <Typography variant="h5" label="Detalle de pasajero" name="pasajero" gutterBottom>
            Detalle de pasajero
          </Typography>
          <Typography variant="body2" label="Nombre y Apellido" name="name" gutterBottom>
          Nombre y Apellido:
          </Typography>
          <Typography variant="body2" component="p" gutterBottom>
            {selectedPassenger && selectedPassenger.userName}
          </Typography>
          <Typography variant="overline" label="Fecha de nacimiento" name="birthday" gutterBottom>
            Fecha de nacimiento:
          </Typography>
          <Typography variant="body2" gutterBottom>
              {selectedPassenger &&  moment(selectedPassenger.birthday).format('DD/MM/YYYY')}
          </Typography>
          <Typography variant="overline" label="Autor" name="userName" gutterBottom>
            Usuario Gold:
          </Typography>
          <Typography variant="body2" gutterBottom>
            {selectedPassenger.goldMemberExpires ? "No es gold" : "Sí, hasta:" + selectedPassenger.goldMemberExpires} 
          </Typography>
          <Typography variant="overline" label="Email" name="email" gutterBottom>
            Contacto:
          </Typography>
          <Typography variant="body2" gutterBottom>
            {selectedPassenger && selectedPassenger.email} 
            {selectedPassenger && selectedPassenger.phone} 
          </Typography>
          <Typography variant="overline" label="Activo" name="active" gutterBottom>
            Riesgo hasta:  {selectedPassenger && selectedPassenger.riskExpires} 
          </Typography>
            <br/>     
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
            </div>
        </div>
  )
  return (
      <div className="App" style={{maxWidth: "100%", margin: 'auto', float: "center"}}>
          {
              successMessage ?
                  <Message open={options.open} type={options.type} message={options.message}
                           handleClose={options.handleClose}/>
                  : null
          }
          <Divider/>
          <Accordion>
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="Pasajeros de riesgo"
                  id="pasajeros"
              >
                  Ver todos los pasajeros de riesgo en el último mes
              </AccordionSummary>
              <AccordionDetails>
              <MaterialTable
                className={styles.root}
                columns={columns}
                data={data}
                title={`Pasajeros marcados con sintomas en el último mes`}
                actions={[
                    {
                        icon: () => <VisibilityIcon />,
                        tooltip: 'Visualizar pasajero',
                        onClick: (event, rowData) => selectPassenger(rowData, "Ver")
                    },
                ]}
                options={materialTableConfiguration.options}
                localization={materialTableConfiguration.localization}
            />
            </AccordionDetails>
            </Accordion>
          <Modal
                open={viewModal}
                onClose={openCloseModalViewDetails}>
                {bodyViewDetails}
            </Modal>
      </div>
  );
}

export default Covid19Report;

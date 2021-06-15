import {Button, Modal, TextField, Typography} from '@material-ui/core';
import {
  ERROR_MSG_API_COMMENT_USER_NOT_CONSUMER,
  ERROR_MSG_API_DELETE_COMMENT,
  ERROR_MSG_API_GET_COMMENT,
  ERROR_MSG_API_POST_COMMENT,
  ERROR_MSG_API_PUT_COMMENT,
  ERROR_MSG_EMPTY_TEXT_COMMENT
} from "../const/messages";
import React, {useEffect, useState} from 'react';
import {
    deleteComments,
    getComments,
    postComments,
    putComments,
    unDeleteComments,
} from '../api/Comments';

import CommentIcon from '@material-ui/icons/Comment';
import MaterialTable from '@material-table/core';
import {Message} from './Message';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
    getPassengerTrips
} from '../api/PassengerTrips';
import {makeStyles} from '@material-ui/core/styles';
import {materialTableConfiguration} from '../const/materialTableConfiguration';
import {useStyles} from '../const/componentStyles';

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
{title: 'Comentario', field: 'comment',
render: rowData => <p style={{width: 560, overflow: "hidden", whiteSpace: "nowrap",
        textOverflow: "ellipsis" }}>{rowData.comment}</p>
        },
{title: 'Fecha', field: 'datetime', 
render: rowData => <p style={{width: 140, whiteSpace: "nowrap" }}>{rowData.datetime}</p>
        },
{title: 'Estado', field: 'active',
render: rowData => <p style={{width: 30, whiteSpace: "nowrap" }}>{rowData.active}</p>
        }
];




function Comments(props) {
    //Configuracion del mensaje de exito o error
    
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

    const styles = useStyles();
    const modal = modalStyles();
    //Aca se guarda los datos al hacer el get
    const [data, setData] = useState([]);
    const [newData, setNewData] = useState(true);
    // errores de los inputs
    const [commentError, setCommentError] = React.useState(null);
    // modals
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [undeleteModal, setUndeleteModal] = useState(false);
    //Aca se guarda los datos de la fila seleccionada
    const [selectedComment, setSelectedComment] = useState(formatSelectedComment);
    //Elementos para configurar los mensajes
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({open: false, handleClose: handleCloseMessage});
    
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))
    const [hasTrips, setHasTrips] = React.useState(false)
    const newUser = JSON.parse(localStorage.getItem('userData'))
  
    useEffect(() => {
        setUserData(newUser)
    }, []);
    useEffect (() => {
        const fetchData = async () => {
                let getTripsResponse = await getPassengerTrips(newUser.userId);
                if (getTripsResponse.status === 200) {
                    let trips = getTripsResponse.data;
                    console.log("trips", trips)
                    if (trips.length > 0){
                    const pastTrips = trips.filter(d => d.status === 5);
                    if (pastTrips.length > 0) { setHasTrips(true) }
                    else {  setHasTrips(false) }
                } else setHasTrips(false)
                } else
                setHasTrips(false)
            }     
    fetchData()    
}, [])

    const updateData = (data) => {
        setData(prevState => ({
            ...prevState,
            data
        }));
    }

    const handleChange = (textFieldAtributes) => {
        const { name, value } = textFieldAtributes.target;
        setSelectedComment(prevState => ({
            ...prevState,
            [name]: value
        }));
        //Saca el mensaje de error segun el input que se modifico
        switch (name) {
            case 'comment':
                setCommentError(null);
                break;
            default:
                console.log('Es necesario agregar un case más en el switch por el name:', name);
                break;
        }
        setSuccessMessage(null);
    }
    //Aca arrancan las validaciones de los datos del comentario
    const validateForm = () => {
        return  validateComment();
    };

    const setDefaultErrorMessages = () => {
        setCommentError('');
    };

    const validateComment = () => {
        if (!selectedComment.comment) {
            setCommentError(ERROR_MSG_EMPTY_TEXT_COMMENT);
            return false;
        } 
        setCommentError(null);
        return true;
    };
    // Aca ingreso un comentario nuevo
    const requestPost = async () => {
        if (validateForm()) {
            let postResponse = await postComments(selectedComment.comment, userData.userId);
            if (postResponse.status === 201) {
                setSuccessMessage(`Se ha creado el comentario correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha creado el comentario correctamente`
                });
                setNewData(true);
                openCloseModalCreate();
            } else if (postResponse?.status === 400) {
                setCommentError(postResponse.data.commentError);
            } else if (postResponse?.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_POST_COMMENT} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_COMMENT} ${postResponse}`
                });
            }
        }
    }
      //Aca realizo la actualizacion de los datos del comentario
      const requestPut = async () => {
        if (validateForm()) {
            let putResponse = await putComments(selectedComment.comment, selectedComment.id);

            if (putResponse.status === 200) {
                setSuccessMessage(`Se ha actualizado el comentario correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha actualizado el comentario correctamente`
                });
                setNewData(true);
                openCloseModalUpdate();
            } else if (putResponse?.status === 400) {
                setCommentError(putResponse.data.commentError);
            } else if (putResponse?.status === 500) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: putResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_PUT_COMMENT} ${putResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_COMMENT} ${putResponse}`
                });
            }
        }
    }

        //Aca elimino a un chofer
        const requestDelete = async () => {
            let deleteResponse = await deleteComments(selectedComment.id);
            if (deleteResponse?.status === 200) {
                openCloseModalDelete();
                setSuccessMessage(`Se ha eliminado el comentario correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha eliminado el comentario correctamente`
                });
                setNewData(true);
            } else {
                setSuccessMessage(`${ERROR_MSG_API_DELETE_COMMENT} ${deleteResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_DELETE_COMMENT} ${deleteResponse}`
                });
            }
        }
        const requestUnDelete = async () => {
            let undeleteResponse = await unDeleteComments(selectedComment.id);
            if (undeleteResponse?.status === 200) {
                openCloseModalUnDelete();
                setSuccessMessage(`Se ha restaurado el comentario correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha restaurado el comentario correctamente`
                });
                setNewData(true);
                console.log(undeleteResponse);
            } else {
                setSuccessMessage(`${ERROR_MSG_API_PUT_COMMENT} ${undeleteResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_COMMENT} ${undeleteResponse}`
                });
            }
        }

    //Aca dependiendo del boton que se apreto abro el modal correspondiente
    const selectComment = async (comment, action) => {
        setSelectedComment(comment);
        if (action === "Ver") {
            openCloseModalViewDetails()
        } else if (action === "Editar") {
            openCloseModalUpdate()
        } else if (action === "Eliminar") {
            await openCloseModalDelete(comment)
        } else if (action === "Restaurar"){
            await openCloseModalUnDelete(comment)
        }
    }

    //Metodos para cerrar y abrir modales, pone los valores por defecto cuando los abro
    const openCloseModalCreate = () => {
        setCreateModal(!createModal);
        if (createModal) {
            setSelectedComment(formatSelectedComment);
            setDefaultErrorMessages();
        }
    }
    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
        if (viewModal) {
            setSelectedComment(formatSelectedComment);
        }
    }
    const openCloseModalUpdate = () => {
        setUpdateModal(!updateModal);
        if (updateModal) {
            setSelectedComment(formatSelectedComment);
            setDefaultErrorMessages();
        }
    }
    const openCloseModalDelete = () => {
        setDeleteModal(!deleteModal);
        if (deleteModal) {
            setSelectedComment(formatSelectedComment);
            setDefaultErrorMessages();
        }
    };
    const openCloseModalUnDelete = () => {
        setUndeleteModal(!undeleteModal);
        if (undeleteModal) {
            setSelectedComment(formatSelectedComment);
            setDefaultErrorMessages();
        }
    };
        //Aca busco los datos de los comentarios del backend
        const fetchData = async () => {
            try { 
                console.log(userData)
                let getCommentsResponse;
                getCommentsResponse = await getComments( userData.userId);
                if (getCommentsResponse?.status === 200) {
                    let data = getCommentsResponse.data;
                    setData(data);
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
        if (newData) {
        console.log(newData);
        fetchData();
        }
        return setNewData(false);
    }, [newData]);
    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO COMENTARIO</h3>
            <TextField className={styles.inputMaterial} label="Comentario" name="comment"
                       required
                       id="standard-multiline-flexible"
                       label="Agregue su comentario aquí:"
                       multiline
                       rowsMax={8}
                       inputProps={{maxLength: 400}}
                       autoComplete='off'
                       error={(commentError) ? true : false}
                       helperText={(commentError) ? commentError : false}
                       onChange={handleChange}
                       value={selectedComment && selectedComment.comment}/>
            <br/>
            <div align="right">
                <Button color="primary" onClick={() => requestPost()}>GUARDAR</Button>
                <Button onClick={() => openCloseModalCreate()}>CANCELAR</Button>
            </div>
        </div>
    );
    const bodyViewDetails = (
        <div className={modal.paper}>
          <Typography variant="overline" label="Comentario" name="comment" gutterBottom>
            Comentario:
          </Typography>
          <Typography variant="body2" component="p" gutterBottom>{selectedComment.comment}</Typography>
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
          <Typography variant="overline" label="Activo" name="active" gutterBottom>
            Estado:  {selectedComment && selectedComment.active} 
          </Typography>
            <br/>     
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
            </div>
        </div>
      );

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR COMENTARIO</h3>
            <Tooltip title="Debe eliminar el comentario para cambiar el estado">
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                           value={selectedComment && selectedComment.active} disabled
                />
            </Tooltip>
            <br/>
            <TextField className={styles.inputMaterial} label="Comentario" name="comment"
                       required
                       id="standard-multiline-flexible"
                       label="Edite su comentario aquí:"
                       multiline
                       rowsMax={8}
                       inputProps={{maxLength: 400}}
                       autoComplete='off'
                       error={(commentError) ? true : false}
                       helperText={(commentError) ? commentError : false}
                       onChange={handleChange}
                       value={selectedComment && selectedComment.comment}/>
            <br/>
            <br/>
            <div align="right">
                <Button color="primary" onClick={() => requestPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    );

    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar el comentario <b>{selectedComment && selectedComment.comment.slice(0, 30) + '...'}</b> de
                fecha <b>{selectedComment && selectedComment.datetime}</b>?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => requestDelete()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>

            </div>

        </div>
    );
    const bodyUnDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas restaurar el comentario <b>{selectedComment && selectedComment.comment.slice(0, 30) + '...'}</b> de
                fecha <b>{selectedComment && selectedComment.datetime}</b>?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => requestUnDelete()}>SÍ, RESTAURAR</Button>
                <Button onClick={() => openCloseModalUnDelete()}>NO, CANCELAR</Button>

            </div>

        </div>
    );
    return (
        <div className="App">
            {
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                            handleClose={options.handleClose}/>
                    : null
            }
            <br/>
        {/* este boton quizas este en el front  */}
        {userData && <div>
            {hasTrips ? 
            <Button style={{marginLeft: '8px'}}
                    variant="contained"
                    size="large"
                    color="primary"
                    id="btnNewComment"
                    startIcon={<CommentIcon/>}
                    onClick={() =>{openCloseModalCreate()} 
                    }>NUEVO COMENTARIO</Button>
                :
                <Tooltip title={ERROR_MSG_API_COMMENT_USER_NOT_CONSUMER} placement="bottom-start">
                    <span>
                        <Button style={{marginLeft: '8px'}}
                            variant="contained"
                            size="large"
                            id="btnNewComment"
                            startIcon={<CommentIcon/>}
                            disabled 
                            >NUEVO COMENTARIO
                        </Button>
                    </span>
                </Tooltip>
                }
                    </div>
        }
            <br/><br/>
            <MaterialTable
                columns={columns}
                data={data}
                title={"Lista de mis comentarios"}
                actions={ userData && [
                    {
                        icon: () => <VisibilityIcon/>,
                        tooltip: 'Visualización de comentario',
                        onClick: (event, rowData) => selectComment(rowData, "Ver")
                    },
                    rowData => ({
                        icon: 'edit',
                        tooltip: (rowData.active === 'Activo') ? 'Editar comentario' : 'No se puede editar un comentario dada de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectComment(rowData, "Editar")
                    }),
                    rowData => {
                        return rowData.active === 'Activo' ? 
                        {
                        icon: 'delete',
                        tooltip: 'Eliminar comentario',
                        onClick: (event, rowData) => selectComment(rowData, "Eliminar") 
                        }
                        : 
                        {
                        icon: 'restore',
                        tooltip: 'Clickear para restaurar el comentario',
                        onClick: (event, rowData) => selectComment(rowData, "Restaurar") 
                    }}
                ]}
                options={materialTableConfiguration.options}
                localization={materialTableConfiguration.localization}
            />
            <Modal
                open={createModal}
                onClose={openCloseModalCreate}>
                {bodyCreate}
            </Modal>

            <Modal
                open={viewModal}
                onClose={openCloseModalViewDetails}>
                {bodyViewDetails}
            </Modal>

            <Modal
                open={updateModal}
                onClose={openCloseModalUpdate}>
                {bodyEdit}
            </Modal>

            <Modal
                open={deleteModal}
                onClose={openCloseModalDelete}>
                {bodyDelete}
            </Modal>

            <Modal
                open={undeleteModal}
                onClose={openCloseModalUnDelete}>
                {bodyUnDelete}
            </Modal>
       

        </div>
    );
}


export default Comments;

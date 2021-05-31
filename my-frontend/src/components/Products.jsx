// Importo de elemntos de material ui, las apis que utilizo y el componente del mensaje
import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button } from '@material-ui/core';
import MaterialTable from '@material-table/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Tooltip from '@material-ui/core/Tooltip';
import { getProducts, postProducts, putProducts, deleteProducts, getProductDependenceById } from '../api/Products.js';
import { Message } from "./Message";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

//Los estilos de los modals
import { useStyles } from '../const/componentStyles';

// Importo los mensajes de error
import {
    ERROR_MSG_INVALID_NAME_PRODUCT,
    ERROR_MSG_INVALID_PRICE_PRODUCT,
    ERROR_MSG_INVALID_TYPE_PRODUCT,
    ERROR_MSG_EMPTY_NAME_PRODUCT,
    ERROR_MSG_EMPTY_PRICE_PRODUCT,
    ERROR_MSG_EMPTY_TYPE_PRODUCT,
    ERROR_MSG_API_GET_PRODUCTS,
    ERROR_MSG_API_POST_PRODUCT,
    ERROR_MSG_API_PUT_PRODUCT,
    ERROR_MSG_API_DELETE_PRODUCT,
    ERROR_MSG_API_MODIFY_PRODUCT_BUY_DEPENDENCE,
    ERROR_MSG_LARGE_PRICE_PRODUCT
} from '../const/messages.js';

// Importo las expresiones regulares
import {
    REGEX_ONLY_NUMBER,
    REGEX_ONLY_DECIMAL_NUMBER,
    REGEX_ONLY_ALPHABETICAL
} from '../const/regex.js';

// La configuracion en castellano
import { materialTableConfiguration } from '../const/materialTableConfiguration';

//Nombre de las columnas de los datos a mostrar y la aclaracion de que campo representan
const columns = [
    { title: 'Nombre', field: 'name' },
    { title: 'Precio', field: 'price' },
    { title: 'Tipo', field: 'typeProductDescription' },
    { title: 'Estado', field: 'active' }
];

function Products() {
    //Configuracion del mensaje de exito o error
    const handleCloseMessage = () => {
        setOptions({ ...options, open: false });
    };

    //Formato que tiene los datos al seleccionarlos para mostrarlos en un modal
    const formatSelectedProduct = {
        idProduct: "",
        name: "",
        price: "",
        typeProductDescription: "",
        typeProductId: "",
        active: ""
    }

    const styles = useStyles();
    //Aca se guarda los datos al hacer el get
    const [data, setData] = useState([]);

    //Mensaje de error de los inputs
    const [nameError, setNameError] = React.useState(null);
    const [typeProductError, setTypeProductError] = React.useState(null);
    const [priceError, setPriceError] = React.useState(null);
    //Para abrir y cerrar los modales
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    //Aca se guarda los datos de la fila seleccionada
    const [selectedProduct, setSelectedProduct] = useState(formatSelectedProduct);
    const [typeProductSelected, setTypeProductSelected] = useState(null);
    //Elementos para configurar los mensajes
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [options, setOptions] = React.useState({ open: false, handleClose: handleCloseMessage });

    //Cuando se actualiza un valor de un input esta funcion actualiza los datos
    const handleChange = (textFieldAtributes) => {
        const { name, value } = textFieldAtributes.target;
        if (name === 'typeProduct') {
            setTypeProductError(false);
            setTypeProductSelected(value);
        } else {
            setSelectedProduct(prevState => ({
                ...prevState,
                [name]: value
            }))

            //Saca el mensaje de error segun el input que se modifico
            switch (name) {
                case 'name':
                    setNameError(null);
                    break;
                case 'price':
                    setPriceError(null);
                    break;
                default:
                    console.log('Es necesario agregar un case más en el switch por el name:', name);
                    break;
            }
        }

        setSuccessMessage(null);
    }

    //Aca arrancan las validaciones de los datos del producto
    const validateForm = () => {
        return (validateName() & validatePrice() & validateTypeProduct());
    };

    const setDefaultErrorMessages = () => {
        setNameError(false);
        setPriceError(false);
        setTypeProductError(false);
    };

    const validateName = () => {
        if (!selectedProduct.name) {
            setNameError(ERROR_MSG_EMPTY_NAME_PRODUCT);
            return false;
        } else if (!REGEX_ONLY_ALPHABETICAL.test(selectedProduct.name) || selectedProduct.name.length > 45) {
            setNameError(ERROR_MSG_INVALID_NAME_PRODUCT);
            return false;
        }
        setNameError(null);
        return true;
    }

    const validatePrice = () => {
        let auxPrice = selectedProduct.price;
        if (selectedProduct.price.includes(",")) auxPrice = auxPrice.replace(",",".");
        if (!auxPrice) {
            setPriceError(ERROR_MSG_EMPTY_PRICE_PRODUCT);
            return false;
        } else if (REGEX_ONLY_DECIMAL_NUMBER.test(auxPrice) || auxPrice <= 0 || (auxPrice.includes(".") && ![1,2].includes(auxPrice.split(".")[1].length))) {
            setPriceError(ERROR_MSG_INVALID_PRICE_PRODUCT);
            return false;
        }
        else if (auxPrice >= 100000) {
            setPriceError(ERROR_MSG_LARGE_PRICE_PRODUCT);
            return false;
        }
        setPriceError(null);
        return true;
    }

    const validateTypeProduct = () => {
        if (!selectedProduct.typeProductId && !typeProductSelected) {
            setTypeProductError(ERROR_MSG_EMPTY_TYPE_PRODUCT);
            return false;
        } else if (!REGEX_ONLY_NUMBER.test(selectedProduct.typeProductId) && !REGEX_ONLY_NUMBER.test(typeProductSelected)) {
            console.log(selectedProduct.typeProductId);
            console.log(typeProductSelected);
            setTypeProductError(ERROR_MSG_INVALID_TYPE_PRODUCT);
            return false;
        }

        setTypeProductError(null);
        return true;
    }
    // Aca ingreso un producto nuevo
    const requestPost = async () => {
        if (validateForm()) {
            console.log("llegoo")
            let postResponse = await postProducts(selectedProduct, typeProductSelected);
            if (postResponse.status === 201) {
                setSuccessMessage(`Se ha creado el producto correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha creado el producto correctamente`
                });
                openCloseModalCreate();
                fetchData();
            } else if (postResponse?.status === 400) {
                setNameError(postResponse.data.nameError);
                setPriceError(postResponse.data.priceError);
                setTypeProductError(postResponse.data.typeProductError);
            } else if (postResponse?.status === 500) {
                setSuccessMessage(postResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: postResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_POST_PRODUCT} ${postResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_POST_PRODUCT} ${postResponse}`
                });
            }
        }
    }
    //Aca realizo la actualizacion de los datos del chofer
    const requestPut = async () => {
        if (validateForm()) {
            let putResponse = await putProducts(
                selectedProduct,
                typeProductSelected ? typeProductSelected : selectedProduct.typeProductId,
                selectedProduct.idProduct
            );
            if (putResponse.status === 201) {
                setSuccessMessage(`Se ha actualizado el producto correctamente`);
                setOptions({
                    ...options, open: true, type: 'success',
                    message: `Se ha actualizado el producto correctamente`
                });
                openCloseModalUpdate();
                fetchData();
            } else if (putResponse?.status === 400) {
                setNameError(putResponse.data.nameError);
                setPriceError(putResponse.data.priceError);
                setTypeProductError(putResponse.data.typeProductError);
            } else if (putResponse?.status === 500) {
                setSuccessMessage(putResponse.data);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: putResponse.data
                });
                return true
            } else {
                setSuccessMessage(`${ERROR_MSG_API_PUT_PRODUCT} ${putResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_PUT_PRODUCT} ${putResponse}`
                });
            }
        }
    }
    //Aca elimino a un chofer
    const requestDelete = async () => {
        let deleteResponse = await deleteProducts(selectedProduct.idProduct);

        if (deleteResponse?.status === 200) {
            openCloseModalDelete();
            setSuccessMessage(`Se ha eliminado el producto correctamente`);
            setOptions({
                ...options, open: true, type: 'success',
                message: `Se ha eliminado el producto correctamente`
            });
            fetchData();
        } else {
            setSuccessMessage(`${ERROR_MSG_API_DELETE_PRODUCT} ${deleteResponse}`);
            setOptions({
                ...options, open: true, type: 'error',
                message: `${ERROR_MSG_API_DELETE_PRODUCT} ${deleteResponse}`
            });
        }
    }

    //Aca dependiendo del boton que se apreto abro el modal correspondiente
    const selectProduct = async (product, action) => {
        setSelectedProduct(product);
        if (action === "Ver") {
            openCloseModalViewDetails()
        } else if (action === "Editar") {
            await openCloseModalUpdate(product)
        } else {
            openCloseModalDelete()
        }
    }

    //Metodos para cerrar y abrir modales, pone los valores por defecto cuando los abro
    const openCloseModalCreate = () => {
        setCreateModal(!createModal);
        if (createModal) {
            setSelectedProduct(formatSelectedProduct);
            setTypeProductSelected('');
            setDefaultErrorMessages();
        }
    }

    const openCloseModalViewDetails = () => {
        setViewModal(!viewModal);
        if (viewModal) {
            setSelectedProduct(formatSelectedProduct);
        }
    }

    const openCloseModalUpdate = async (product) => {
        // If the modal is closed, product dependence is validate before open the modal
        if (!updateModal) {
            let dependenceResponse = await getProductDependenceById(product.idProduct);

            // If the product was bought by a customer, the modal will NOT be open
            if (dependenceResponse.data.productClientDependence) {
                setSuccessMessage(ERROR_MSG_API_MODIFY_PRODUCT_BUY_DEPENDENCE);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: ERROR_MSG_API_MODIFY_PRODUCT_BUY_DEPENDENCE
                });
            } else {
                // If the product was NOT bought by a customer, the modal will be open
                setTypeProductSelected(selectedProduct.typeProductId);
                setUpdateModal(!updateModal);
            }
        } else {
            // The modal is closed
            setUpdateModal(!updateModal);
            // Data are cleaned when the modal is closed
            setSelectedProduct(formatSelectedProduct);
            setTypeProductSelected('');
            setDefaultErrorMessages();
        }
    };

    const openCloseModalDelete = () => {
        setDeleteModal(!deleteModal);
        if (deleteModal) {
            setSelectedProduct(formatSelectedProduct);
        }
    }

    //Aca busco los datos de los choferes del backend
    const fetchData = async () => {
        try {
            let getResponse = await getProducts();

            if (getResponse?.status === 200) {
                let data = getResponse.data;
                setData(data);
            } else {
                setSuccessMessage(`${ERROR_MSG_API_GET_PRODUCTS} ${getResponse}`);
                setOptions({
                    ...options, open: true, type: 'error',
                    message: `${ERROR_MSG_API_GET_PRODUCTS} ${getResponse}`
                });
            }
        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_PRODUCTS} ${error}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    //Inputs para 2 diferentes modales
    const inputsToCreateOrModify = (
        <div>
            <TextField className={styles.inputMaterial} label="Nombre" name="name"
                required
                inputProps={{ maxLength: 45 }}
                autoComplete='off'
                error={(nameError) ? true : false}
                helperText={(nameError) ? nameError : false}
                onChange={handleChange}
                value={selectedProduct && selectedProduct.name} />
            <br />
            <TextField className={styles.inputMaterial} label="Precio" name="price"
                required
                inputProps={{ maxLength: 8 }}
                autoComplete='off'
                error={(priceError) ? true : false}
                helperText={(priceError) ? priceError : false}
                onChange={handleChange}
                value={selectedProduct && selectedProduct.price} />
            <br />
        </div>
    )
    // Modal de creacion
    const bodyCreate = (
        <div className={styles.modal}>
            <h3>AGREGAR NUEVO PRODUCTO</h3>
            {inputsToCreateOrModify}
            <FormControl className={styles.inputMaterial}
                required
                error={(typeProductError) ? true : false}>
                <InputLabel>Tipo</InputLabel>
                <Select label="Tipo" id="typeProduct" labelId={"typeProduct"} name="typeProduct"
                    className={styles.inputMaterial}
                    onChange={handleChange}
                    value={(typeProductSelected) ? typeProductSelected : 0}
                >
                    <MenuItem value={0} disabled> Seleccione un tipo </MenuItem>
                    <MenuItem key={1} value={1}> Dulce </MenuItem>
                    <MenuItem key={2} value={2}> Salado </MenuItem>
                </Select>
                <FormHelperText>{(typeProductError) ? typeProductError : false}</FormHelperText>
            </FormControl>
            <div align="right">
                <Button color="primary" onClick={() => requestPost()}>GUARDAR</Button>
                <Button onClick={() => openCloseModalCreate()}>CANCELAR</Button>
            </div>
        </div>
    )
    // Modal de vizualizacion
    const bodyViewDetails = (
        <div className={styles.modal}>
            <h3>DETALLE DE EL PRODUCTO</h3>
            <TextField className={styles.inputMaterial} label="Estado" name="active"
                value={selectedProduct && selectedProduct.active} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Nombre" name="name"
                value={selectedProduct && selectedProduct.name} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Precio" name="price"
                value={selectedProduct && selectedProduct.price} autoComplete="off" />
            <br />
            <TextField className={styles.inputMaterial} label="Tipo" name="typeProduct"
                value={selectedProduct && selectedProduct.typeProductId} autoComplete="off" />
            <br /><br />
            <div align="right">
                <Button onClick={() => openCloseModalViewDetails()}>CERRAR</Button>
            </div>
        </div>
    )
    // Modal de actualizacion
    const bodyEdit = (
        <div className={styles.modal}>
            <h3>EDITAR PRODUCTO</h3>
            <Tooltip title="Debe eliminar el producto para cambiar el estado">
                <TextField className={styles.inputMaterial} label="Estado" name="active"
                    value={selectedProduct && selectedProduct.active} disabled />
            </Tooltip>
            {inputsToCreateOrModify}
            <FormControl className={styles.inputMaterial}
                required
                error={(typeProductError) ? true : false}>
                <InputLabel>Tipo</InputLabel>
                <Select label="Tipo" id="typeProduct" labelId={"typeProduct"} name="typeProduct"
                    className={styles.inputMaterial}
                    value={(typeProductSelected) ? typeProductSelected : selectedProduct.typeProductId}
                    onChange={handleChange}
                >
                    <MenuItem value={0} disabled> Seleccione un tipo </MenuItem>
                    <MenuItem key={1} value={1}> Dulce </MenuItem>
                    <MenuItem key={2} value={2}> Salado </MenuItem>
                </Select>
                <FormHelperText>{(typeProductError) ? typeProductError : false}</FormHelperText>
            </FormControl>
            <div align="right">
                <Button color="primary" onClick={() => requestPut()}>CONFIRMAR CAMBIOS</Button>
                <Button onClick={() => openCloseModalUpdate()}>CANCELAR</Button>
            </div>
        </div>
    )
    //Modal de elimincacion
    const bodyDelete = (
        <div className={styles.modal}>
            <p>¿Estás seguro que deseas eliminar el producto con
                nombre <b>{selectedProduct && selectedProduct.name}</b> ?
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => requestDelete()}>SÍ, ELIMINAR</Button>
                <Button onClick={() => openCloseModalDelete()}>NO, CANCELAR</Button>
            </div>
        </div>
    )

    return (
        <div className="App">
            {   // Esto es para que se muestre la ventanita del mensaje
                successMessage ?
                    <Message open={options.open} type={options.type} message={options.message}
                        handleClose={options.handleClose} />
                    : null
            }
            <br />
            <Button style={{ marginLeft: '8px' }}
                variant="contained"
                size="large"
                color="primary"
                id="btnNewDriver"
                startIcon={<ShoppingCartIcon />}
                onClick={() => openCloseModalCreate()}>NUEVO PRODUCTO</Button>
            <br /><br />
            <MaterialTable
                columns={columns}
                data={data}
                title="Lista de productos"
                actions={[
                    {
                        icon: () => <VisibilityIcon />,
                        tooltip: 'Visualización de producto',
                        onClick: (event, rowData) => selectProduct(rowData, "Ver")
                    },
                    rowData => ({
                        icon: 'edit',
                        tooltip: (rowData.active === 'Activo') ? 'Editar producto' : 'No se puede editar un producto dado de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectProduct(rowData, "Editar")
                    }),
                    rowData => ({
                        icon: 'delete',
                        tooltip: (rowData.active === 'Activo') ? 'Eliminar producto' : 'No se puede eliminar un producto dado de baja',
                        disabled: rowData.active !== "Activo",
                        onClick: (event, rowData) => selectProduct(rowData, "Eliminar")
                    })
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
        </div>
    );
}

export default Products

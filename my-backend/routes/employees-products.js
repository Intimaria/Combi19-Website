const {Router} = require('express');

const {getProducts, postProduct, getProductById, putProduct, deleteProduct, getAvailableProducts, getProductDependenceById} = require("../controllers/products.js");

// The administrator role should be validated with a middleware before performing any operation
const {authenticateAdminRol, authenticatePassengerRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all products
router.get('/', authenticateAdminRol, getProducts);

// Retrieve all active products
router.get('/custom/available', authenticatePassengerRol, getAvailableProducts);

// Retrieve a single product by id
router.get('/:id', authenticateAdminRol, getProductById);

// Retrieve transport dependence by id
router.get('/custom/productDependenceById/:id', authenticateAdminRol, getProductDependenceById);

// Create a new product
router.post('/', authenticateAdminRol, postProduct);

// Update a product by id
router.put('/:id', authenticateAdminRol, putProduct);

// Delete a product by id
router.delete('/:id', authenticateAdminRol, deleteProduct);

module.exports = router;

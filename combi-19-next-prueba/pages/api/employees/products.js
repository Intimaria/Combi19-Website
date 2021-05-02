const {Router} = require('next/router');

const {getProducts, postProduct, getProductById, putProduct, deleteProduct} = require("../controllers/products.js");

// The administrator role should be validated with a middleware before performing any operation
const {authenticateAdminRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all products
router.get('/', authenticateAdminRol, getProducts);

// Retrieve a single product by id
router.get('/:id', authenticateAdminRol, getProductById);

// Create a new product
router.post('/', authenticateAdminRol, postProduct);

// Update a product by id
router.put('/:id', authenticateAdminRol, putProduct);

// Delete a product by id
router.delete('/:id', authenticateAdminRol, deleteProduct);

module.exports = router;

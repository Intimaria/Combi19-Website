const {Router} = require('express');
const {
    getCommentsUser,
    getCommentById,
    postComment,
    putComment,
    unDeleteComment,
    deleteComment,
    getAllComments,
    getLatestComments
} = require('../controllers/comments');
const {authenticatePassengerRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all comments
router.get('/',  getAllComments);

// Retrieve latest comments
router.get('/custom/latest',  getLatestComments);

// Retrieve all the logged in user comments
router.get('/custom/user/:id', authenticatePassengerRol, getCommentsUser);

// Retrieve a single Comment by id
router.get('/:id',  authenticatePassengerRol, getCommentById);

// Create a new Comment
router.post('/custom/user/:id', authenticatePassengerRol, postComment);

// Update a Comment by id
router.put('/:id', authenticatePassengerRol, putComment);

// Delete a Comment by id
router.delete('/:id', authenticatePassengerRol, deleteComment);

// unDelete a Comment by id
 router.put('/custom/:id',  unDeleteComment);

module.exports = router;
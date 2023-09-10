const express = require('express');
const {
  addComment,
  singleComment,
  updateComment,
  deleteComment,
} = require('../controller/commentController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
router.post('/add-comment', verifyToken, addComment);
router.get('/single-comment/:id', verifyToken, singleComment);
router.put('/update-comment/:id', verifyToken, updateComment);
router.delete('/delete-comment/:id', verifyToken, deleteComment);
module.exports = router;

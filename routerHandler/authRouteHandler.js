const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfiguration');
const verifyToken = require('../middleware/verifyToken');
const {
  register,
  login,
  logout,
  user,
} = require('../controller/authController');
const { query } = require('express-validator');
const validate = [
  query('email').isEmail().escape().withMessage('Invalid email address'),
  query('password').notEmpty().escape().withMessage('Password is required'),
];
router.post('/register', upload.single('avatar'), register);
router.post('/login', validate, login);
router.get('/logout', verifyToken, logout);
router.get('/me', verifyToken, user);
module.exports = router;

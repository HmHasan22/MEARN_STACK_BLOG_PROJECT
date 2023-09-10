const express = require('express');
const { like } = require('../controller/likeController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
router.post('/like', verifyToken, like);
module.exports = router;

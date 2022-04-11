const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/profile', protect, userController.profile);

module.exports = router;

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', protect, postController.index);
router.post('/', protect, postController.create);
router.get('/:id', protect, postController.show);
router.put('/:id', protect, postController.update);
router.delete('/:id', protect, postController.destroy);

module.exports = router;

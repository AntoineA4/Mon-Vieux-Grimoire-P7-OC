const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../Controllers/Book');
const { resizeImages } = require('../middleware/resize-image');

router.post('/', auth, multer, resizeImages, bookCtrl.addBook);
router.get('/bestrating', bookCtrl.bestRating);
router.post('/:id/Rating', auth, bookCtrl.addRate);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBook);
router.put('/:id', auth, multer, resizeImages, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;

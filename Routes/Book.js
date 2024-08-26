const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../Controllers/Book');

router.post('/', auth, multer, bookCtrl.addBook);
router.get('/bestrating', bookCtrl.bestRating);
router.post('/:id/Rating', auth, bookCtrl.addRate);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;

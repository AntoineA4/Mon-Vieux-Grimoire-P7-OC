const express = require('express');

const router = express.Router();
const bookCtrl = require('../Controllers/Book');
const auth = require('../middleware/auth');

router.post('/', auth, bookCtrl.addBook);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBook);
router.put('/:id', auth, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;

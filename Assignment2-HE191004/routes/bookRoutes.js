const router = require('express').Router();
const c = require('../controllers/bookController');
const asyncHandler = require('../utils/asyncHandler');
router.get('/', asyncHandler(c.getBooks));
router.get('/:id', asyncHandler(c.getBookById));
router.post('/', asyncHandler(c.createBook));
router.put('/:id', asyncHandler(c.updateBook));
router.delete('/:id', asyncHandler(c.deleteBook));
module.exports = router;

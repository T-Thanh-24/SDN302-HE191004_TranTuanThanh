const router = require('express').Router();
const c = require('../controllers/memberController');
const asyncHandler = require('../utils/asyncHandler');
router.get('/', asyncHandler(c.getMembers));
router.get('/:id', asyncHandler(c.getMemberById));
router.post('/', asyncHandler(c.createMember));
router.put('/:id', asyncHandler(c.updateMember));
router.delete('/:id', asyncHandler(c.deleteMember));
module.exports = router;


const express = require('express');
const router = express.Router();

const loanController = require('../controllers/loanController');

router.get('/', loanController.getLoans);
router.get('/member/:memberID', loanController.getMemberLoans);
router.get('/:id', loanController.getLoanById);
router.post('/', loanController.createLoan);
router.put('/:id/return', loanController.returnLoan);

module.exports = router;

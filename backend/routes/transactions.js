const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactions');
const authMiddleware = require('../middleware/auth');

// @route   POST api/transactions/buy/:listing_id
// @desc    Buy a listing and create a transaction
// @access  Private
router.post('/buy/:listing_id', authMiddleware, transactionController.buyListing);

// @route   PUT api/transactions/:id/status
// @desc    Update transaction status
// @access  Private
router.put('/:id/status', authMiddleware, transactionController.updateTransactionStatus);

// @route   GET api/transactions/my-purchases
// @desc    Get my purchases
// @access  Private
router.get('/my-purchases', authMiddleware, transactionController.getMyPurchases);

// @route   GET api/transactions/my-sales
// @desc    Get my sales
// @access  Private
router.get('/my-sales', authMiddleware, transactionController.getMySales);

module.exports = router;

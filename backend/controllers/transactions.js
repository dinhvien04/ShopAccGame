const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const Listing = require('../models/Listing');

// @desc    Buy a listing and create a transaction
exports.buyListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listing_id);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    // Check if listing is available
    if (listing.status !== 'Available') {
      return res.status(400).json({ msg: 'Listing is not available for purchase' });
    }

    // Prevent user from buying their own listing
    if (listing.seller.toString() === req.user.id) {
        return res.status(400).json({ msg: 'You cannot buy your own listing' });
    }

    // Create a new transaction
    const newTransaction = new Transaction({
      listing: req.params.listing_id,
      buyer: req.user.id,
      seller: listing.seller,
      status: 'Initiated', // Default status
    });

    // Update listing status to 'Pending'
    listing.status = 'Pending';

    await listing.save();
    const transaction = await newTransaction.save();

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update transaction status
exports.updateTransactionStatus = async (req, res) => {
    const { status } = req.body;
    const { id: userId, role } = req.user;

    // Basic validation
    if (!status) {
        return res.status(400).json({ msg: 'Status is required' });
    }

    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        const buyerId = transaction.buyer.toString();
        const sellerId = transaction.seller.toString();

        // Authorization logic: check if the user is allowed to update the status
        if (userId !== buyerId && userId !== sellerId && role !== 'Admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // TODO: Implement more granular status transition logic here
        // For example: only a seller can mark as 'Delivered'
        // only a buyer can mark as 'Confirmed'

        transaction.status = status;
        transaction.updatedAt = Date.now();

        // If transaction is completed, update the listing to 'Sold'
        if (status === 'Completed') {
            const listing = await Listing.findById(transaction.listing);
            if (listing) {
                listing.status = 'Sold';
                await listing.save();
            }
        }

        await transaction.save();
        res.json(transaction);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get my purchases
exports.getMyPurchases = async (req, res) => {
    try {
        const purchases = await Transaction.find({ buyer: req.user.id })
            .populate('listing', ['title', 'price'])
            .populate('seller', 'name')
            .sort({ createdAt: -1 });
        res.json(purchases);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get my sales
exports.getMySales = async (req, res) => {
    try {
        const sales = await Transaction.find({ seller: req.user.id })
            .populate('listing', ['title', 'price'])
            .populate('buyer', 'name')
            .sort({ createdAt: -1 });
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

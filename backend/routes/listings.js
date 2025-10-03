
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const listingController = require('../controllers/listings');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/listings
// @desc    Get all listings
// @access  Public
router.get('/', listingController.getListings);

// @route   GET api/listings/:id
// @desc    Get single listing
// @access  Public
router.get('/:id', listingController.getListingById);

// @route   POST api/listings
// @desc    Create a listing
// @access  Private
router.post(
  '/',
  [
    authMiddleware,
    upload,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('price', 'Price is required').isNumeric(),
      check('game', 'Game is required').not().isEmpty(),
    ],
  ],
  listingController.createListing
);

// @route   PUT api/listings/:id
// @desc    Update a listing
// @access  Private
router.put('/:id', authMiddleware, listingController.updateListing);

// @route   DELETE api/listings/:id
// @desc    Delete a listing
// @access  Private
router.delete('/:id', authMiddleware, listingController.deleteListing);

module.exports = router;


const { validationResult } = require('express-validator');
const Listing = require('../models/Listing');

// @desc    Get all listings
exports.getListings = async (req, res) => {
  try {
    const { search, game } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { game: { $regex: search, $options: 'i' } },
      ];
    }

    if (game) {
      query.game = game;
    }

    const listings = await Listing.find(query).populate('seller', ['name', 'email']).sort({ date: -1 });
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single listing
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', ['name', 'email']);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a listing
exports.createListing = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, price, game } = req.body;
  const images = req.files.map(file => file.path);

  try {
    const newListing = new Listing({
      title,
      description,
      price,
      game,
      images,
      seller: req.user.id,
    });

    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a listing
exports.updateListing = async (req, res) => {
  const { title, description, price, game } = req.body;

  // Build listing object
  const listingFields = {};
  if (title) listingFields.title = title;
  if (description) listingFields.description = description;
  if (price) listingFields.price = price;
  if (game) listingFields.game = game;

  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    // Make sure user owns listing
    if (listing.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: listingFields },
      { new: true }
    );

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    // Make sure user owns listing
    if (listing.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Do not delete if it's part of an active transaction
    if (listing.status !== 'Available') {
        return res.status(400).json({ msg: 'Cannot delete a listing that is sold or pending' });
    }

    await Listing.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Listing removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

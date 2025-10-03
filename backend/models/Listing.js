
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new mongoose.Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  game: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Pending', 'Disputed'],
    default: 'Available',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('listing', ListingSchema);

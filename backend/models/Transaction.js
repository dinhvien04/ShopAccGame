
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'listing',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  status: {
    type: String,
    enum: [
      'Initiated', // Buyer clicks buy
      'Paid', // Buyer has paid, funds in escrow
      'Delivered', // Seller has delivered account info
      'Confirmed', // Buyer confirms receipt
      'Completed', // Funds released to seller
      'Cancelled', // Transaction cancelled
      'Disputed', // Dispute raised
    ],
    default: 'Initiated',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('transaction', TransactionSchema);

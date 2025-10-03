const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['SuperAdmin', 'Admin', 'Moderator'],
    default: 'Admin'
  },
  permissions: {
    manageUsers: {
      type: Boolean,
      default: true
    },
    manageListings: {
      type: Boolean,
      default: true
    },
    manageTransactions: {
      type: Boolean,
      default: true
    },
    viewStats: {
      type: Boolean,
      default: true
    },
    manageAdmins: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
AdminSchema.index({ username: 1 });
AdminSchema.index({ email: 1 });

module.exports = mongoose.model('admin', AdminSchema);





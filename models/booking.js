const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > new Date(); // Check-in must be in future
      },
      message: 'Check-in date must be in the future'
    }
  },
  checkOut: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.checkIn; // Check-out after check-in
      },
      message: 'Check-out must be after check-in'
    }
  },
  guests: {
    type: Number,
    required: true,
    min: [1, 'At least 1 guest required'],
    max: [20, 'Maximum 20 guests allowed']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
bookingSchema.index({ home: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);

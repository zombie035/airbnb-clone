const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  houseName: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'House name must be at least 3 characters'],
    maxlength: [100, 'House name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
    max: [100000, 'Price cannot exceed $100,000 per night']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  photo: {
    type: String,
    default: '/images/default-home.jpg'
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amenities: [String],
  maxGuests: {
    type: Number,
    min: 1,
    default: 2
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Add text index for search functionality
homeSchema.index({ houseName: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model("Home", homeSchema);

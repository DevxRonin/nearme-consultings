const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
      enum: [
        'IT Consulting',
        'Business Consulting',
        'Financial Consulting',
        'Legal Consulting',
        'Career Consulting',
        'Marketing Consulting',
        'Management Consulting'
      ]
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true
    },
    state: {
      type: String,
      default: 'Maharashtra'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Consultation starting price is required'],
      min: [0, 'Price must be positive']
    },
    services: {
      type: [String],
      required: [true, 'At least one service is required']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    email: {
      type: String,
      required: [true, 'Contact email is required']
    },
    images: {
      type: [String],
      default: []
    },
    workingHours: {
      type: String,
      default: 'Mon - Sat: 9:00 AM - 7:00 PM'
    },
    experienceYears: {
      type: Number,
      default: 8
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    isDemo: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// 2dsphere index for genuine geospatial queries
businessSchema.index({ location: '2dsphere' });
businessSchema.index({ name: 'text', description: 'text', services: 'text' });

module.exports = mongoose.model('Business', businessSchema);

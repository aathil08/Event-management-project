const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    category: {
      type: String,
      enum: ['Technology', 'Music', 'Business', 'Art', 'Food', 'Sports', 'Other'],
      default: 'Other',
    },
    image: {
      type: String,
      default: '',
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Must have at least 1 seat'],
    },
    bookedSeats: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual: available seats
eventSchema.virtual('availableSeats').get(function () {
  return this.totalSeats - this.bookedSeats;
});

// Virtual: is sold out
eventSchema.virtual('isSoldOut').get(function () {
  return this.bookedSeats >= this.totalSeats;
});

module.exports = mongoose.model('Event', eventSchema);

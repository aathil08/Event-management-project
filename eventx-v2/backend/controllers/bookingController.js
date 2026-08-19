const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Book tickets for an event
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { eventId, tickets } = req.body;

    if (!eventId || !tickets || tickets < 1) {
      return res.status(400).json({ message: 'Invalid booking data.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // ── Business Logic: Max 5 tickets per user per event ──────
    const existingBookings = await Booking.find({
      user: req.user._id,
      event: eventId,
      status: 'Confirmed',
    });
    const alreadyBooked = existingBookings.reduce((sum, b) => sum + b.tickets, 0);

    if (alreadyBooked + Number(tickets) > 5) {
      return res.status(400).json({
        message: `You can book max 5 tickets per event. You already have ${alreadyBooked}.`,
      });
    }

    // ── Check seat availability ────────────────────────────────
    if (event.bookedSeats + Number(tickets) > event.totalSeats) {
      return res.status(400).json({ message: 'Not enough seats available.' });
    }

    // ── Save booking and update seat count ────────────────────
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      tickets: Number(tickets),
    });

    await Event.findByIdAndUpdate(eventId, {
      $inc: { bookedSeats: Number(tickets) },
    });

    const populated = await booking.populate(['user', 'event']);

    res.status(201).json({
      message: `Successfully booked ${tickets} ticket(s)!`,
      booking: populated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get all bookings for logged-in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('event', 'title date')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Only the booking owner or admin can cancel
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    // Free up the seats
    await Event.findByIdAndUpdate(booking.event, {
      $inc: { bookedSeats: -booking.tickets },
    });

    res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking };

const Event = require('../models/Event');

// @desc    Get all events (with search, filter, pagination)
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [events, total] = await Promise.all([
      Event.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ date: 1 })
        .populate('createdBy', 'name email'),
      Event.countDocuments(query),
    ]);

    res.json({
      events,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, totalSeats } = req.body;

    if (!title || !date || !time || !location || !totalSeats) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Use uploaded file or image URL from body
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image || '';

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      totalSeats,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Event created successfully!', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const fields = ['title', 'description', 'date', 'time', 'location', 'category', 'totalSeats'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    if (req.file) event.image = `/uploads/${req.file.filename}`;
    else if (req.body.image) event.image = req.body.image;

    const updated = await event.save();
    res.json({ message: 'Event updated successfully!', event: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Also delete all bookings for this event
    const Booking = require('../models/Booking');
    await Booking.deleteMany({ event: req.params.id });

    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };

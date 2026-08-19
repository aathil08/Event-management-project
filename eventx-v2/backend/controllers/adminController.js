const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalEvents, totalUsers, totalBookings, seatsResult] = await Promise.all([
      Event.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments({ status: 'Confirmed' }),
      Booking.aggregate([
        { $match: { status: 'Confirmed' } },
        { $group: { _id: null, total: { $sum: '$tickets' } } },
      ]),
    ]);

    const totalSeatsBooked = seatsResult[0]?.total || 0;

    // Get 5 upcoming events
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5);

    // Category breakdown
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      totalEvents,
      totalUsers,
      totalBookings,
      totalSeatsBooked,
      upcomingEvents,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getDashboardStats };

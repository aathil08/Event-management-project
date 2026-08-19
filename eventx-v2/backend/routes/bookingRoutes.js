const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',       protect, createBooking);
router.get('/my',      protect, getMyBookings);
router.get('/all',     protect, adminOnly, getAllBookings);
router.delete('/:id',  protect, cancelBooking);

module.exports = router;

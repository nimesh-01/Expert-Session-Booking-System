const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/bookings', bookingController.createBooking);
router.patch('/bookings/:id/status', bookingController.updateBookingStatus);
router.get('/bookings', bookingController.getBookingsByEmail);

module.exports = router;

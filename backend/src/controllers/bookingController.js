const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

// POST /bookings
exports.createBooking = async (req, res) => {
    try {
        const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

        // Basic validation
        if (!expertId || !name || !email || !phone || !date || !timeSlot) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Verify expert exists and slot is valid
        const expert = await Expert.findById(expertId);
        if (!expert) {
            return res.status(404).json({ message: 'Expert not found' });
        }

        // Save booking. Unique index prevents double booking natively
        const newBooking = new Booking({
            expertId, name, email, phone, date, timeSlot, notes, status: 'Pending'
        });

        await newBooking.save();

        // Emit socket event to notify clients of slot change
        req.io.emit('slot_booked', { expertId, date, timeSlot });

        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error for compound index (race condition prevented)
            return res.status(409).json({ message: 'This slot is already booked.' });
        }
        res.status(500).json({ message: error.message });
    }
};

// PATCH /bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Completed'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        res.json({ message: 'Booking status updated', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /bookings?email=
exports.getBookingsByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email query parameter is required' });
        }

        const bookings = await Booking.find({ email })
            .populate('expertId', 'name category')
            .sort({ date: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Expert = require('../models/Expert');

// GET /experts (with pagination + filter)
exports.getExperts = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const experts = await Expert.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalRow = await Expert.countDocuments(query);

        res.json({
            experts,
            totalPages: Math.ceil(totalRow / limit),
            currentPage: parseInt(page),
            totalRow
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /experts/:id
exports.getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) return res.status(404).json({ message: 'Expert not found' });
        
        // Fetch all bookings for this expert to find booked slots
        const bookings = await require('../models/Booking').find({ expertId: req.params.id });
        const bookedSlots = bookings.map(b => ({ date: b.date, timeSlot: b.timeSlot }));

        res.json({
            expert,
            bookedSlots
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

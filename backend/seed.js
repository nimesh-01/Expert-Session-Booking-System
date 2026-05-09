const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expert = require('./src/models/Expert');

dotenv.config();

const experts = [
    {
        name: 'John Doe',
        category: 'Software Engineering',
        experience: 5,
        rating: 4.8,
        availableSlots: [
            { date: '2026-05-10', slots: ['10:00 AM', '11:00 AM', '02:00 PM'] },
            { date: '2026-05-11', slots: ['09:00 AM', '01:00 PM', '04:00 PM'] }
        ]
    },
    {
        name: 'Jane Smith',
        category: 'Product Management',
        experience: 8,
        rating: 4.9,
        availableSlots: [
            { date: '2026-05-10', slots: ['09:00 AM', '10:00 AM', '11:00 AM'] },
            { date: '2026-05-12', slots: ['10:00 AM', '03:00 PM', '05:00 PM'] }
        ]
    },
    {
        name: 'Alice Johnson',
        category: 'UX Design',
        experience: 4,
        rating: 4.7,
        availableSlots: [
            { date: '2026-05-10', slots: ['01:00 PM', '02:00 PM', '03:00 PM'] },
            { date: '2026-05-11', slots: ['10:00 AM', '11:00 AM'] }
        ]
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expert-booking')
    .then(async () => {
        console.log('MongoDB Connected for Seeding');
        await Expert.deleteMany({});
        await Expert.insertMany(experts);
        console.log('Experts Seeded');
        process.exit();
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');

router.get('/experts', expertController.getExperts);
router.get('/experts/:id', expertController.getExpertById);

module.exports = router;

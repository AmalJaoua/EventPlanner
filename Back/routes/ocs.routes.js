const express = require('express');
const router = express.Router();
const ocsController = require('../controllers/ocsController');
const { authenticate } = require('../middleware/auth');

// Route to create a new OC for a specific event
router.post('/:eventId', authenticate, ocsController.createOC);

// Route to fetch all OCs for a specific event
router.get('/:eventId', authenticate, ocsController.getOCsByEvent);

module.exports = router;

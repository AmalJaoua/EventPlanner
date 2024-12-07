const express = require('express');
const router = express.Router();
const { getAvailableLocalsAndMaterials } = require('../controllers/resroucesController');

router.get('/available', getAvailableLocalsAndMaterials);

module.exports = router;

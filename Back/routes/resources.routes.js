const express = require('express');
const router = express.Router();
const { getAvailableLocalsAndMaterials } = require('../controllers/resroucesController');
const { getAllLocalsWithEvents,getAllMaterialsWithEvents} = require('../controllers/eventController')
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/available', getAvailableLocalsAndMaterials);
// Route to get all Locals Admin
router.get('/adminLocals',authenticate,authorizeAdmin, getAllLocalsWithEvents);
router.get('/adminMaterials',authenticate,authorizeAdmin, getAllMaterialsWithEvents);
module.exports = router;

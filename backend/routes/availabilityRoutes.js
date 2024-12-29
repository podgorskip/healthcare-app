const express = require('express');
const router = express.Router();
const { getAvailability, addAvailability } = require('../controllers/AvailabilityController'); 

router.get('/:type', getAvailability);
router.post('/:type', addAvailability);

exports.router = router;

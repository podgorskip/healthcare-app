const express = require('express');
const router = express.Router();
const { getAvailability, addAvailability } = require('../controllers/AvailabilityController'); 
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.get('/:type', verifyToken, getAvailability);
router.post('/:type', verifyToken, addAvailability);

exports.router = router;

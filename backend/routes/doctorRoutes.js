const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/DoctorController');
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.get('/', doctorController.getDoctorsEndpoint);
router.get('/:id', verifyToken, doctorController.getDoctorByIdEndpoint);
router.post('/', verifyToken, doctorController.createDoctorEndpoint);
router.delete('/', verifyToken, doctorController.deleteDoctorEndpoint);

router.get('/:id/availability', verifyToken, doctorController.getAvailabilityEndpoint);
router.post('/:id/availability', verifyToken, doctorController.addAvailabilityEndpoint);

exports.router = router;

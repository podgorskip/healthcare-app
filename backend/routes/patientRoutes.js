const express = require('express');
const router = express.Router();

const patientController = require('../controllers/PatientController');
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.post('/', patientController.createPatientEndpoint);
router.get('/', verifyToken, patientController.getPatientByUserIdEndpoint);

exports.router = router;

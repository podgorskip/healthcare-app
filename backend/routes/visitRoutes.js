const express = require('express');
const router = express.Router();

const visitController = require('../controllers/VisitController');
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.get('/patients/:id', verifyToken, visitController.getPatientVisitsEndpoint);
router.get('/doctors/:id', verifyToken, visitController.getDoctorVisitsEndpoint);
router.post('/', verifyToken, visitController.addVisitEndpoint);
router.put('/:id/cancel', verifyToken, visitController.cancelVisitEndpoint);
router.delete('/:id', verifyToken, visitController.deleteVisitEndpoint);

exports.router = router;
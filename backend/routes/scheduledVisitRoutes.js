const express = require('express');
const router = express.Router();

const scheduledVisitController = require('../controllers/ScheduledVisitController');
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.post('/', verifyToken, scheduledVisitController.addScheduledVisit);
router.get('/', verifyToken, scheduledVisitController.getAll);
router.get('/:id', verifyToken, scheduledVisitController.getById);
router.delete('/:id', verifyToken, scheduledVisitController.deleteScheduledVisit);
router.put('/:id', verifyToken, scheduledVisitController.update);

exports.router = router;

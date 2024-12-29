const express = require('express');
const router = express.Router();

const scheduledVisitController = require('../controllers/ScheduledVisitController');

router.post('/', scheduledVisitController.addScheduledVisit);
router.get('/', scheduledVisitController.getAll);
router.get('/:id', scheduledVisitController.getById);
router.delete('/:id', scheduledVisitController.deleteScheduledVisit);

exports.router = router;

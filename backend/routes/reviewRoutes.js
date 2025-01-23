const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/ReviewController');
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.get('/doctors/:id', reviewController.getReviewsEndpoint);
router.post('/:id/comments', verifyToken, reviewController.addReviewCommentEndpoint);
router.delete('/comments/:id', verifyToken, reviewController.removeReviewCommentEndpoint);

exports.router = router;

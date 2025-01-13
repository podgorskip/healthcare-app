const Review = require('../models/Review');
const ScheduledVisit = require('../models/ScheduledVisit');

exports.addReview = async (reviewData) => {
  try {
    const visitExists = await ScheduledVisit.exists({ _id: reviewData.visit });
    if (!visitExists) {
      throw new Error('Scheduled visit does not exist.');
    }

    const review = new Review({
      id: reviewData.id,
      score: reviewData.score,
      comment: reviewData.comment,
      visit: reviewData.visit,
    });

    return await review.save();
  } catch (error) {
    throw new Error('Error adding review: ' + error.message);
  }
};

exports.removeReview = async (id) => {
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    await Review.findByIdAndDelete(id);

    return { message: 'Review successfully deleted' };
  } catch (error) {
    throw new Error('Error deleting review: ' + error.message);
  }
};

const Review = require('../models/Review');
const ScheduledVisit = require('../models/ScheduledVisit');
const User = require('../models/User');
const Comment = require('../models/Comment');

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
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }

    await Review.findByIdAndDelete(id);

    return { message: 'Review successfully deleted' };
  } catch (error) {
    throw new Error('Error deleting review: ' + error.message);
  }
};

exports.addReviewComment = async (id, commentData) => {
    try {
        const user = await User.findById(commentData.user);

        if (!user) {
          throw new Error('User not found.');
        }

        const comment = new Comment({
          comment: commentData.comment,
          user: user._id,
          date: new Date()
        });

        await comment.save();

        const review = await Review.findById(id);
        if (!review) {
            throw new Error('Review not found');
        }

        review.comments.push(comment._id);
        await review.save();
        return comment;
    } catch (error) {
        console.error('Error adding comment to review:', error);
        throw new Error('Unable to add comment to review.');
    }
};

exports.removeReviewComment = async (id) => {
  try {
    await Comment.findOneAndDelete(id);
  } catch (error) {
    console.error('Error adding comment to review:', error);
    throw new Error('Unable to add comment to review.');
  }
}

exports.getReviewsByDoctorId = async (doctorId) => {
  try {
      const reviews = await Review.find()
          .populate({
            path: 'visit',
            match: { doctor: doctorId },
            select: '_id date doctor patient',
            populate: [
                {
                    path: 'doctor',
                    select: 'firstName lastName user', 
                    populate: {
                        path: 'user', 
                        select: 'firstName lastName email'  
                    }
                },
                {
                    path: 'patient',
                    select: 'user', 
                    populate: {
                        path: 'user',  
                        select: 'firstName lastName email'  
                    }
                }
            ]
          })
          .populate({
              path: 'comments', 
              select: '_id comment user date',
              populate: {
                  path: 'user', 
                  select: '_id firstName lastName',
              },
          })
          .exec();

          const filteredReviews = reviews.filter(review => review.visit);

      return filteredReviews;
  } catch (error) {
      console.error('Error fetching reviews by doctor ID:', error);
      throw new Error('Unable to fetch reviews for the doctor.');
  }
};
const { addReviewComment, removeReviewComment, getReviewsByDoctorId } = require('../middleware/ReviewService');

exports.addReviewCommentEndpoint = async (req, res) => {
    const { id } = req.params;
    const comment = req.body;
  
    try {
      const commentData = await addReviewComment(id, comment);
      const mapped = {
        ...commentData.toObject(),
        id: commentData._id
      };
      res.status(201).json(mapped);
    } catch (error) {
      console.log('Failed to add comment to review, error: ', error);
      res.status(500).json({ message: error.message });
    }
  }
  
exports.removeReviewCommentEndpoint = async (req, res) => {
    const { id } = req.params;
  
    try {
      await removeReviewComment(id);
      res.status(204).json();
    } catch (error) {
      console.log('Failed to remove comment, error: ', error);
      res.status(500).json({ message: error.message });
    }
}

exports.getReviewsEndpoint = async (req, res) => {
    const { id } = req.params;
  
    try {
      const reviews = await getReviewsByDoctorId(id);
      const mapped = reviews.map(review => ({
        ...review.toObject(),
        id: review._id
      }));
      res.status(200).json(mapped);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(404).json({ message: error.message });
    }
}
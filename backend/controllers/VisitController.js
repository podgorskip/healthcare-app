const { getPatientVisits, getDoctorVisits, addVisit, cancelVisit, deleteVisit, addReview } = require('../middleware/VisitService');

exports.getPatientVisitsEndpoint = async (req, res) => {
    const { id } = req.params;

    try {
      const visits = await getPatientVisits(id);
      const mapped = visits.map(visit => ({
        ...visit.toObject(),
        id: visit._id
      }));
      res.status(200).json(mapped);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

exports.getDoctorVisitsEndpoint = async (req, res) => {
    const { id } = req.params;

    try {
      const visits = await getDoctorVisits(id);
      res.status(200).json(visits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

exports.addVisitEndpoint = async (req, res) => {
    const visitData = req.body;

    console.log('Data: ', visitData)

    try {
      const visit = await addVisit(visitData);
      res.status(201).json(visit);
    } catch (error) {
      console.log('Failed to add visit, error: ', error);
      res.status(500).json({ message: error.message });
    }
}

exports.cancelVisitEndpoint = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedVisit = await cancelVisit(id);
      res.status(204).json(updatedVisit);
    } catch (error) {
      console.log('Failed to cancel visit, error: ', error);
      res.status(500).json({ message: error.message });
    }
}

exports.deleteVisitEndpoint = async (req, res) => {
    const { id } = req.params;
  
    try {
      await deleteVisit(id);
      res.status(204).json();
    } catch (error) {
      console.log('Failed to delete visit, error: ', error);
      res.status(500).json({ message: error.message });
    }
}

exports.addReviewEndpoint = async (req, res) => {
  const { id } = req.params;
  const review = req.body;

  try {
    const reviewData = await addReview(id, review);
    const mapped = {
      ...reviewData.toObject(),
      id: reviewData._id
    };
    res.status(201).json(mapped);
  } catch (error) {
    console.log('Failed to add review, error: ', error);
    res.status(500).json({ message: error.message });
  }
}
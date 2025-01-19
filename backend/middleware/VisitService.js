const ScheduledVisit = require('../models/ScheduledVisit');
const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.getPatientVisits = async (id) => {
  try {
    return await ScheduledVisit.find({ patient: id }).populate('doctor');
  } catch (error) {
    throw new Error('Error fetching visits for patient: ' + error.message);
  }
}

exports.getDoctorVisits = async (id) => {
  try {
    return await ScheduledVisit.find({ doctor: id }).populate('patient');;
  } catch (error) {
    throw new Error('Error fetching visits for doctor: ' + error.message);
  }
}

exports.addVisit = async (visitData) => {
    try {
      console.log('Data doctor: ', visitData)
        const doctorExists = await mongoose.model('Doctor').exists({ _id: visitData.doctor.id });
        if (!doctorExists) {
            throw new Error('Doctor with provided ID does not exist.');
        }

        const patientExists = await mongoose.model('Patient').exists({ _id: visitData.patient.id });
        if (!patientExists) {
            throw new Error('Patient with provided ID does not exist.');
        }

        const visit = new ScheduledVisit({
            date: visitData.date,
            type: visitData.type,
            firstName: visitData.firstName,
            lastName: visitData.lastName,
            username: visitData.username,
            sex: visitData.sex,
            age: visitData.age,
            details: visitData.details,
            price: visitData.price,
            cancelled: visitData.cancelled || false,
            doctor: visitData.doctor.id,
            patient: visitData.patient.id
        });

        return await visit.save();
    } catch (error) {
        throw new Error('Error creating visit: ' + error.message);
    }
}

exports.cancelVisit = async (id) => {
    try {
      const visit = await ScheduledVisit.findById(id);
      if (!visit) {
        throw new Error('Visit not found');
      }
  
      visit.cancelled = true;
  
      return await visit.save();
    } catch (error) {
      throw new Error('Error cancelling visit: ' + error.message);
    }
}

exports.deleteVisit = async (id) => {
    try {
      const visit = await ScheduledVisit.findById(id);
      if (!visit) {
        throw new Error('Visit not found');
      }
  
      await ScheduledVisit.findByIdAndDelete(id);
  
      return { message: 'Visit successfully deleted' };
    } catch (error) {
      console.log('Failed to delete visit, error: ', error);
      throw new Error('Error deleting visit: ' + error.message);
    }
};

exports.addReview = async (id, reviewData) => {
  try {
    const visit = await ScheduledVisit.findById(id);

    console.log(visit)

    if (!visit) {
      throw Error('Visit not found.');
    }

    const review = new Review({
      score: reviewData.score,
      date: new Date(),
      comment: reviewData.comment,
      visit: visit._id
    });

    return await review.save();
  } catch (error) {
    throw new Error('Error adding review: ' + error.message);
  }
}
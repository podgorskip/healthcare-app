const Patient = require('../models/Patient'); 
const { createUser } = require('./UserService');

exports.createPatient = async (patientData) => {
    const user = await createUser(patientData, 'PATIENT');
    const patient = new Patient({ 
        user: user._id, 
        cart: []
    });

    return await patient.save();
};

exports.getPatientByUserId = async (userId) => {
  try {
    const patient = await Patient.findOne({ user: userId })
      .populate('user', 'id firstName lastName username role -password') 
      .populate('cart');

    return patient;
  } catch (error) {
    console.error('Error fetching patient by user ID:', error);
    throw error;
  }
};

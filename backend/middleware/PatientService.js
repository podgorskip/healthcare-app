const Cart = require('../models/Cart');
const Patient = require('../models/Patient'); 
const { createUser } = require('./UserService');

exports.createPatient = async (patientData) => {
    const user = await createUser(patientData.user, 'PATIENT');

    const cart = new Cart({
      items: [] 
    });

    return cart.save().then((savedCart) => {
      const patient = new Patient({
          user: user._id,
          cart: savedCart._id
      });
      return patient.save();
    }).catch((error) => {
        console.error('Error saving cart or patient:', error);
        throw new Error('Failed to create patient');
    });
};

exports.getPatientByUserId = async (userId) => {
  try {
    console.log('Retrieving patient: ', userId);
    const patient = await Patient.findOne({ user: userId })
      .populate('user', 'firstName lastName username role banned')
      .populate({
        path: 'cart',
        select: '_id items',
        populate: {
          path: 'items',
          select: '_id date type firstName lastName username sex age details price doctor',
          populate: {
            path: 'doctor',
            select: '_id'
          }
        }
      });

    console.log(patient)

    if (!patient) {
        throw new Error('Patient not found');
    }
    return patient;
  } catch (error) {
      console.error(`Error finding patient by user ID: ${error.message}`);
      throw error;
  }
};

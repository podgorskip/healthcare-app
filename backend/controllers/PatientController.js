const Patient = require('../models/Patient'); 

exports.createPatient = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ message: 'User and cart are required' });
    }

    const newPatient = new Patient({
      user,
      [],
    });

    // Save the patient to the database
    await newPatient.save();

    // Respond with the created patient
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

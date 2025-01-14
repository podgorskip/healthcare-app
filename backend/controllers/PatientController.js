const { createPatient, getPatientByUserId } = require('../middleware/PatientService');

exports.createPatientEndpoint = async (req, res) => {
  try {
    const user = req.body;

    if (!user) {
      return res.status(400).json({ message: 'User is required' });
    }

    const patient = await createPatient(user);
    res.status(201).json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPatientByUserIdEndpoint = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const patient = await getPatientByUserId(userId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient by user ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
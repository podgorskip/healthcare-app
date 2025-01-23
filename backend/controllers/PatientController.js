const { createPatient, getPatientByUserId } = require('../middleware/PatientService');

exports.createPatientEndpoint = async (req, res) => {
  try {
    const user = req.body;

    console.log('User: ', user)

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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const patient = await getPatientByUserId(id);
    const mapped = {
      ...patient.toObject(),
      id: patient._id,
      cart: {
        ...patient.cart.toObject(),
        id: patient.cart._id,
        items: patient.cart.items.map(item => ({
          ...item.toObject(),
          id: item._id, 
          doctor: {
            id: item.doctor._id
          }
        })),
      },
    }

    if (!mapped) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(mapped);
  } catch (error) {
    console.error('Error fetching patient by user ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
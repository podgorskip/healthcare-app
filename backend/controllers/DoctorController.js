const { 
    createDoctor, 
    getDoctors, 
    removeDoctor, 
    findDoctorById, 
    getAvailabilityByDoctorId, 
    addAvailabilityForDoctor, 
    getDoctorByUserId,
} = require('../middleware/DoctorService');
  
exports.createDoctorEndpoint = async (req, res) => {
  try {
    const doctorData = req.body;

    if (!doctorData.user || !doctorData.phoneNo) {
      return res.status(400).json({ message: 'User is required' });
    }

    const doctor = await createDoctor(doctorData);
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDoctorsEndpoint = async (req, res) => {
    try {
        const doctors = await getDoctors();
        
        const mapped = doctors.map(doctor => ({
            ...doctor.toObject(), 
            id: doctor._id,      
            user: {
                ...doctor.user.toObject(),
                id: doctor.user._id
            }
        }));

        res.status(200).json(mapped);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


exports.getDoctorByIdEndpoint = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await findDoctorById(id);
        const mapped = {
            ...doctor.toObject(),
            id: doctor._id
        }
        res.status(200).json(mapped);
    } catch (error) {
        console.error('Error removing doctor:', error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteDoctorEndpoint = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await removeDoctor(id);
        res.status(200).json({ message: 'Doctor and associated user removed successfully', doctor });
    } catch (error) {
        console.error('Error removing doctor:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAvailabilityEndpoint = async (req, res) => {
    const { id } = req.params; 
    const { type } = req.query;

    console.log(`.getAvailability - invoked, doctorId=${id}, type=${type}`);

    try {
        const availability = await getAvailabilityByDoctorId(id, type);

        if (availability.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(availability);
    } catch (err) {
        console.error('Error fetching availability:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addAvailabilityEndpoint = async (req, res) => {
    const { id } = req.params;  
    const { type } = req.query;
    const availabilities = req.body;       

    if (!availabilities || !Array.isArray(availabilities)) {
        return res.status(400).json({ message: 'Availability data is required and must be an array' });
    }

    console.log(`.addAvailability - invoked, doctorId=${id}, type=${type}`);

    try {
        const doctor = await addAvailabilityForDoctor(id, type, availabilities);
        res.status(201).json(doctor);
    } catch (err) {
        console.error('Error adding availability:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDoctorByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await getDoctorByUserId(id);
        res.status(200).json(doctor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
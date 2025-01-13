const { getPatientVisits, getDoctorVisits, addVisit, cancelVisit, deleteVisit } = require('../middleware/VisitService');

exports.getPatientVisitsEndpoint = async (req, res) => {
    const { id } = req.params;

    try {
      const visits = await getPatientVisits(id);
      res.status(200).json(visits);
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
    const { visitData, patientId, doctorId } = req.body;

    try {
        const visit = await addVisit(visitData, patientId, doctorId);
        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.cancelVisitEndpoint = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedVisit = await cancelVisit(id);
      res.status(204).json(updatedVisit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

exports.deleteVisitEndpoint = async (req, res) => {
    const { id } = req.params;
  
    try {
      await deleteVisit(id);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}
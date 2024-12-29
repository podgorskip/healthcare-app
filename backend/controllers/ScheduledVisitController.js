const ScheduledVisit = require('../models/ScheduledVisit');

exports.addScheduledVisit = async (req, res) => {
  console.log('.addScheduledVisit - invoked');
  
  const { date, type, details, price } = req.body;
  try {
    const visit = new ScheduledVisit({ date, type, details, price });
    await visit.save(); 
    console.log('.addScheduledVisit - invoked, id=', visit._id);
    res.status(201).json(visit._id);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAll = async (req, res) => {
  console.log('.getAll - invoked');

  try {
    const visits = await ScheduledVisit.find();  

    const transformedVisits = visits.map(item => {
      return {
        id: item._id,
        date: item.date,
        type: item.type,
        details: item.details,
        price: item.price
      };
    });
    
    res.status(200).json(transformedVisits);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteScheduledVisit = async (req, res) => {
  const { id } = req.params;

  console.log(`.deleteScheduledVisit - invoked, visit id=${id}`);

  try {
    const visit = await ScheduledVisit.findByIdAndDelete(id); 

    if (!visit) {
      console.log(`Visit with id ${id} not found.`);
      return res.status(404).json({ message: 'Scheduled visit not found' });
    }

    res.status(200).json({ message: 'Scheduled visit deleted successfully' });  
  } catch (err) {
    console.log('Error: ', err); 
    res.status(500).json({ message: 'Server error' });  
  }
}

exports.getById = async (req, res) => {
  const { id } = req.params; 

  console.log(`.getById - invoked, visit id=${id}`);

  try {
    const visit = await ScheduledVisit.findById(id); 

    if (!visit) {
      console.log(`Visit with id ${id} not found.`);
      return res.status(404).json({ message: 'Scheduled visit not found' });  
    }

    const transformedVisit =  {
      id: visit._id,
      date: visit.date,
      type: visit.type,
      details: visit.details,
      price: visit.price
    };

    res.status(200).json(transformedVisit);  
  } catch (err) {
    console.log('Error: ', err);  
    res.status(500).json({ message: 'Server error' });  
  }
};
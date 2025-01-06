const ScheduledVisit = require('../models/ScheduledVisit');

exports.addScheduledVisit = async (req, res) => {
  console.log('.addScheduledVisit - invoked');
  
  const { date, type, details, price, firstName, lastName, username, sex, age, cancelled } = req.body;
  try {
    const visit = new ScheduledVisit({ date, type, details, price, firstName, lastName, username, sex, age, cancelled });
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
        price: item.price,
        firstName: item.firstName,
        lastName: item.lastName,
        username: item.username,
        sex: item.sex,
        age: item.age,
        cancelled: item.cancelled
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
      price: visit.price,
      firstName: visit.firstName,
      lastName: visit.lastName,
      username: visit.username,
      sex: visit.sex,
      age: visit.age,
      cancelled: visit.cancelled
    };

    res.status(200).json(transformedVisit);  
  } catch (err) {
    console.log('Error: ', err);  
    res.status(500).json({ message: 'Server error' });  
  }
};

exports.update = async (req, res) => {
  const { id } = req.params; 
  const { date, type, details, price, firstName, lastName, username, sex, age, cancelled } = req.body; 

  console.log(`.update - invoked, visit id=${id}`);

  try {
    const visit = await ScheduledVisit.findByIdAndUpdate(
      id, 
      { date, type, details, price, firstName, lastName, username, sex, age, cancelled },
      { new: true, runValidators: true } 
    );

    if (!visit) {
      console.log(`Visit with id ${id} not found.`);
      return res.status(404).json({ message: 'Scheduled visit not found' }); 
    }

    console.log(`.update - visit updated, id=${id}`);
    res.status(200).json({
      id: visit._id,
      date: visit.date,
      type: visit.type,
      details: visit.details,
      price: visit.price,
      firstName: visit.firstName,
      lastName: visit.lastName,
      username: visit.username,
      sex: visit.sex,
      age: visit.age,
      cancelled: visit.cancelled,
    }); 
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({ message: 'Server error' }); 
  }
};

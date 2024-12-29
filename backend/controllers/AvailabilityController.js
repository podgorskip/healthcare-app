const Availability = require('../models/Availability');

exports.getAvailability = async (req, res) => {
    const { type } = req.params; 

    console.log(`.getAvailability - invoked, type=${type}`);
    
    try {
      const availability = await Availability.find({ type }); 
      
      if (!availability || availability.length === 0) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(availability); 
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Server error' }); 
    }
};

exports.addAvailability = async (req, res) => {
    const { type } = req.params;

    if (!['presence', 'absence'].includes(type)) {
        return res.status(400).json({ message: 'Invalid type, must be "presence" or "absence"' });
    }

    console.log(`.addAvailability - invoked, type=${type}`);

    const availabilities = req.body;

    try {
        let availability = await Availability.findOne({ type });

        if (availability) {
            availability.availabilities.push(...availabilities);
        } else {
            availability = new Availability({
                type,
                availabilities,
            });
        }

        await availability.save();

        res.status(201).json(availability);
    } catch (err) {
        console.error('Error adding availability:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
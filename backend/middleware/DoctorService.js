const Doctor = require('../models/Doctor'); 
const User = require('../models/User'); 
const SingleDay = require('../models/SingleDay');
const TimeSlot = require('../models/Slot');
const { createUser } = require('./UserService');

exports.createDoctor = async (doctorData) => {
    const user = await createUser(doctorData.user, 'DOCTOR');

    const doctor = new Doctor({ 
        user: user._id, 
        phoneNo: doctorData.phoneNo,
        availability: {
            presence: [],
            absence: []
        }
    });

    return await doctor.save();
};

exports.getDoctors = async () => {
    return await Doctor.find().populate('user', 'firstName lastName username role banned');
};

exports.findDoctorById = async (userId) => {
    try {
        const doctor = await Doctor.findOne({ user: userId }).populate('user', 'firstName lastName username role');
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return doctor;
    } catch (error) {
        console.error(`Error finding doctor by user ID: ${error.message}`);
        throw error;
    }
};

exports.removeDoctor = async (id) => {
    try {
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const user = await User.findByIdAndDelete(doctor.user);

        if (!user) {
            console.warn(`User with ID ${doctor.user} not found, but proceeding with doctor deletion.`);
        }

        await Doctor.findByIdAndDelete(id);

        return doctor;
    } catch (error) {
        console.error(`Error removing doctor: ${error.message}`);
        throw error;
    }
};

exports.getAvailabilityByDoctorId = async (id, type) => {
    try {
        const doctor = await Doctor.findById(id).populate({
            path: `availability.${type}`,
            populate: { path: 'slots', model: 'TimeSlot' },  
        });

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        return doctor.availability[type] || [];
    } catch (err) {
        console.error('Error fetching availability:', err);
        throw err;
    }
};

exports.addAvailabilityForDoctor = async (id, type, availabilities) => {
    if (!['presence', 'absence'].includes(type)) {
        throw new Error('Invalid availability type');
    }

    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const singleDayDocs = await Promise.all(availabilities.map(async (day) => {
            const timeSlotDocs = await Promise.all(day.slots.map(async (slot) => {
                const timeSlot = new TimeSlot({
                    id: slot.id,
                    from: slot.from,
                    to: slot.to,
                });
                return await timeSlot.save(); 
            }));

            const singleDay = new SingleDay({
                date: day.date,
                slots: timeSlotDocs.map(slot => slot._id), 
            });

            return await singleDay.save(); 
        }));

        doctor.availability[type].push(...singleDayDocs);
        await doctor.save();  

        return doctor; 
    } catch (err) {
        console.error('Error adding availability:', err);
        throw err;
    }
};

exports.getDoctorByUserId = async (userId) => {
    try {
        const doctor = await Doctor.findOne({ user: userId }).populate('user', 'firstName lastName username role');
        if (!doctor) {
            throw new Error('Doctor not found for the given user ID');
        }
        return doctor;
    } catch (error) {
        console.error(`Error finding doctor by user ID: ${error.message}`);
        throw error;
    }
};

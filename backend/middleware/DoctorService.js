const Doctor = require('../models/Doctor'); 
const User = require('../models/User'); 
const SingleDay = require('../models/SingleDay');
const TimeSlot = require('../models/Slot');
const { createUser } = require('./UserService');
const { notifyAvailabilityUpdate, notifyCancelVisit } = require('./NotificationService');
const ScheduledVisit = require('../models/ScheduledVisit');

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

        if (type === 'absence') {
            for (const day of availabilities) {
                const absenceDate = new Date(day.date); 

                const normalizedAbsenceDate = new Date(absenceDate);
                normalizedAbsenceDate.setHours(0, 0, 0, 0);
                
                const scheduledVisits = await ScheduledVisit.find({
                  doctor: id,
                  'date.day': {
                    $gte: normalizedAbsenceDate,
                    $lt: new Date(normalizedAbsenceDate.getTime() + 24 * 60 * 60 * 1000) // next day
                  },
                  cancelled: false,
                });
              
                for (const visit of scheduledVisits) {
                    const conflictingSlots = visit.date.filter((visitSlot) => {
                        const visitHour = visitSlot.hour;

                        return day.slots.some((absenceSlot) => {
                            const absenceFrom = parseHour(absenceSlot.from);
                            const absenceTo = parseHour(absenceSlot.to);

                            return visitHour >= absenceFrom && visitHour < absenceTo;
                        });
                    });

                    if (conflictingSlots.length > 0) {
                        visit.cancelled = true;
                        notifyCancelVisit(visit.id, visit);
                        await visit.save();
                    }
                }
            }
        }

        doctor.availability[type].push(...singleDayDocs);
        await doctor.save();

        const availability = await exports.getAvailabilityByDoctorId(id, type);
        notifyAvailabilityUpdate(id, type, availability);

        return doctor;
    } catch (err) {
        console.error('Error adding availability:', err);
        throw err;
    }
};

function parseHour(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60; 
}

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

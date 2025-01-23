const { getBroadcast } = require('./WebSocket');

const notifyAvailabilityUpdate = (doctorId, type, availability) => {
    const broadcast = getBroadcast();
    if (broadcast) {
        console.log(`Broadcasting to: availability-${doctorId}-${type}`)
        broadcast({
            type: `availability-${doctorId}-${type}`,
            data: { availability }
        });
    } else {
        console.error('Broadcast function not initialized');
    }
};

const notifyVisitUpdate = (doctorId, visits) => {
    const broadcast = getBroadcast();
    if (broadcast) {
        console.log(`Broadcasting to: visit-${doctorId}`)
        broadcast({
            type: `visit-${doctorId}`,
            data: { visits }
        });
    } else {
        console.error('Broadcast function not initialized');
    }
}

const notifyCancelVisit = (id, visit) => {
    const broadcast = getBroadcast();
    if (broadcast) {
        console.log(`Broadcasting to: visit-${id}-cancellation`)
        broadcast({
            type: `visit-${id}-cancellation`,
            data: { visit }
        });
    } else {
        console.error('Broadcast function not initialized');
    }
}

module.exports = {
    notifyAvailabilityUpdate,
    notifyVisitUpdate,
    notifyCancelVisit
};

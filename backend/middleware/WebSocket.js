const WebSocket = require('ws');

let clients = [];
let broadcastFn = null; 

const createWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');
        clients.push(ws);

        ws.on('message', (message) => {
            console.log(`Received: ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            clients = clients.filter(client => client !== ws);
        });
    });

    const broadcast = (message) => {
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    };

    broadcastFn = broadcast;

    return {
        broadcast
    };
};

module.exports = {
    createWebSocketServer,
    getBroadcast: () => broadcastFn
};

import { WebSocketServer, WebSocket } from 'ws';

function heartbeat() {
    this.isAlive = true;
}

const wss = new WebSocketServer({ port: 80 });

wss.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('error', console.error);

    ws.on('message', function message(data) {
        // Broadcast to all clients
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                ws.send(data.toString(), (err) => {
                    if (err) {
                        console.error('Send error:', err);
                    }
                });
            }
        });
    });
});

// Set up a heartbeat interval to check if clients are alive
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            console.log('Terminating client due to no pong');
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping(); // Send a ping to the client
    });
}, 30000); // Adjust the interval as needed

wss.on('close', function close() {
    clearInterval(interval);
});

import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 80 });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        // Broadcast to all clients
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Broadcast message: ${data}`);
            }
        });
    });
});

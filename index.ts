import { createServer, IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const sseClients: Set<ServerResponse> = new Set();

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        sseClients.add(res);

        req.on('close', () => {
            sseClients.delete(res);
        });
    } else {
        res.writeHead(404).end();
    }
});

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (data) => {
        // Relay WebSocket messages to all SSE clients
        for (const client of sseClients) {
            client.write(`data: ${data}\n\n`);
        }
    });
});

server.listen(80, () => {
    console.log('SSE server running on http://localhost:80');
});

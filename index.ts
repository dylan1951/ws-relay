import { createServer, Http2ServerResponse } from 'http2';

const sseClients: Set<Http2ServerResponse> = new Set();

const server = createServer((req, res) => {
    const { method, url } = req;

    if (url === '/events') {
        // Handle SSE client connections
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        sseClients.add(res);

        req.on('close', () => {
            sseClients.delete(res);
        });
    } else if (url === '/ingest' && method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // Relay ingested data to all SSE clients
            for (const client of sseClients) {
                client.write(`data: ${body}\n\n`);
            }
            res.writeHead(204).end();
        });
    } else {
        res.writeHead(404).end();
    }
});

server.listen(80, () => {
    console.log('HTTP/2 Server running on http://localhost:80');
});

import Fastify from 'fastify'
import { FastifySSEPlugin } from 'fastify-sse-v2';
import { EventEmitter, on } from 'events';
import ingestRoutes from './routes/ingest';

const eventEmitter = new EventEmitter();

const server = Fastify({ logger: true, http2: true });

server.register(FastifySSEPlugin);
server.register(ingestRoutes, { prefix: '/ingest', eventEmitter });

server.get('/events', (req, res) => {
    res.sse(
        (async function* () {
            for await (const [event] of on(eventEmitter, 'event')) {
                yield event;
            }
        })()
    );
});

server.listen({ port: 80, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`);
});

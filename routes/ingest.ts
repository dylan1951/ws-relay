import { FastifyInstance } from 'fastify';
import { EventEmitter } from 'events';

export default async function ingestRoutes(server: FastifyInstance, opts: { eventEmitter: EventEmitter }) {
    const {eventEmitter} = opts;

    server.post('/tweet', (req, res) => {
        res.status(204).send();

        eventEmitter.emit('event', {
            event: 'tweet',
            data: JSON.stringify(req.body),
        });
    });

    server.post('/article', (req, res) => {
        res.status(204).send();

        eventEmitter.emit('event', {
            event: 'article',
            data: JSON.stringify(req.body),
        });
    });
}

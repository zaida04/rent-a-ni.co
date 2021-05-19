import fastify, { FastifyInstance } from 'fastify';
import home from './routes/home';
import redirects from './routes/redirects';
import * as Util from './util';
import { RESPONSES } from './schemas';
import type { Server, IncomingMessage, ServerResponse } from 'http';
import dbEnvironment from '../knexfile.js';
import fastifyStatic from 'fastify-static';
import { join } from 'path';
import type { APPLICATION_CONTEXT } from './typings';

const server: FastifyInstance = fastify<Server, IncomingMessage, ServerResponse>({
	logger: process.env.NODE_ENV === 'development'
});
const database = Util.connectToDB(dbEnvironment[process.env.NODE_ENV ?? 'development']);
const context: APPLICATION_CONTEXT = {
	PORT: Number(process.env.PORT) ?? 4000,
	DATABASE: database
};
server.register(fastifyStatic, {
	root: join(__dirname, '..', 'public/')
});
const homeRouter = home(context);
const redirectsRouter = redirects(context);

server.get('/', RESPONSES.HOME, homeRouter.get);
server.post('/redirects', RESPONSES.REDIRECT_CREATE, redirectsRouter.post);
server.get('/shrt/:nanoId', redirectsRouter.get);
server.delete('/shrt/:nanoId', RESPONSES.REDIRECT_DELETE, redirectsRouter.del);

server.listen(context.PORT, '0.0.0.0', (e) => {
	if (e) throw e;
	return console.log('Server started!');
});

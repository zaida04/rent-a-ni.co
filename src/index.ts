import fastify from 'fastify';
import home from './routes/home';
import redirects from './routes/redirects';
import * as Util from './util';
import { RESPONSES } from './schemas';
import type { APPLICATION_CONTEXT } from './typings';
import type { Server, IncomingMessage, ServerResponse } from 'http';
import dbEnvironment from '../knexfile.js';

const server = fastify<Server, IncomingMessage, ServerResponse>({
	logger: process.env.NODE_ENV === 'development'
});
const database = Util.connectToDB(dbEnvironment[process.env.NODE_ENV ?? 'development']);
const context: APPLICATION_CONTEXT = {
	PORT: Number(process.env.PORT),
	DATABASE: database
};
const homeRouter = home(context);
const redirectsRouter = redirects(context);

server.get('/', RESPONSES.HOME, homeRouter.get);
server.post('/redirects', RESPONSES.REDIRECT_CREATE, redirectsRouter.post);
server.get('/redirects/:redirectID', RESPONSES.REDIRECT_GET, redirectsRouter.get);
server.delete('/redirects/:redirectID', RESPONSES.REDIRECT_DELETE, redirectsRouter.del);

server.listen(context.PORT, (e) => {
	if (e) throw e;
	return console.log('Server started!');
});

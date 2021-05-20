const requiredEnvs = ['PORT', 'ALLOWED_IP', 'JWT_KEY'];
const development = process.env.NODE_ENV !== 'production';

if (!development) requiredEnvs.push('DATABASE_URL');

requiredEnvs.forEach((envVar) => {
	if (!process.env[envVar]) throw new Error(`Missing env var ${envVar}!`);
});

import fastify, { FastifyInstance } from 'fastify';
import home from './routes/home';
import redirects from './routes/redirects';
import account from './routes/account';
import * as Util from './util';
import { RESPONSES } from './schemas';
import type { Server, IncomingMessage, ServerResponse } from 'http';
import dbEnvironment from '../knexfile.js';
import fastifyStatic from 'fastify-static';
import { join } from 'path';
import type { APPLICATION_CONTEXT } from './typings';

const server: FastifyInstance = fastify<Server, IncomingMessage, ServerResponse>({
	logger: development
});
const database = Util.connectToDB(dbEnvironment[process.env.NODE_ENV ?? 'development']);
const context: APPLICATION_CONTEXT = {
	PORT: Number(process.env.PORT) ?? 4000,
	DATABASE: database,
	ALLOWED_IP: process.env.ALLOWED_IP,
	JWT_KEY: process.env.JWT_KEY
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
server.register(require('fastify-rate-limit'), {
	max: 10,
	timeWindow: '1 minute'
});

server.register(fastifyStatic, {
	root: join(__dirname, '..', 'public/')
});
const homeRouter = home(context);
const redirectsRouter = redirects(context);
const accountRouter = account(context);

// glue blocking since i'm too lazy to implement an actual auth system

server.register(
	(apiRoutes, _opts, done) => {
		// home message
		apiRoutes.get('/', RESPONSES.HOME, homeRouter.get);
		// create a redirect
		apiRoutes.post('/redirects', RESPONSES.REDIRECT_CREATE, redirectsRouter.post);
		// delete a redirect
		apiRoutes.delete('/s/:nanoId', RESPONSES.REDIRECT_DELETE, redirectsRouter.del);
		apiRoutes.register(
			(accountRoutes, __opts, done) => {
				// create an account
				accountRoutes.post('/', RESPONSES.ACCOUNT_CREATE, accountRouter.post);
				// login to an account
				accountRoutes.post('/login', RESPONSES.ACCOUNT_LOGIN, accountRouter.login_post);
				done();
			},
			{ prefix: 'accounts' }
		);
		done();
	},
	{ prefix: 'api/v1' }
);

// go to a redirect
server.get('/s/:nanoId', redirectsRouter.get);
// home page
server.get('/', async (_, res) => {
	return res.sendFile('index.html');
});

server.listen(context.PORT, '0.0.0.0', (e) => {
	if (e) throw e;
	return console.log('Server started!');
});

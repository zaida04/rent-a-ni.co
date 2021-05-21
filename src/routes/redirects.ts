import type {
	APPLICATION_CONTEXT,
	ILink,
	REDIRECT_CREATE,
	REDIRECT_DELETE,
	REDIRECT_GET,
	Req,
	Res
} from '../typings';

import { v4 } from 'uuid';
import { nanoid } from 'nanoid';
import { isAuth } from '../util';

export default function homeRouter(context: APPLICATION_CONTEXT) {
	return {
		get: async (req: Req<REDIRECT_GET>, res: Res<REDIRECT_GET>) => {
			// find the redirect in the database
			const redirect = await context
				.DATABASE<ILink>('links')
				.where({ nanoId: req.params.nanoId })
				.first();

			// if no redirect, 404
			if (!redirect) return res.sendFile('404.html');

			// redirect user to the destination
			return res.redirect(redirect.destination);
		},
		post: async (req: Req<REDIRECT_CREATE>, res: Res<REDIRECT_CREATE>) => {
			// check if request is authenticated (TODO: make it a route level thing and not a function level thing)
			const authRes = await isAuth(req, res, context);
			if (!authRes[0])
				return res.status(401).send({ statusCode: 401, error: 'BAD_AUTH', message: authRes[1] });

			const { destination } = req.body;

			// uuid to identify the redirect
			const id = v4();

			// short id to make accessible through URL
			const short_id = nanoid(8);

			await context.DATABASE<ILink>('links').insert({
				id,
				nanoId: short_id,
				destination
			});

			return res.status(200).send({
				id,
				nanoId: short_id,
				// if in dev, show the destination for debugging purposes
				destination: process.env.NODE_ENV === 'development' ? destination : undefined
			});
		},
		del: async (req: Req<REDIRECT_DELETE>, res: Res<REDIRECT_DELETE>) => {
			// check if request is authenticated (TODO: make it a route level thing and not a function level thing)
			const authRes = await isAuth(req, res, context);
			if (!authRes[0])
				return res.status(401).send({ statusCode: 401, error: 'BAD_AUTH', message: authRes[1] });

			// check if redirect is in the db
			const redirect = await context
				.DATABASE<ILink>('links')
				.where({ nanoId: req.params.nanoId })
				.first();

			// if redirect isn't in the db, reject
			if (!redirect)
				return res
					.status(404)
					.send({ statusCode: 404, error: 'REDIRECT_NOT_FOUND', message: 'redirect not found' });

			await context.DATABASE<ILink>('links').where('id', redirect.id).del();

			return res.status(200).send({
				id: redirect.id,
				shorthand_id: redirect.nanoId
			});
		}
	};
}

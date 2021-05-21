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
			const redirect = await context
				.DATABASE<ILink>('links')
				.where({ nanoId: req.params.nanoId })
				.first();
			if (!redirect) return res.sendFile('404.html');
			return res.redirect(redirect.destination);
		},
		post: async (req: Req<REDIRECT_CREATE>, res: Res<REDIRECT_CREATE>) => {
			const authRes = await isAuth(req, res, context);
			console.log(authRes);
			if (!authRes[0]) return res.status(401).send({ message: authRes[1] });
			const { destination } = req.body;
			const id = v4();
			const short_id = nanoid(8);

			await context.DATABASE<ILink>('links').insert({
				id,
				nanoId: short_id,
				destination
			});

			return res.status(200).send({
				id,
				nanoId: short_id,
				destination: process.env.NODE_ENV === 'development' ? destination : undefined
			});
		},
		del: async (req: Req<REDIRECT_DELETE>, res: Res<REDIRECT_DELETE>) => {
			const authRes = await isAuth(req, res, context);
			if (!authRes[0]) return res.status(401).send({ message: authRes[1] });
			const redirect = await context
				.DATABASE<ILink>('links')
				.where({ nanoId: req.params.nanoId })
				.first();

			if (!redirect) return res.status(400).send();

			return res.status(200).send({
				id: 'test',
				shorthand_id: 'test'
			});
		}
	};
}

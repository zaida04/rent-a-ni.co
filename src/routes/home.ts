import type { APPLICATION_CONTEXT, HOME_GET, Req, Res } from '../typings';

export default function homeRouter(_context: APPLICATION_CONTEXT) {
	return {
		get: async (_req: Req<HOME_GET>, res: Res<HOME_GET>) => {
			return res.status(200).send({
				message: 'Welcome to the rent-a-ni.co API!'
			});
		}
	};
}

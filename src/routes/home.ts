import type { APPLICATION_CONTEXT, Req, Res } from '../typings';

export default function homeRouter(_context: APPLICATION_CONTEXT) {
	return {
		get: async (_req: Req, res: Res) => {
			return res.status(200).send({
				message: 'Welcome to the rent-a-ni.co API!'
			});
		}
	};
}

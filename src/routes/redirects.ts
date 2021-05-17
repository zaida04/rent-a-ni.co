import type { APPLICATION_CONTEXT, Req, Res } from '../typings';

export default function homeRouter(context: APPLICATION_CONTEXT) {
	return {
		get: async (req: Req, res: Res) => {
			return res.send({});
		},
		post: async (req: Req, res: Res) => {
			return res.status(200).send({
				id: 'test',
				shorthand_id: 'test'
			});
		},
		del: async (req: Req, res: Res) => {
			return res.status(200).send({
				id: 'test',
				shorthand_id: 'test'
			});
		}
	};
}

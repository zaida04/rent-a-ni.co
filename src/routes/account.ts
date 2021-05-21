import { APPLICATION_CONTEXT, ACCOUNT_CREATE, ACCOUNT_LOGIN, Req, Res, IUser } from '../typings';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { createFormattedJWT } from '../util';

export default function homeRouter(context: APPLICATION_CONTEXT) {
	return {
		post: async (req: Req<ACCOUNT_CREATE>, res: Res<ACCOUNT_CREATE>) => {
			const { email, username, password } = req.body;

			const existingAccount = await context
				.DATABASE<IUser>('users')
				.where('username', username)
				.orWhere('email', email)
				.first();

			if (existingAccount)
				return res.status(409).send({
					message: 'User with that email or username already exists!'
				});
			const id = v4();
			const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
			const tokenLastUpdatedAt = new Date();
			const token = createFormattedJWT({ id, tokenLastUpdatedAt }, context.JWT_KEY);

			await context.DATABASE<IUser>('users').insert({
				id,
				email,
				username,
				password: hashedPassword,
				token,
				tokenLastUpdatedAt: tokenLastUpdatedAt.toUTCString()
			});

			return res.status(200).send({ token });
		},
		login_post: async (req: Req<ACCOUNT_LOGIN>, res: Res<ACCOUNT_LOGIN>) => {
			const { username, password } = req.body;
			console.log(1);
			const checkIfUserExists = await context
				.DATABASE<IUser>('users')
				.where('username', username)
				.first();

			if (!checkIfUserExists)
				return res.status(404).send({ message: 'User with that username does not exist!' });

			if (!(await bcrypt.compare(password, checkIfUserExists.password)))
				return res.status(401).send({ message: 'Invalid username/password!' });

			const tokenLastUpdatedAt = new Date();

			const token = createFormattedJWT(
				{ id: checkIfUserExists.id, tokenLastUpdatedAt },
				context.JWT_KEY
			);
			await context
				.DATABASE<IUser>('users')
				.where('id', checkIfUserExists.id)
				.update({ token: token, tokenLastUpdatedAt: tokenLastUpdatedAt.toUTCString() });

			return res.status(200).send({ token });
		}
	};
}

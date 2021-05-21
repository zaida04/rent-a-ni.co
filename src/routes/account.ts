/**
 *
 * "Why do you store the last time a token was updated?"
 * Because, for extra authentication, if the JWT_KEY somehow gets leaked, even if someone were to generate
 * themseles a valid JWT, they would *also* need access to the database to get the last token updated date.
 * As the last token updated date part of the JWT is matched with info from the db.
 * Think of it like a second layer of security in the JWT_KEY
 *
 */

import { APPLICATION_CONTEXT, ACCOUNT_CREATE, ACCOUNT_LOGIN, Req, Res, IUser } from '../typings';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { createFormattedJWT } from '../util';

export default function homeRouter(context: APPLICATION_CONTEXT) {
	return {
		post: async (req: Req<ACCOUNT_CREATE>, res: Res<ACCOUNT_CREATE>) => {
			const { email, username, password } = req.body;

			// get existing account record
			const existingAccount = await context
				.DATABASE<IUser>('users')
				.where('username', username)
				.orWhere('email', email)
				.first();

			// if account exist, reject
			if (existingAccount)
				return res.status(409).send({
					statusCode: 409,
					error: 'USER_ALREADY_EXISTS',
					message: 'User with that email or username already exists!'
				});

			// user ID
			const id = v4();

			// encrypt password
			const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

			// token creation date
			const tokenLastUpdatedAt = new Date();

			// create the user JWT
			const token = createFormattedJWT({ id, tokenLastUpdatedAt }, context.JWT_KEY);

			// insert user into database
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

			const checkIfUserExists = await context
				.DATABASE<IUser>('users')
				.where('username', username)
				.first();

			if (!checkIfUserExists)
				return res.status(404).send({
					statusCode: 404,
					error: 'USER_NOT_FOUND',
					message: 'User with that username does not exist!'
				});

			// compare hashed password to supplied password
			if (!(await bcrypt.compare(password, checkIfUserExists.password)))
				return res.status(401).send({
					statusCode: 401,
					error: 'INCORRECT_PASSWORD',
					message: 'Invalid username/password!'
				});

			// token creation date
			const tokenLastUpdatedAt = new Date();

			const token = createFormattedJWT(
				{ id: checkIfUserExists.id, tokenLastUpdatedAt },
				context.JWT_KEY
			);

			// update user data with new token and the last updated time
			await context
				.DATABASE<IUser>('users')
				.where('id', checkIfUserExists.id)
				.update({ token: token, tokenLastUpdatedAt: tokenLastUpdatedAt.toUTCString() });

			return res.status(200).send({ token });
		}
	};
}

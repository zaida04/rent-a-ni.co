import knex, { Knex } from 'knex';
import { sign } from 'jsonwebtoken';

export function connectToDB(config: {
	client: string;
	connection: string | { filename: string };
	pool?: { min: number; max: number };
}): Knex {
	return knex(config);
}

export function createFormattedJWT(
	{ id, tokenLastUpdatedAt }: { id: string; tokenLastUpdatedAt: Date },
	JWT_KEY: string
): string {
	return sign(`${id}::${tokenLastUpdatedAt.toUTCString()}`, JWT_KEY);
}

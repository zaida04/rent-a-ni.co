import knex, { Knex } from 'knex';

export function connectToDB(config: {
	client: string;
	connection: string | { filename: string };
	pool?: { min: number; max: number };
}): Knex {
	return knex(config);
}

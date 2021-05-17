const { config } = require("dotenv");
config();

module.exports = {
	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		pool: { min: 0, max: 7 }
	},
	development: {
		client: 'sqlite3',
		connection: {
			filename: './testdb.sqlite'
		}
	}
};

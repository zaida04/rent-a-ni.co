const { config } = require("dotenv");
config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.PGSSLMODE="no-verify"

module.exports = {
	production: {
		client: 'postgresql',
		connection: process.env.DATABASE_URL,
		pool: { min: 0, max: 7 },
		ssl: { rejectUnauthorized: false }
	},
	development: {
		client: 'sqlite3',
		connection: {
			filename: './testdb.sqlite'
		}
	}
};

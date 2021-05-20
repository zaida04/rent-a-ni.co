
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.string("id");
        table.string("email");
        table.string("username");
        table.string("password");
        table.string("token");
        table.datetime("tokenLastUpdatedAt", { useTz: true });
        table.timestamps(true, true);
	});
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};

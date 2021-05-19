
exports.up = function(knex) {
    return knex.schema.createTable('links', (table) => {
        table.string("id");
        table.string("nanoId");
        table.string("destination");
        table.timestamps(true, true);
	});
};

exports.down = function(knex) {
    return knex.schema.dropTable('links');
};

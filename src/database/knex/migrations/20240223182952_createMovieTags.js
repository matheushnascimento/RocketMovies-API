exports.up = knex =>
  knex.schema.createTable("Tags", table => {
    table.increments("id");
    table
      .integer("note_id")
      .references("id")
      .inTable("Notes")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .references("id")
      .inTable("Users")
      .onDelete("CASCADE");
    table.text("name");
  });

exports.down = knex => knex.schema.dropTable("Tags");

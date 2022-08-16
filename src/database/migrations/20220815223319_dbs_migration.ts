import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("bank", (table) => {
    table.increments("id");
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("email", 70).notNullable().unique();
    table.string("password", 255).notNullable().unique();
    table.string("account_number").notNullable().unique();
    table.decimal("balance").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("bank");
}

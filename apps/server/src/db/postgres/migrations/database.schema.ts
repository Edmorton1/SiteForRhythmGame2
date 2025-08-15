// import { Database } from "@libs/types/common/database.types";
// import { Kysely, sql } from "kysely";

// const AUTH_METHOD_CHECK = "auth_method_check";

// export async function up(db: Kysely<Database>): Promise<void> {
// 	await db.schema.createType("roles").asEnum(["user", "admin"]).execute();

// 	await db.schema
// 		.createTable("users")
// 		.addColumn("id", "integer", col =>
// 			col.primaryKey().generatedAlwaysAsIdentity(),
// 		)
// 		.addColumn("role", sql`roles`, col => col.notNull())
// 		.addColumn("email", "varchar(256)", col => col.unique())
// 		.addColumn("provider_id", "varchar(21)")
// 		.addColumn("password", "varchar(128)")
// 		.addColumn("banned", "boolean", col => col.notNull().defaultTo(false))
// 		.execute();

// 	await db.schema
// 		.alterTable("users")
// 		.addCheckConstraint(
// 			AUTH_METHOD_CHECK,
// 			sql`( (provider_id IS NOT NULL AND password IS NULL AND email IS NULL)
//        OR (provider_id IS NULL AND password IS NOT NULL AND email IS NOT NULL) )`,
// 		)
// 		.execute();
// }

// export async function down(db: Kysely<any>): Promise<void> {
// 	await db.schema.dropTable("users").execute();
// 	await db.schema.dropType("roles").execute();
// }

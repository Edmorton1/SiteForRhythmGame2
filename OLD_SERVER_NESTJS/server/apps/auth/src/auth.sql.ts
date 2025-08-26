import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../services/db/postgres/database.service";
import bcrypt from "bcrypt";
import { AuthDTO } from "../../../libs/models/schemas/auth.dto";
import { DatabaseKysely } from "../../../services/db/postgres/database.type";
import { sql } from "kysely";

@Injectable()
export class AuthSQL {
	constructor(private readonly databaseService: DatabaseService) {}

	async registration(authDTO: AuthDTO) {
		const { user, profile: profileDTO } = authDTO;
		const hashPassword = await bcrypt.hash(user.password!, 3);
		return this.databaseService.db.transaction().execute(async trx => {
			const [roleId] = await trx
				.insertInto("users")
				.values({
					...user,
					password: hashPassword,
				})
				.returning(["id", "role"])
				.execute();

			const [profile] = await trx
				.insertInto("profiles")
				.values({
					...profileDTO,
					id: roleId.id,
					avatar: null,
				})
				.returningAll()
				.execute();
			return { user: roleId, profile };
		});
	}

	async isInDB<T extends keyof DatabaseKysely>(
		table: T,
		param: keyof DatabaseKysely[T],
		// USER INPUT
		value: string,
	) {
		const { rows } = await sql<{ exists: boolean }>`
		SELECT EXISTS(
			SELECT 1
			FROM ${sql.table(table)}
			WHERE ${sql.ref(String(param))} = ${value}
		)`.execute(this.databaseService.db);

		return rows[0].exists;
	}
}

import type { ColumnType, GeneratedAlways } from "kysely";
import { Role } from "../../../../../../libs/models/schemas/user";

export interface DatabaseKysely {
	users: {
		id: GeneratedAlways<number>;
		role: ColumnType<Role, Role | undefined, "user">;
		email: string | null;
		provider_id: string | null;
		password: string | null;
		banned: ColumnType<boolean, boolean | undefined, boolean>;
	};
	profiles: {
		id: number;
		name: string;
		avatar: string | null;
		about: string | null;
		country_code: string;
		created_at: GeneratedAlways<string>;
	};
}

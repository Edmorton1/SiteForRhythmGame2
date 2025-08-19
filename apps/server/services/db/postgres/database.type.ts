import type { Role } from "@libs/types/common/database.types";
import type { ColumnType, GeneratedAlways } from "kysely";

export interface DatabaseKysely {
	users: {
		id: GeneratedAlways<number>;
		role: Role;
		email: string | null;
		provider_id: string | null;
		password: string | null;
		banned: ColumnType<boolean, boolean | undefined, boolean>;
	};
}

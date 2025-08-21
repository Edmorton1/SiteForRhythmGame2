import type { ColumnType, GeneratedAlways } from "kysely";
import type { Role } from "../../../../../libs/types/subjects.types";

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

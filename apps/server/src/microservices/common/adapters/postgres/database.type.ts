import type { ColumnType, GeneratedAlways } from 'kysely';
import { Role } from '../../../../../../../libs/models/schemas/user';
import { CountryCodes } from '../../../../../../../libs/models/enums/countries';

export type Difficulties = 'easy' | 'normal' | 'hard';

export interface DatabaseKysely {
	users: {
		id: GeneratedAlways<number>;
		role: ColumnType<Role, Role | undefined, 'user'>;
		email: string | null;
		provider_id: string | null;
		password: string | null;
		banned: ColumnType<boolean, boolean | undefined, boolean>;
	};
	profiles: {
		id: number;
		name: string;
		avatar: string | null;
		about: string;
		country_code: CountryCodes;
		created_at: GeneratedAlways<string>;
	};

	tracks: {
		id: GeneratedAlways<number>;
		name_en: string;
		name: string;
		author: number;
		performer: string;
		about: ColumnType<string, string | undefined, string>;
		cover_path: string | null;
		file_path: string;
		difficulty: Difficulties;
		bpm: number;
		lang: CountryCodes;
		likes_count: ColumnType<number, number | undefined, number>;
		downloads_count: ColumnType<number, number | undefined, number>;
		plays_count: ColumnType<number, number | undefined, number>;
		created_at: GeneratedAlways<string>;
		is_deleted: ColumnType<boolean, boolean | undefined, boolean>;
	};
}

// prettier-ignore
import { CountryCodes, LanguagesCodes } from '../../../../../../../libs/models/enums/countries';
import { Difficulties } from '../../../../../../../libs/models/schemas/tracks';
import { Role } from '../../../../../../../libs/models/schemas/user';
import type { ColumnType, GeneratedAlways } from 'kysely';

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
		cover_path: string | null;
		file_path: string;
		difficulty: Difficulties;
		bpm: number;
		lang: LanguagesCodes;
		likes_count: ColumnType<number, number | undefined, number>;
		downloads_count: ColumnType<number, number | undefined, number>;
		plays_count: ColumnType<number, number | undefined, number>;
		created_at: GeneratedAlways<string>;
		is_deleted: ColumnType<boolean, boolean | undefined, boolean>;
	};
}

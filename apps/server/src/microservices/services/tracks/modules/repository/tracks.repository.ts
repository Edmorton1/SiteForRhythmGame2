import { inject, injectable } from 'inversify';
import { SERVICES_TYPES } from '../../../../../common/containers/SERVICES_TYPES.di';
import { DatabaseService } from '../../../../../common/services/postgres/database.service';
import { TRACKS_FUNCTIONS } from '../../../../../common/modules/tracks/tracks.functions';
import { sql } from 'kysely';

const days = {
	today: 1,
	week: 7,
	month: 31,
	year: 365,
} as const;

function isDays(val: unknown): val is keyof typeof days {
	if (typeof val === 'string' && Object.keys(days).includes(val)) {
		return true;
	}
	return false;
}

// prettier-ignore
export const TRACKS_SELECT = [
  'id', 'name', 'name_en', 'author', 'performer',
  'about', 'cover_path', 'file_path', 'difficulty',
  'bpm', 'lang', 'likes_count', 'downloads_count',
  'plays_count', 'created_at', 'is_deleted',
] as const;

@injectable()
export class TracksRepository {
	constructor(
		@inject(SERVICES_TYPES.database)
		private readonly databaseService: DatabaseService,
	) {}

	getAllTracks = async (options: TRACKS_FUNCTIONS['getAllTracks']['input']) => {
		let query = await this.databaseService.db
			.selectFrom('tracks')
			.select(TRACKS_SELECT);

		if (options.cursor) {
			query = query.where('id', '>', options.cursor);
		}

		if (options.sort) {
			if (isDays(options.sort)) {
				query = query
					.orderBy(
						sql`
					CASE
						WHEN created_at >= NOW() - INTERVAL '${sql.lit(days[options.sort])} DAYS'
						THEN 1
						ELSE 0 
					END`,
						'desc',
					)
					.orderBy('plays_count', 'desc');
			} else {
				query = query.orderBy(options.sort, 'desc');
			}
		}

		if (options.lang) {
			query = query.where('lang', 'in', options.lang);
		}

		if (options.difficulty) {
			query = query.where('difficulty', 'in', options.difficulty);
		}

		return query.execute();
	};

	getTrack = async (id: number) => {
		const track = await this.databaseService.db
			.selectFrom('tracks')
			.select(TRACKS_SELECT)
			.where('id', '=', id)
			.executeTakeFirst();

		return track;
	};
}

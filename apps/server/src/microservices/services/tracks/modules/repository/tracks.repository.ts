import { inject, injectable } from 'inversify';
import { DatabaseAdapter } from '../../../../common/adapters/postgres/database.adapters';
import { TRACKS_FUNCTIONS } from '../../../../../common/modules/tracks/tracks.functions';
import { sql } from 'kysely';
import { ADAPTERS } from '../../../../../common/adapters/container/adapters.types';

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
		@inject(ADAPTERS.micro.database)
		private readonly db: DatabaseAdapter,
	) {}

	getAllTracks = async (options: TRACKS_FUNCTIONS['getAllTracks']['input']) => {
		let query = this.db.db.selectFrom('tracks').select(TRACKS_SELECT);

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

	getTrack = async (id: TRACKS_FUNCTIONS['getTrack']['input']) => {
		const track = await this.db.db
			.selectFrom('tracks')
			.select(TRACKS_SELECT)
			.where('id', '=', id)
			.executeTakeFirst();

		return track;
	};
}

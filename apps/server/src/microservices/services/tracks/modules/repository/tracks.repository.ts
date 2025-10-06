import { inject, injectable } from 'inversify';
import { SERVICES_TYPES } from '../../../../../common/containers/SERVICES_TYPES.di';
import { DatabaseService } from '../../../../../common/services/postgres/database.service';
import { TRACKS_FUNCTIONS } from '../../../../../common/modules/tracks/tracks.functions';
import { sql } from 'kysely';
import { ElasticSearchService } from '../../../../../common/services/elasticsearch/elasticsearch.service';

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
		@inject(SERVICES_TYPES.elasticsearch)
		private readonly es: ElasticSearchService,
	) {}

	// Search-as-you-type
	getSearchSuggestTrack = async (query: string) => {
		const esSearchResult = await this.es.es.search({
			index: 'second_index',
			query: {
				multi_match: {
					query,
					type: 'bool_prefix',
					fields: [
						'name', // поле search_as_you_type
						'name._2gram', // автоматически создаваемые n-gram поля
						'name._3gram',
					],
				},
			},
		});

		const suggests = esSearchResult.hits.hits.flatMap(
			e => (e._source as { name: string })['name'],
		);

		return suggests;
	};

	getSearchTrack = async (query: string) => {
		// return await this.databaseService.db
		// 	.selectFrom('tracks')
		// 	.select(TRACKS_SELECT)
		// 	.where('name_en', 'ilike', `%${query}%`)
		// 	.execute();
		// TODO: Сделать чтобы он возвращал только нужные поля
		const esSearchResult = await this.es.es.search({
			index: 'second_index',
			query: {
				match: {
					name: {
						query,
						operator: 'and',
						fuzziness: 'auto',
						auto_generate_synonyms_phrase_query: true,
						zero_terms_query: 'none',
						fuzzy_transpositions: true,
						lenient: true,
					},
				},
			},
		});

		// wildcard: {
		// 	name: {
		// 		value: `*${query}*`,
		// 		case_insensitive: true,
		// 	},
		// },

		// TODO: wildcard || prefix - для автокомплита
		// TODO: Использовать multi_match для поиска с несколькими полями, name^3 about^2
		// match: {
		// ПОТОМ СДЕЛАТЬ minimum_should_match - ЭТО МИНИМАЛЬНОЕ КОЛ-ВО НАЙДЕННЫХ СЛОВ
		// 	name: query,
		// },

		const tracks_ids = esSearchResult.hits.hits
			.map(e => Number(e._id))
			.filter(e => typeof e === 'number');

		if (tracks_ids.length < 1) {
			return [];
		}

		const tracks = await this.databaseService.db
			.selectFrom('tracks')
			.select(TRACKS_SELECT)
			.where('id', 'in', tracks_ids)
			.execute();

		return tracks;
	};

	getAllTracks = async (options: TRACKS_FUNCTIONS['getAllTracks']['input']) => {
		let query = this.databaseService.db
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

	getTrack = async (id: TRACKS_FUNCTIONS['getTrack']['input']) => {
		const track = await this.databaseService.db
			.selectFrom('tracks')
			.select(TRACKS_SELECT)
			.where('id', '=', id)
			.executeTakeFirst();

		return track;
	};
}

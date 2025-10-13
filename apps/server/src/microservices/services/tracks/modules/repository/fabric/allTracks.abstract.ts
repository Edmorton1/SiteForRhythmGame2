import { SelectQueryBuilder, sql } from 'kysely';
// prettier-ignore
import { AllTracksServerReturn, Track, TracksCursor, TracksQueryParams } from '../../../../../../../../../libs/models/schemas/tracks';
import { DatabaseAdapter } from '../../../../../common/adapters/postgres/database.adapters';
import { TRACKS_SELECT } from '../tracks.repository';
import { DatabaseKysely } from '../../../../../common/adapters/postgres/database.type';
import { HttpError } from '../../../../../../common/http/http.error';
import { TracksDays } from '../tracks.days';

const LIMIT = 10;

type TracksWithPopularity = Track & { popularity: number };

type TracksSelectQueryBuilder = SelectQueryBuilder<
	DatabaseKysely & { tracks_with_popularity: TracksWithPopularity },
	'tracks_with_popularity',
	TracksWithPopularity
>;

export abstract class AllTracksAbstract {
	protected query: TracksSelectQueryBuilder;

	constructor(
		protected readonly db: DatabaseAdapter,
		protected readonly options: TracksQueryParams,
	) {
		this.query = this.db.db
			.with('tracks_with_popularity', db =>
				db
					.selectFrom('tracks')
					.selectAll()
					.select(() =>
						sql<number>`(plays_count + likes_count * 2 +  downloads_count * 3)`.as(
							'popularity',
						),
					),
			)
			.selectFrom('tracks_with_popularity')
			.select([...TRACKS_SELECT, 'popularity']);
	}

	private filterByLang = () => {
		const lang = this.options.lang;
		if (lang) {
			this.query = this.query.where('lang', 'in', lang);
		}
	};

	private filterByDifficulty = () => {
		const difficulty = this.options.difficulty;
		if (difficulty) {
			this.query = this.query.where('difficulty', 'in', difficulty);
		}
	};

	protected useFilters = () => {
		this.filterByLang();
		this.filterByDifficulty();
	};

	protected abstract useSort(): void;

	protected abstract usePagination(): void;

	getResult = async (): Promise<AllTracksServerReturn> => {
		this.useFilters();
		this.useSort();

		console.log('КУРСОР ПРИНЯЛ, ', this.options.cursor);
		this.usePagination();

		console.log(
			'ЗАПРОС',
			this.query.compile().sql,
			this.query.compile().parameters,
		);
		const tracks = await this.query.limit(LIMIT).execute();
		console.log('РЕЗУЛЬТАТ', tracks);
		const lastElement = tracks[tracks.length - 1];
		console.log('LAST ELEM', lastElement);

		if (!lastElement) {
			// TODO: Отправка ошибкой
			throw new HttpError(204);
		}

		const cursor: TracksCursor = {
			id: lastElement.id,
			popularity: lastElement.popularity,
			row: undefined,
		};
		if (!TracksDays.isDays(this.options.sort)) {
			cursor.row = lastElement[this.options.sort];
		} else {
			cursor.row = lastElement['created_at'];
		}

		return {
			tracks: tracks.map(({ popularity, ...track }) => track),
			cursor,
		};
	};
}

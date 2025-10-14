// prettier-ignore
import { AllTracksServerReturn, Track, TracksCursor, TracksQueryParams } from '../../../../../../../../../../libs/models/schemas/tracks';
import { ADAPTERS } from '../../../../../../../common/adapters/container/adapters.types';
import { LoggerAdapter } from '../../../../../../../common/adapters/logger/logger.adapter';
import { HttpError } from '../../../../../../../common/http/http.error';
import { DatabaseAdapter } from '../../../../../../common/adapters/postgres/database.adapters';
import { DatabaseKysely } from '../../../../../../common/adapters/postgres/database.type';
import { TracksContainer } from '../../../../container/container.di';
import { TRACKS_SELECT } from '../tracks.repository';
import { POPULARITY_FORMULA, TRACKS_PAGE_LIMIT } from './const';
import { ExpressionBuilder } from 'kysely';
import { SelectQueryBuilder } from 'kysely';

type TracksWithPopularity = Track & { popularity: number };

type TracksSelectExpressionBuilder = ExpressionBuilder<
	DatabaseKysely & {
		tracks_with_popularity: TracksWithPopularity;
	},
	'tracks_with_popularity'
>;

type TracksSelectQueryBuilder = SelectQueryBuilder<
	DatabaseKysely & { tracks_with_popularity: TracksWithPopularity },
	'tracks_with_popularity',
	TracksWithPopularity
>;

export abstract class AllTracksAbstract {
	protected query: TracksSelectQueryBuilder;
	private readonly logger: LoggerAdapter;

	constructor(protected readonly options: TracksQueryParams) {
		const logger = TracksContainer.get<LoggerAdapter>(ADAPTERS.common.logger);
		this.logger = logger;
		const db = TracksContainer.get<DatabaseAdapter>(ADAPTERS.micro.database);
		this.query = db.db
			.with('tracks_with_popularity', db =>
				db
					.selectFrom('tracks')
					.select(TRACKS_SELECT)
					.select(() => POPULARITY_FORMULA),
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

	protected getTracks = async (): Promise<{
		tracks: Track[];
		cursorWithoutRow: Omit<TracksCursor, 'row'>;
		lastElement: Track;
	}> => {
		this.useFilters();
		this.useSort();
		this.usePagination();

		this.logger.logger.info({ SQL_REQUEST: this.query.compile() });
		const tracks = await this.query.limit(TRACKS_PAGE_LIMIT).execute();
		this.logger.logger.info({ SQL_RESPONSE: tracks });

		const lastElement = tracks[tracks.length - 1];

		if (!lastElement) {
			// TODO: Отправка ошибкой
			throw new HttpError(204);
		}

		const cursorWithoutRow = {
			id: lastElement.id,
			popularity: lastElement.popularity,
		};

		return {
			tracks: tracks.map(({ popularity, ...track }) => track),
			cursorWithoutRow,
			lastElement,
		};
	};

	protected paginateByPopularity = (eb: TracksSelectExpressionBuilder) => {
		const cursor = this.options.cursor;
		if (!cursor) throw new Error('CURSOR NOT FIND');

		return eb.or([
			eb('popularity', '<', cursor.popularity),
			eb.and([
				eb('popularity', '=', cursor.popularity),
				eb('id', '<', cursor.id),
			]),
		]);
	};

	protected abstract useSort(): void;

	protected abstract usePagination(): void;

	public abstract getAllTracks: () => Promise<AllTracksServerReturn>;
}

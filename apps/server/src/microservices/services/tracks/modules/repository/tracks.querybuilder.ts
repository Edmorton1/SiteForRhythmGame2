import { SelectQueryBuilder, sql } from 'kysely';
// prettier-ignore
import { Track } from '../../../../../../../../libs/models/schemas/tracks';
import { DatabaseKysely } from '../../../../common/adapters/postgres/database.type';
import { inject, injectable } from 'inversify';
import { ADAPTERS } from '../../../../../common/adapters/container/adapters.types';
import { DatabaseAdapter } from '../../../../common/adapters/postgres/database.adapters';
import { TRACKS_SELECT } from './tracks.repository';

type TracksSelectQueryBuilder = SelectQueryBuilder<
	DatabaseKysely & { tracks_with_popularity: TracksWithPopularity },
	'tracks_with_popularity',
	TracksWithPopularity
>;

type TracksWithPopularity = Track & { popularity: number };

@injectable()
export class TracksQueryBuilder {
	private readonly query: TracksSelectQueryBuilder;

	constructor(
		@inject(ADAPTERS.micro.database)
		private readonly db: DatabaseAdapter,
	) {
		this.query = this.createTracksBuilder();
	}

	getNoDays = () => {};

	getPopularity = () => {};

	getWithTableRow = () => {};

	private readonly createTracksBuilder = () => {
		return this.db.db
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
	};
}

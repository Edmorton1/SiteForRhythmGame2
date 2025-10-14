import { sql } from 'kysely';

export const TRACKS_PAGE_LIMIT = 10;

export const POPULARITY_FORMULA =
	sql<number>`plays_count + likes_count * 2 + downloads_count * 3`.as(
		'popularity',
	);

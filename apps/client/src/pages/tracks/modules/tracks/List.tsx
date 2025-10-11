// prettier-ignore
import { difficultiesTracks, tracksSort } from '../../../../../../../libs/models/schemas/tracks';
import { useTracksGet } from './hooks/useTracks';
import { useQueryParams } from './hooks/useQueryParams';
import { countries } from 'countries-list';
import { Track } from './components/Track';

const langs = ['ru', 'uk', 'en'];

export const TracksList = () => {
	const [searchParams, methods] = useQueryParams();
	console.log(searchParams);

	const { data, fetchNextPage } = useTracksGet(searchParams);
	console.log('ПОЛУЧЕННЫЕ ДАННЫЕ', data);
	console.log(countries);
	console.log('ПЕЙДЖЕС', data);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
			<div>Сортировать по</div>

			<select
				onChange={e => methods.select('sort', e.target.value)}
				defaultValue={searchParams.get('sort') || undefined}>
				{tracksSort.map(sort => (
					<option
						key={sort}
						value={sort}>
						{sort}
					</option>
				))}
			</select>

			<div>Фильтры</div>

			<div>Сложность</div>

			<ul>
				{difficultiesTracks.map(difficulty => (
					<li key={difficulty}>
						<label>
							<input
								checked={searchParams.has('difficulty', difficulty)}
								onChange={e => methods.checkboxes('difficulty', e.target.value)}
								type='checkbox'
								value={difficulty}
							/>
							{difficulty}
						</label>
					</li>
				))}
			</ul>

			<div>Язык</div>

			<ul>
				{langs.map(lang => (
					<li key={lang}>
						<label>
							<input
								checked={searchParams.has('lang', lang)}
								onChange={e => methods.checkboxes('lang', e.target.value)}
								value={lang}
								type='checkbox'
							/>
							{lang}
						</label>
					</li>
				))}
			</ul>

			<div>Тест языков</div>
			{data?.pages.map(page =>
				page?.tracks?.map(track => (
					<Track
						key={track.id}
						track={track}
					/>
				)),
			)}

			<button onClick={() => fetchNextPage()}>Загрузить ещё треки</button>
		</div>
	);
};

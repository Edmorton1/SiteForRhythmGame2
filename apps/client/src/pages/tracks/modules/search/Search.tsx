import axios from 'axios';
import { useState } from 'react';
import { serverPaths } from '../../../../../../../libs/common/PATHS.ts';
import { type Track } from '../../../../../../../libs/models/schemas/tracks.ts';

export const TracksSearch = () => {
	const [word, setWord] = useState<string>('');
	const [suggests, setSuggests] = useState<string[]>([]);
	const [tracks, setTracks] = useState<Track[]>([]);

	const updateTracks = (val: string) => {
		console.log('EVENT VALUE', val);
		setWord(val);
		axios
			.get(`${_URL_SERVER}${serverPaths.tracksSearchSuggest}?query=${val}`)
			.then(data => setSuggests(data.data));
	};

	const onClick = async (word?: string) => {
		if (word) {
			setWord(word);
		}
		console.log(word);
		const tracks = await axios.get(
			`${_URL_SERVER}${serverPaths.tracksSearch}?query=${word}`,
		);
		console.log(tracks);

		setTracks(tracks.data);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '400px',
				gap: '15px',
			}}>
			<label htmlFor='tracks-input'>Найти трек</label>
			<input
				id='tracks-input'
				onChange={e => updateTracks(e.target.value)}
				value={word}
				type='text'
			/>

			<button onClick={() => console.log('log')}>log</button>
			<button onClick={() => onClick()}>Готово</button>
			<div>Автодополнение</div>
			<div>
				{suggests.map(sug => (
					<button
						key={sug}
						onClick={() => {
							updateTracks(sug);
							onClick(sug);
						}}>
						{sug}
					</button>
				))}
			</div>
			<div>Результат</div>
			<div>
				{tracks.map(e => (
					<div key={e.name}>{e.name}</div>
				))}
			</div>
		</div>
	);
};

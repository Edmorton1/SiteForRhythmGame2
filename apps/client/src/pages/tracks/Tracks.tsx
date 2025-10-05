import axios from 'axios';
import { useState, type ChangeEvent } from 'react';
import { type Track } from '../../../../../libs/models/schemas/tracks.ts';

export const Tracks = () => {
	const [tracks, setTracks] = useState<Track[]>([]);

	const updateTracks = (e: ChangeEvent<HTMLInputElement>) =>
		axios
			.get(`http://localhost:5000/api/tracks?query=${e.target.value}`)
			.then(data => setTracks(data.data));

	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '400px' }}>
			<label htmlFor='tracks-input'>Найти трек</label>
			<input
				id='tracks-input'
				onChange={updateTracks}
				type='text'
			/>
			<div>
				{tracks.map(track => (
					<div key={track.name_en}>{track.name_en}</div>
				))}
			</div>
		</div>
	);
};

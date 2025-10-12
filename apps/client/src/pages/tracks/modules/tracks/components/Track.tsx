import { languages } from 'countries-list';
import type { Track as ITrack } from '../../../../../../../../libs/models/schemas/tracks';
import { LANGUAGE } from '../../../../../common/consts/LOCALSTORAGE';

export const Track = ({ track }: { track: ITrack }) => {
	const isInterfaceLang = LANGUAGE === track.lang;

	return (
		<div>
			<div>id: {track.id}</div>
			<div>name: {isInterfaceLang ? track.name : track.name_en}</div>
			<div>name_second: {isInterfaceLang ? track.name_en : track.name}</div>
			<div>author: {track.author}</div>
			<div>performer: {track.performer}</div>
			<div>
				<div>likes: {track.likes_count}</div>
				<div>plays_count: {track.plays_count}</div>
				<div>date: {new Date(track.created_at).toLocaleString()}</div>
			</div>
			<div>difficulty: {track.difficulty}</div>
			<div>language: {languages[track.lang].name}</div>
		</div>
	);
};

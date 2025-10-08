import { useQuery } from '@tanstack/react-query';
import { TRACKS } from '../../../../../common/consts/QUERY_KEYS';
import axios from 'axios';
import { serverPaths } from '../../../../../../../../libs/common/PATHS';
import { type Track } from '../../../../../../../../libs/models/schemas/tracks';

const getTracks = async (params: URLSearchParams) => {
	console.log('PARAMS SERVER', params);
	const url = new URL(_URL_SERVER + serverPaths.tracks);
	url.search = params.toString();

	return axios.get<Track[]>(url.href).then(res => res.data);
};

export const useTracksGet = (params: URLSearchParams) => {
	return useQuery({
		// eslint-disable-next-line
		queryKey: [
			TRACKS,
			Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b)),
		],
		queryFn: () => getTracks(params),
	});
};

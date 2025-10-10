import { useQuery } from '@tanstack/react-query';
import { TRACKS } from '../../../../../common/consts/QUERY_KEYS';
import axios from 'axios';
// prettier-ignore
import { TracksQueryParamsZodSchema, type Track } from '../../../../../../../../libs/models/schemas/tracks';
import { QueryParamsBuilder } from '../../../../../common/functions/queryParamsBuilder';
import { serverPaths } from '../../../../../../../../libs/common/PATHS';

export const useTracksGet = (params: URLSearchParams) => {
	const queryParamsBuilder = new QueryParamsBuilder({
		params,
		schema: TracksQueryParamsZodSchema.partial(),
		url: _URL_SERVER + serverPaths.tracks,
	});

	return useQuery({
		queryKey: [TRACKS, queryParamsBuilder.getSortedParams()],
		queryFn: async () => {
			const href = queryParamsBuilder.getURL();
			return axios.get<Track[]>(href).then(res => res.data);
		},
	});
};

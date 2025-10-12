import { useInfiniteQuery } from '@tanstack/react-query';
import { TRACKS } from '../../../../../common/consts/QUERY_KEYS';
import axios from 'axios';
// prettier-ignore
import { TracksQueryParamsZodSchema, type AllTracksServerReturn } from '../../../../../../../../libs/models/schemas/tracks';
import { QueryParamsBuilder } from '../../../../../common/functions/queryParamsBuilder';
import { serverPaths } from '../../../../../../../../libs/common/PATHS';

export const useTracksGet = (params: URLSearchParams) => {
	const queryParamsBuilder = new QueryParamsBuilder({
		params,
		schema: TracksQueryParamsZodSchema.partial(),
		url: _URL_SERVER + serverPaths.tracks,
	});

	// return useQuery({
	// 	queryKey: [TRACKS, queryParamsBuilder.getSortedParams()],
	// 	queryFn: async () => {
	// 		const href = queryParamsBuilder.getURL();
	// 		return axios.get<AllTracksServerReturn>(href).then(res => res.data);
	// 	},
	// });
	return useInfiniteQuery<AllTracksServerReturn | undefined>({
		queryKey: [TRACKS, queryParamsBuilder.getSortedParams()],
		queryFn: async ({ pageParam }) => {
			//@ts-ignore
			const href = queryParamsBuilder.getURL(pageParam);
			const res = await axios.get<AllTracksServerReturn | undefined>(href);
			console.log(pageParam);
			return res.data;
		},
		initialPageParam: undefined,
		getNextPageParam: lastPage => lastPage?.cursor,
		getPreviousPageParam: firstPage => firstPage?.cursor,
	});
};

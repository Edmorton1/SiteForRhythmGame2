import { useQuery } from '@tanstack/react-query';
import { TRACKS } from '../../../../../common/consts/QUERY_KEYS';
import axios from 'axios';
// prettier-ignore
import { TracksQueryParamsZodSchema, type Track } from '../../../../../../../../libs/models/schemas/tracks';
import { Asd } from './asd';
import { serverPaths } from '../../../../../../../../libs/common/PATHS';

export const useTracksGet = (params: URLSearchParams) => {
	const asd = new Asd({
		params,
		schema: TracksQueryParamsZodSchema.partial(),
		url: _URL_SERVER + serverPaths.tracks,
	});

	return useQuery({
		queryKey: [TRACKS, asd.objectToSortedArray()],
		queryFn: async () => {
			const href = asd.getURL();
			return axios.get<Track[]>(href).then(res => res.data);
		},
	});
};

// import { TRACKS } from '../../../../../common/consts/QUERY_KEYS';
// import axios from 'axios';
// // prettier-ignore
// import { TracksQueryParamsZodSchema, type Track, type TracksQueryParams } from '../../../../../../../../libs/models/schemas/tracks';
// import type { PartialWithUndefined } from '../../../../../../../../libs/models/enums/types';

// const getTracks = async (params: PartialWithUndefined<TracksQueryParams>) => {
// 	const href = getURL(params);

// 	return axios.get<Track[]>(href).then(res => res.data);
// };

// export const useTracksGet = (params: URLSearchParams) => {
// 	const objParams = validateSearchParams(
// 		TracksQueryParamsZodSchema.partial(),
// 		params,
// 	);

// 	return useQuery({
// 		queryKey: [TRACKS, objectToSortedArray(objParams)],
// 		queryFn: () => getTracks(objParams),
// 	});
// };

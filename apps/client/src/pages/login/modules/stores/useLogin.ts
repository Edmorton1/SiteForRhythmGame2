import { useMutation } from '@tanstack/react-query';
import { UserProfileZodSchemaClient } from '../../../../../../../libs/models/schemas/profile';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';

import { PROFILE } from '../../../../common/consts/QUERY_KEYS';
import { queryClient } from '../../../../app/queryClient';
import axios from 'axios';

// TODO: any - ПОТОМ УБРАТЬ
const postLogin = async (dto: any) =>
	axios
		.post(_URL_SERVER + serverPaths.login, dto)
		.then(({ data }) => UserProfileZodSchemaClient.parse(data));

export const useLoginPost = () =>
	useMutation({
		mutationKey: [PROFILE],
		mutationFn: postLogin,
		onSuccess: data => {
			queryClient.setQueryData([PROFILE], data);
		},
	});

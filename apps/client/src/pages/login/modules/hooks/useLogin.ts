import { useMutation } from '@tanstack/react-query';
import { UserProfileZodSchemaClient } from '../../../../../../../libs/models/schemas/profile';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { PROFILE } from '../../../../common/consts/QUERY_KEYS';
import { queryClient } from '../../../../app/queryClient';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clientPaths } from '../../../../common/consts/PATHS';
import type { LoginDTO } from '../../../../../../../libs/models/schemas/auth';

const postLogin = async (dto: LoginDTO) =>
	axios
		.post(_URL_SERVER + serverPaths.login, dto)
		.then(({ data }) => UserProfileZodSchemaClient.parse(data));

export const useLogin = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationKey: [PROFILE],
		mutationFn: postLogin,
		onSuccess: data => {
			queryClient.setQueryData([PROFILE], data);
			navigate(clientPaths.home);
		},
	});
};

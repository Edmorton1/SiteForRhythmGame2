import { serverPaths } from '../../../../../../../../libs/shared/PATHS';
import {} from '../../../../../../../../libs/models/schemas/user';
import type { AuthDTO } from '../schemas/registration.dto';
import { useMutation } from '@tanstack/react-query';
import { PROFILE } from '../../../../../common/consts/QUERY_KEYS';
import axios from 'axios';
import { queryClient } from '../../../../../app/queryClient';
import { useNavigate } from 'react-router-dom';
import { clientPaths } from '../../../../../common/consts/PATHS';

const postData = async (data: AuthDTO) => {
	const { user, profile } = data;
	const { avatar, ...profileWithoutAvatar } = profile;
	const fd = new FormData();
	fd.set('avatar', avatar[0]);
	fd.set('data', JSON.stringify({ user, profile: profileWithoutAvatar }));

	console.log(fd, fd.get('data'), fd.get('avatar'));
	return axios
		.post(_URL_SERVER + serverPaths.registration, fd)
		.then(res => res.data);
};

export const useRegistrationPost = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationKey: [PROFILE],
		mutationFn: postData,
		onSuccess: data => {
			queryClient.setQueryData([PROFILE], data);
			navigate(clientPaths.home);
		},
	});
};

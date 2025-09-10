import { serverPaths } from "../../../../../../../../libs/shared/PATHS";
import {} from "../../../../../../../../libs/models/schemas/user";
import type { AuthDTO } from "../schemas/auth.dto";
import { useMutation } from "@tanstack/react-query";
import { PROFILE } from "../../../../../common/consts/QUERY_KEYS";

const postData = async (data: AuthDTO) => {
	const { user, profile } = data;
	const { avatar, ...profileWithoutAvatar } = profile;
	const fd = new FormData();
	fd.set("avatar", avatar[0]);
	fd.set("data", JSON.stringify({ user, profile: profileWithoutAvatar }));

	console.log(fd, fd.get("data"), fd.get("avatar"));
	return fetch(_URL_SERVER + serverPaths.registration, {
		method: "POST",
		body: fd,
	}).then(res => res.json());
};

export const useRegistrationPost = () => {
	const result = useMutation({
		mutationKey: [PROFILE],
		mutationFn: (data: AuthDTO) => postData(data),
	});

	return result;
};

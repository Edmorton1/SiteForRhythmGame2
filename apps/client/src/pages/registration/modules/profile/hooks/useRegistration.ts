import { serverPaths } from "../../../../../../../../libs/shared/PATHS";
import {} from "../../../../../../../../libs/models/schemas/user";
import type { AuthDTO } from "../schemas/registration.dto";
import { useMutation } from "@tanstack/react-query";
import { PROFILE } from "../../../../../common/consts/QUERY_KEYS";
import { taipan } from "../../../../../common/taipan/taipan";

const postData = async (data: AuthDTO) => {
	const { user, profile } = data;
	const { avatar, ...profileWithoutAvatar } = profile;
	const fd = new FormData();
	fd.set("avatar", avatar[0]);
	fd.set("data", JSON.stringify({ user, profile: profileWithoutAvatar }));

	console.log(fd, fd.get("data"), fd.get("avatar"));
	return taipan(_URL_SERVER + serverPaths.registration, {
		method: "POST",
		body: fd,
	}).then(res => res.data);
};

export const useRegistrationPost = () =>
	useMutation({
		mutationKey: [PROFILE],
		mutationFn: postData,
	});

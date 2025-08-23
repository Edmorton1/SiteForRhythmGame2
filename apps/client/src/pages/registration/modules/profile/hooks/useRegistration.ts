import { serverPaths } from "../../../../../../../../libs/shared/PATHS";
import {} from "../../../../../../../../libs/models/schemas/user";
import type { AuthDTO } from "../schemas/auth.dto";
import { useMutation } from "@tanstack/react-query";

const postData = async (data: AuthDTO) => {
	const { auth, profile } = data;
	const { avatar, ...profileWithoutAvatar } = profile;
	const fd = new FormData();
	fd.set("avatar", avatar[0]);
	fd.set("data", JSON.stringify({ auth, profile: profileWithoutAvatar }));

	return fetch(_URL_SERVER + serverPaths.registration, {
		method: "POST",
		body: fd,
	}).then(res => res.json());
};

export function useRegistrationPost() {
	const result = useMutation({
		mutationKey: ["profile"],
		mutationFn: (data: AuthDTO) => postData(data),
	});

	return result;
}

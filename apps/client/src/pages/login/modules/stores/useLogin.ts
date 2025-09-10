import { useMutation } from "@tanstack/react-query";
import { UserProfileZodSchemaClient } from "../../../../../../../libs/models/schemas/profile";
import { serverPaths } from "../../../../../../../libs/shared/PATHS";
import { taipan } from "../../../../common/taipan/taipan";
import { PROFILE } from "../../../../common/consts/QUERY_KEYS";
import { queryClient } from "../../../../app/queryClient";

// TODO: any - ПОТОМ УБРАТЬ
const postLogin = async (dto: any) => {
	console.log("DTO", dto);
	const res = await taipan(_URL_SERVER + serverPaths.login, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(dto),
		schema: UserProfileZodSchemaClient,
	});

	console.log("ЗАПРОС ВЫПОЛНЕН", res.data);
	return res.data;
};

export const useLoginPost = () =>
	useMutation({
		mutationKey: [PROFILE],
		mutationFn: postLogin,
		onSuccess: data => {
			queryClient.setQueryData([PROFILE], data);
		},
	});

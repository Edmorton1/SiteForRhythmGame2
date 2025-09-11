import { useMutation } from "@tanstack/react-query";
import { PROFILE } from "../../../../common/consts/QUERY_KEYS";
import { taipan } from "../../../../common/taipan/taipan";
import { serverPaths } from "../../../../../../../libs/shared/PATHS";
import { queryClient } from "../../../../app/queryClient";

const deleteLogout = () => {
	console.log("ЛОГАУТ");
	return taipan(_URL_SERVER + serverPaths.logout, {
		method: "DELETE",
	});
};

export const useLogout = () =>
	useMutation({
		mutationKey: [PROFILE],
		mutationFn: deleteLogout,
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: [PROFILE] });
			// queryClient.setQueryData([PROFILE], { name: "LEXA" });
		},
		onError: err => console.log(err),
	});

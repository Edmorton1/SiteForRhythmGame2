import { useMutation } from "@tanstack/react-query";
import { PROFILE } from "../../../../common/consts/QUERY_KEYS";
import { serverPaths } from "../../../../../../../libs/shared/PATHS";
import { queryClient } from "../../../../app/queryClient";
import axios from "axios";

const deleteLogout = async () => axios.delete(_URL_SERVER + serverPaths.logout);

export const useLogout = () =>
	useMutation({
		mutationKey: [PROFILE],
		mutationFn: deleteLogout,
		onSuccess: () => {
			queryClient.setQueryData([PROFILE], null);
		},
	});

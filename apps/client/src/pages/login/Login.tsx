import { UserZodSchema } from "../../../../../libs/models/schemas/user";
import { serverPaths } from "../../../../../libs/shared/PATHS";
import { taipan } from "../../common/taipan/taipan";

export const Login = () => {
	const handleClick = async () => {
		const res = await taipan(
			"https://jsonplaceholder.typicode.com/posats?page=2",
			{ schema: UserZodSchema },
		);
		const data = res.data;
		console.log(data);
	};

	return <button onClick={handleClick}>fetch</button>;
};

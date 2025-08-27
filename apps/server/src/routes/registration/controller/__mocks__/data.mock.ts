//prettier-ignore
import { AuthDTO, LoginResponse, } from "../../../../common/models/schemas/auth.dto";

export const mockProfile: AuthDTO["profile"] = {
	name: "name",
	about: "about",
	country_code: "RU",
};

export const mockData: LoginResponse = {
	token: "k9Bv2qLxT7rFzN4pWdHj1",
	profile: {
		...mockProfile,
		id: 1,
		created_at: "today",
		avatar: null,
	},
};

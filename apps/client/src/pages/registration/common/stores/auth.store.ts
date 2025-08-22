import { create } from "zustand";
import type { UserDTO } from "../../../../../../../libs/models/schemas/user";
import type { ProfileDTO } from "../../modules/profile/schemas/profile.dto";

interface UserState {
	user: UserDTO | null;
	setUser: (data: UserDTO) => void;

	profile: ProfileDTO | null;
	setProfile: (profile: ProfileDTO) => void;
}

export const useRegistrationAuthStore = create<UserState>(set => ({
	user: null,
	setUser: user => set({ user }),
	profile: null,
	setProfile: profile => set({ profile }),
}));

import { create } from "zustand";
import type { UserDTO } from "../../../../../../../libs/models/schemas/user";

interface UserState {
	user: UserDTO;
	setUser: (data: UserDTO) => void;
}

export const useRegistrationAuthStore = create<UserState>(set => ({
	user: { email: null, password: null },
	setUser: user => set({ user }),
}));

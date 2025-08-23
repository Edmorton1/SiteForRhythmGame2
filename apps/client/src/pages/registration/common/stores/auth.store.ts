import { create } from "zustand";
import type { UserDTO } from "../../../../../../../libs/models/schemas/user";

interface UserState {
	user: UserDTO | null;
	setUser: (data: UserDTO) => void;
}

export const useRegistrationAuthStore = create<UserState>(set => ({
	user: null,
	setUser: user => set({ user }),
}));

import { create } from "zustand";
import type { UserDTO } from "../../../../../../../../libs/types/subjects.types.dto";

interface UserState extends UserDTO {
	setEmailPassword: (data: UserDTO) => void;
}

export const useRegistrationAuthStore = create<UserState>(set => ({
	email: "asdasd@gmail.com",
	password: "null",
	setEmailPassword: data => set(data),
}));

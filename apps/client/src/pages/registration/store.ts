import { create } from "zustand";

interface User {
	id: number;
	username: string;
}

interface UserState {
	users: User[];
	email: string;
	password: string;
	addUser: (username: string) => void;
}

export const useRegistrationStore = create<UserState>(set => ({
	users: [],
	email: "",
	password: "",
	addUser: (username: string) =>
		set(state => ({
			users: [...state.users, { id: Date.now(), username }],
		})),
}));

import "reflect-metadata";
import { HttpError } from "../../../../common/http/http.error";
//prettier-ignore
import { mockProfileDTO, mockRegistrationService, mockResult } from "./services.mock";

const userDTO = { email: "q@w.er", password: "123123" };

const token = "V7fHc9LpQ2xDkR6wMzS1";

describe("[REGISTRATION] Controller testing", () => {
	const cases = [
		{
			name: "Valid data, email method",
			input: { user: userDTO, profile: mockProfileDTO },
			redirect: undefined,
			expected: mockResult,
		},
		{
			name: "Valid data, provider method",
			input: { user: { email: null, password: null }, profile: mockProfileDTO },
			redirect: token,
			expected: mockResult,
		},
	];

	it.each(cases)("$name", async ({ input, redirect, expected }) => {
		await expect(
			mockRegistrationService.registration(input, redirect),
		).resolves.toEqual(expected);
	});

	it("Email and Provider", async () => {
		await expect(
			mockRegistrationService.registration(
				{ user: userDTO, profile: mockProfileDTO },
				token,
			),
		).rejects.toBeInstanceOf(HttpError);
	});
});

import 'reflect-metadata';
//prettier-ignore
import { mockProfileDTO, mockRegistrationService, mockResult } from "./services.mock";
import { Provider } from '../../../../../../../web-server/_declarations/session';
import { HttpError } from '../../../../../../../common/http/http.error';

// TODO: ПРОВЕРИТЬ ЕЩЁ РАЗ ЭТОТ ТЕСТ
const userDTO = { email: 'q@w.er', password: '123123' };

const provider: Provider = {
	email: userDTO.email,
	id: 'V7fHc9LpQ2xDkR6wMzS1',
	provider: 'google',
};

describe('[REGISTRATION] Controller testing', () => {
	const cases = [
		{
			name: 'Valid data, email method',
			input: { user: userDTO, profile: mockProfileDTO },
			redirect: undefined,
			expected: mockResult,
		},
		{
			name: 'Valid data, provider method',
			input: { user: { email: null, password: null }, profile: mockProfileDTO },
			redirect: provider,
			expected: mockResult,
		},
	];

	it.each(cases)('$name', async ({ input, redirect, expected }) => {
		await expect(
			// mockRegistrationService.registration(input, redirect),
			mockRegistrationService.registration({
				authDTO: input,
				provider: redirect,
			}),
		).resolves.toEqual(expected);
	});

	it('Email and Provider', async () => {
		await expect(
			mockRegistrationService.registration({
				authDTO: { user: userDTO, profile: mockProfileDTO },
				provider,
			}),
		).rejects.toBeInstanceOf(HttpError);
	});
});

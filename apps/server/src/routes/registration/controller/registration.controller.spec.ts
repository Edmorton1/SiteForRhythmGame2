import "reflect-metadata";
import { HttpError } from "../../../common/http/http.error";
import { mockRegistrationController } from "./__mocks__/services.mock";
import { mockFormData, mockReq, mockRes } from "../../__mock__/express.mock";
import { mockData, mockProfile } from "./__mocks__/data.mock";
import { Response } from "express";

const expectSuccess = (res: Response) => {
	expect(res.clearCookie).toHaveBeenCalledWith("redirect");
	expect(res.status).toHaveBeenCalledWith(201);
	expect(res.json).toHaveBeenCalledWith(mockData.profile);
	expect(res.cookie).toHaveBeenCalledWith(
		expect.any(String),
		mockData.token,
		expect.any(Object),
	);
};

describe("[REGISTRATION] Controller testing", () => {
	it("Valid data, email method", async () => {
		const req = mockReq({
			body: mockFormData(
				{
					user: {
						email: "q@w.er",
						password: "123123",
					},
					profile: mockProfile,
				},
				"data",
			),
			cookies: {},
		});

		const res = mockRes();

		await mockRegistrationController.registration(req, res);

		expectSuccess(res);
	});

	it("Valid data, provider method", async () => {
		const req = mockReq({
			body: mockFormData(
				{
					user: {
						email: null,
						password: null,
					},
					profile: mockProfile,
				},
				"data",
			),
			cookies: { redirect: "V7fHc9LpQ2xDkR6wMzS1" },
		});

		const res = mockRes();

		await mockRegistrationController.registration(req, res);

		expectSuccess(res);
	});

	it("Email and Provider", async () => {
		const req = mockReq({
			body: mockFormData(
				{
					user: {
						email: "q@w.er",
						password: "123123",
					},
					profile: mockProfile,
				},
				"data",
			),
			cookies: { redirect: "V7fHc9LpQ2xDkR6wMzS1" },
		});

		const res = mockRes();

		mockRegistrationController
			.registration(req, res)
			.catch(err => expect(err).toBeInstanceOf(HttpError));
	});
});

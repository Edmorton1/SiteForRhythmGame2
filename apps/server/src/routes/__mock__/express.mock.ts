import { Request, Response } from "express";

type MockReq = Pick<Request, "body" | "cookies" | "file">;

export const mockReq = (data: MockReq) => data as unknown as Request;

export const mockRes = () => {
	const res: Partial<Response> = {};
	res.clearCookie = jest.fn().mockReturnThis();
	res.cookie = jest.fn().mockReturnThis();
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn().mockReturnThis();
	return res as Response;
};

export const mockFormData = (data: any, name: string) => {
	return { [name]: JSON.stringify(data) };
};

import { Request, Response } from 'express';

export class Controller {
	getValue = (req: Request, res: Response) => {
		return (data: any) => {
			console.log('RES JSON ПОЛУЧЕН', data);
			res.json(data);
		};
	};
}

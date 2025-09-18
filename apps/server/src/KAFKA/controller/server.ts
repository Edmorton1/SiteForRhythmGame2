import express from 'express';
import { Controller } from './controller';

const app = express();

const controller = new Controller();

app.get('/test', controller.getValue);

app.listen(3000, '0.0.0.0', () => {
	console.log('TEST SERVER STARTED');
});

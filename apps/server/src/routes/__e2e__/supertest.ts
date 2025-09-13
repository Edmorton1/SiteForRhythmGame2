import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import supertest from 'supertest';
import { container } from '../../containers/container.di';
import { ServerExpress } from '../../config/server';
import { TYPES } from '../../containers/TYPES';

// TODO: Убрать дублирование .env

const server = container.get<ServerExpress>(TYPES.app.ServerExpress);

const testServer = supertest(server.app);

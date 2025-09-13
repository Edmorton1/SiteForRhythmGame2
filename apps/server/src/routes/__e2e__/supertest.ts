import path from 'path';
const envPath = path.resolve(__dirname, '../../../.env');
import dotenv from 'dotenv';
dotenv.config({ path: envPath });
import supertest from 'supertest';
import { testSetupServer } from './setup';

export const testServer = supertest(testSetupServer.app);

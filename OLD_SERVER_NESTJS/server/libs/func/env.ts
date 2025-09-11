type Mode = 'production' | 'development';

interface Env {
	PORT: string;
	HOST: string;
	AUTH_PORT: string;
	AUTH_HOST: string;
	DB_NAME: string;
	DB_HOST: string;
	DB_USER: string;
	DB_PORT: string;
	DB_PASSWORD: string;
	REDIS_HOST: string;
	REDIS_PORT: string;
	JWT_SECRET: string;
	NODE_ENV: Mode;
}

export function getEnv<K extends keyof Env>(param: K): Env[K] {
	const value = process.env[param];
	validateEnv(value, param);
	return value as Env[K];
}

function validateEnv<K extends keyof Env>(
	value: unknown,
	param: K,
): asserts value is Env[K] {
	isString(value, param);
	if (param === 'NODE_ENV') {
		isMode(value);
	}
}

function isString(value: unknown, param: keyof Env): asserts value is string {
	if (typeof value !== 'string') {
		throw new Error(`Укажите обязательный параметр ${param}!`);
	}
}

function isMode(value: unknown): asserts value is Mode {
	if (value !== 'production' && value !== 'development') {
		throw new Error(
			`NODE_ENV должен быть production или development! Сейчас это ${value}`,
		);
	}
}

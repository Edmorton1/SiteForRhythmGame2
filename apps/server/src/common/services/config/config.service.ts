type Mode = 'production' | 'development' | 'test';

interface Env {
	PORT: string;
	HOST: string;
	URL_SERVER: string;
	URL_CLIENT: string;
	AUTH_PORT: string;
	AUTH_HOST: string;
	DB_NAME: string;
	DB_HOST: string;
	DB_USER: string;
	DB_PORT: string;
	DB_PASSWORD: string;
	REDIS_HOST: string;
	REDIS_PORT: string;
	SESSION_SECRET: string;
	COOKIE_NAME: string;
	NODE_ENV: Mode;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	KAFKA_BROKERS: string;
	KAFKA_CLIENT_ID: string;
	ELASTIC_URL: string;
}

export class ConfigService {
	getEnv = <K extends keyof Env>(param: K): Env[K] => {
		const value = process.env[param];
		this.validateEnv(value, param);
		return value as Env[K];
	};

	private validateEnv<K extends keyof Env>(
		value: unknown,
		param: K,
	): asserts value is Env[K] {
		this.isString(value, param);
		if (param === 'NODE_ENV') {
			this.isMode(value);
		}
	}

	private isString(value: unknown, param: keyof Env): asserts value is string {
		if (typeof value !== 'string') {
			throw new Error(`Укажите обязательный параметр ${param}!`);
		}
	}

	private isMode(value: unknown): asserts value is Mode {
		if (value !== 'production' && value !== 'development' && value !== 'test') {
			throw new Error(
				`NODE_ENV должен быть production или development! Сейчас это ${value}`,
			);
		}
	}
}

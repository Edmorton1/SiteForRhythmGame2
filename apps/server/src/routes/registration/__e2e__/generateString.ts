import { randomBytes } from 'crypto';

export const randomString = (length: number = 244) => {
	const chars = 'qwertyuiopasdfghjklzxcvbnm';
	const bytes = randomBytes(length);

	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars[bytes[i] % chars.length];
	}

	return result;
};

export const randomEmail = () => {
	return randomString() + '@example.com';
};

// console.log(randomString() + '@example.com');

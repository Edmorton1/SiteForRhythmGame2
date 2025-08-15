import { processEnvServer } from "./ENV";

describe("ENV", () => {
	// it("Client", () => {
	// 	const result = processEnvClient("http", "localhost", "5000", "3000");
	// 	expect(result).toStrictEqual({
	// 		port: 5000,
	// 		host: "localhost",
	// 		url_server: "http://localhost:3000",
	// 		url_proxy: "http://localhost:5000/api",
	// 	});
	// });

	it("Server", () => {
		const result = processEnvServer("localhost", "3000");
		expect(result).toStrictEqual({
			port: 3000,
			host: "localhost",
		});
	});
});

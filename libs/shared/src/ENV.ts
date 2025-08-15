// import { PREFIX } from "@libs/shared/CONST";

// function checkEnvClient(
// 	protocol: string | undefined,
// 	host: string | undefined,
// 	port_client: string | undefined,
// 	port_server: string | undefined,
// ): asserts host is string {
// 	if (protocol !== "http" && protocol !== "https") {
// 		throw new Error(`Укажите переменную VITE_PROTOCOL`);
// 	}
// 	if (!host) {
// 		throw new Error(`Укажите переменную VITE_HOST`);
// 	}
// 	if (isNaN(Number(port_client))) {
// 		throw new Error(`Укажите переменную VITE_PORT`);
// 	}
// 	if (isNaN(Number(port_server))) {
// 		throw new Error(`Укажите переменную VITE_PORT_SERVER`);
// 	}
// }

// export function processEnvClient(
// 	protocol: string | undefined,
// 	host: string | undefined,
// 	port_client: string | undefined,
// 	port_server: string | undefined,
// ): { port: number; host: string; url_server: string; url_proxy: string } {
// 	checkEnvClient(protocol, host, port_client, port_server);

// 	const baseUrl = `${protocol}://${host}`;
// 	let url_server = baseUrl;
// 	let url_client = baseUrl;
// 	if (host === "localhost" || host.split(".").length === 4) {
// 		url_client += `:${port_client}`;
// 		url_server += `:${port_server}`;
// 	}

// 	return {
// 		port: Number(port_client),
// 		host,
// 		url_server,
// 		url_proxy: url_client + PREFIX,
// 	};
// }

function checkEnvServer(
	host: string | undefined,
	port: string | undefined,
): asserts host is string {
	if (!host) {
		throw new Error(`Укажите переменную HOST`);
	}
	if (isNaN(Number(port))) {
		throw new Error(`Укажите переменную PORT`);
	}
}

export function processEnvServer(
	host: string | undefined,
	port: string | undefined,
): { port: number; host: string } {
	checkEnvServer(host, port);

	return { port: Number(port), host };
}

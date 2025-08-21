import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { SERVER_PREFIX } from "../../libs/shared/CONST";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	process.env = { ...loadEnv(mode, process.cwd()), ...process.env };

	const protocol = process.env["VITE_PROTOCOL"];
	const host = process.env["VITE_HOST"];
	const port_client = process.env["VITE_PORT"];
	const port_server = process.env["VITE_PORT_SERVER"];

	if (protocol !== "http" && protocol !== "https") {
		throw new Error(`Укажите переменную VITE_PROTOCOL`);
	}
	if (!host) {
		throw new Error(`Укажите переменную VITE_HOST`);
	}
	if (isNaN(Number(port_client))) {
		throw new Error(`Укажите переменную VITE_PORT`);
	}
	if (isNaN(Number(port_server))) {
		throw new Error(`Укажите переменную VITE_PORT_SERVER`);
	}

	const baseUrl = `${protocol}://${host}`;
	let url_server = baseUrl;
	let url_client = baseUrl;
	if (host === "localhost" || host.split(".").length === 4) {
		url_client += `:${port_client}`;
		url_server += `:${port_server}`;
	}

	return {
		plugins: [react()],
		base: "/",
		resolve: {
			alias: {
				"@libs/types": path.resolve(
					__dirname,
					"./node_modules/@libs/types/dist",
				),
				"@libs/shared": path.resolve(
					__dirname,
					"./node_modules/@libs/shared/dist",
				),
				"@apps/client": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			host,
			port: Number(port_client),
			proxy: {
				[SERVER_PREFIX]: {
					target: url_server,
					changeOrigin: true,
				},
			},
		},
		define: {
			_URL_SERVER: JSON.stringify(url_client + SERVER_PREFIX),
		},
	};
});

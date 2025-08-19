"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEnvServer = processEnvServer;
function checkEnvServer(host, port) {
	if (!host) {
		throw new Error(
			"\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E HOST",
		);
	}
	if (isNaN(Number(port))) {
		throw new Error(
			"\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E PORT",
		);
	}
}
function processEnvServer(host, port) {
	checkEnvServer(host, port);
	return { port: Number(port), host: host };
}

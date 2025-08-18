import { LazyRegistration } from "@apps/client/LazyPages";
import { SERVER_PREFIX } from "@libs/shared/CONST";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
	console.log(SERVER_PREFIX);
	console.log(import.meta.env["VITE_MY_ENV"]);
	console.log(_URL_SERVER);

	useEffect(() => {
		void fetch(_URL_SERVER + "/users")
			.then(data => data.json())
			.then(data => console.log(data));
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route
					index
					element={<LazyRegistration />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

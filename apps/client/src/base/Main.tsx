import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Main() {
	return (
		<>
			<Header />
			<main
				style={{
					display: "flex",
					flexDirection: "column",
					width: "400px",
					gap: "15px",
				}}>
				<Outlet />
			</main>
		</>
	);
}

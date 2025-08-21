import { useState } from "react";

function Tracks() {
	const [state, setState] = useState<string[]>(["asd"]);
	const [val, setVal] = useState<string>("");

	return (
		<>
			<input
				type="text"
				onChange={event => setVal(event.target.value)}
				value={val}
			/>
			<button onClick={() => setState(prev => [...prev, val])}>Добавить</button>
			<button onClick={() => alert("asdasasd")}>asd</button>
			{state.map(e => (
				<div key={e}>{e}</div>
			))}
		</>
	);
}

export default Tracks;

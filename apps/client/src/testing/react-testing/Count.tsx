import { useState } from 'react';

export const Count = () => {
	const [count, setCount] = useState(0);

	return (
		<button onChange={() => setCount(count => count + 1)}>
			count is {count}
		</button>
	);
};

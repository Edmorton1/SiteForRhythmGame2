import '@testing-library/jest-dom';
import { Count } from './Count';
import { fireEvent, render, screen } from '@testing-library/react';
// import { render, screen } from "@testing-library/react";

describe('[COUNT]', () => {
	test('renders learn react click', async () => {
		render(<Count />);
		const button = screen.getByRole('button');
		await fireEvent.click(button);
		expect(button.textContent).toBe('count is 1');
		screen.debug();
	});
});

import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';

export const useLoadColors = () => {
	const theme = useTheme();

	useEffect(() => {
		console.log('Изменение theme');

		const root = document.documentElement;

		root.style.setProperty('--primary-main', theme.palette.primary.main);
		root.style.setProperty(
			'--primary-transparent',
			theme.palette.primary.transparent,
		);
		root.style.setProperty(
			'--background-default',
			theme.palette.background.default,
		);
	}, [theme]);
};

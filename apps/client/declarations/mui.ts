import '@mui/material/styles';

declare module '@mui/material/styles' {
	interface SimplePaletteColorOptions {
		transparent: string;
	}
	interface PaletteColor {
		transparent: string;
	}
}

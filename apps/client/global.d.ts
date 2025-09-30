import '@mui/material/styles';

declare const _URL_SERVER: string;

declare module '@mui/material/styles' {
	interface SimplePaletteColorOptions {
		transparent: string;
	}
	interface PaletteColor {
		transparent: string;
	}
}

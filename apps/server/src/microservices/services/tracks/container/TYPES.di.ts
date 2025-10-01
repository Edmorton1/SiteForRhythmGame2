export const TRACKS_FUNCTIONS = {
	getAllTracks: 'getAllTracks',
} as const;

export const TRACKS_MICRO_TYPES = {
	repositories: {
		tracks: Symbol.for('TracksRepository'),
	},
} as const;

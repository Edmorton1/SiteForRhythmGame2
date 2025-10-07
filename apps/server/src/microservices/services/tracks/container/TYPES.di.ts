export const TRACKS_MICRO_TYPES = {
	repositories: {
		tracks: Symbol.for('TracksRepository'),
		tracksSearch: Symbol.for('TracksSearchRepository'),
	},
} as const;

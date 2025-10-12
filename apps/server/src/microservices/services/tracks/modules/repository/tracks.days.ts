export class TracksDays {
	static readonly days = {
		today: 1,
		week: 7,
		month: 31,
		year: 365,
	} as const;

	static isDays(val: unknown): val is keyof typeof this.days {
		if (typeof val === 'string' && Object.keys(this.days).includes(val)) {
			return true;
		}
		return false;
	}
}

export type DaysKeys = keyof (typeof TracksDays)['days'];

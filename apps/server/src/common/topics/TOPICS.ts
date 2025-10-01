export const TOPICS = {
	requests: {
		auth: 'auth-request-topic',
		tracks: 'tracks-request-topic',
	},
	response: {
		auth: 'auth-response-topic',
		tracks: 'tracks-response-topic',
	},
} as const;

export type Topics = (typeof TOPICS)[keyof typeof TOPICS];
export type TopicsRequest =
	(typeof TOPICS.requests)[keyof typeof TOPICS.requests];
export type TopicsResponse =
	(typeof TOPICS.response)[keyof typeof TOPICS.response];

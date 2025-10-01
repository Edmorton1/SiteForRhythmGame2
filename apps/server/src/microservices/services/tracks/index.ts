import { TOPICS } from '../../../common/topics/TOPICS';
import { createMicroServer } from '../../config/createServer';
import { TracksMicroContainer } from './container/container.di';

createMicroServer(TracksMicroContainer, {
	topic_req: TOPICS.requests.tracks,
	topic_res: TOPICS.response.tracks,
	groupId: 'tracks-groupId',
});

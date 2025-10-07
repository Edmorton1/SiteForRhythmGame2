import { TOPICS } from '../../../common/topics/TOPICS';
import { startMicroServer } from '../../config/server/server.start';
import { TracksMicroContainer } from './container/container.di';

startMicroServer(TracksMicroContainer, {
	topic_req: TOPICS.requests.tracks,
	topic_res: TOPICS.response.tracks,
	groupId: 'tracks-groupId',
});

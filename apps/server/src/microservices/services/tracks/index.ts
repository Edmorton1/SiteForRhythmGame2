import { TOPICS } from '../../../common/topics/TOPICS';
import { startMicroServer } from '../../config/server/server.start';
import { TracksContainer } from './container/container.di';

startMicroServer(TracksContainer, {
	topic_req: TOPICS.requests.tracks,
	topic_res: TOPICS.response.tracks,
	groupId: 'tracks-groupId',
});

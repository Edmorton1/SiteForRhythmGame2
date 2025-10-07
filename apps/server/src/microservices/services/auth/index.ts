import { TOPICS } from '../../../common/topics/TOPICS';
import { startMicroServer } from '../../config/server/server.start';
import { authMicroContainer } from './container/container.di';

startMicroServer(authMicroContainer, {
	topic_req: TOPICS.requests.auth,
	topic_res: TOPICS.response.auth,
	groupId: 'auth-groupId',
});

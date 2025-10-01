import { TOPICS } from '../../../common/topics/TOPICS';
import { createMicroServer } from '../../config/createServer';
import { authMicroContainer } from './container/container.di';

createMicroServer(authMicroContainer, {
	topic_req: TOPICS.requests.auth,
	topic_res: TOPICS.response.auth,
	groupId: 'auth-groupId',
});

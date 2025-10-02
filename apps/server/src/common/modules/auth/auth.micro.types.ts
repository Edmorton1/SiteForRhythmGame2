import { UserProfile } from '../../../../../../libs/models/schemas/profile';
import { Payload } from '../../_declarations/session';

export type LoginServiceReturn = {
	payload: Payload;
	profile: UserProfile;
};

import { Container } from 'inversify';
import { rootMicroContainer } from '../../../config/containers/container.di';
import { _Repository } from '../modules/repository/_.repository';
import { __MICRO_TYPES } from './TYPES.di';
import { _Service } from '../modules/service/_.service';
import { MICRO_TYPES } from '../../../config/containers/TYPES.di';

export const _MicroContainer = new Container({ parent: rootMicroContainer });

_MicroContainer
	.bind<_Service>(MICRO_TYPES.controllers)
	.to(_Service)
	.inSingletonScope();

_MicroContainer
	.bind<_Repository>(__MICRO_TYPES.repositories._)
	.to(_Repository)
	.inSingletonScope();

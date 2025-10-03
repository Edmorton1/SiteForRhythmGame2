import { inject, injectable } from 'inversify';
import { MICRO_TYPES } from './containers/TYPES.di';
import { ServiceCollector } from './service.collector';
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { SERVICES_TYPES } from '../../common/containers/SERVICES_TYPES.di';
import { Producer } from 'kafkajs';
import { LoggerService } from '../../common/services/logger/logger.service';
import type { TopicsRequest, TopicsResponse } from '../../common/topics/TOPICS';
import {
	KafkaError,
	KafkaResponse,
} from '../../common/services/kafka/kafka.types';

export type KafkaMicroserviceOptions = {
	topic_req: TopicsRequest;
	topic_res: TopicsResponse;
	groupId: string;
};

@injectable()
export class KafkaMicroservice {
	constructor(
		@inject(MICRO_TYPES.app.composite)
		private readonly composite: ServiceCollector,
		@inject(SERVICES_TYPES.kafka)
		private readonly kafkaService: KafkaService,
		@inject(SERVICES_TYPES.logger)
		private readonly logger: LoggerService,
	) {}

	private producer?: Producer;

	//@ts-ignore
	private send = (data: KafkaResponse | KafkaError, topic: TopicsResponse) => {
		if (!this.producer) throw new Error('ОШИБКА: Не указан продюсер');
		this.producer.send({
			topic,
			messages: [
				{
					// TODO: Убрать возврат func в возврате
					value: JSON.stringify({ ...data }),
				},
			],
		});
	};

	start = async (options: KafkaMicroserviceOptions) => {
		console.log(`СТАРТ ServerMicroservice`);
		const consumer = this.kafkaService.createConsumer(options.groupId);
		await consumer.connect();
		await consumer.subscribe({
			topic: options.topic_req,
			fromBeginning: false,
		});

		const producer = this.kafkaService.createProducer();
		await producer.connect();
		this.producer = producer;

		await consumer.run({
			eachMessage: async ({ message }) => {
				const value = JSON.parse(message.value!.toString());
				console.log(value);
				this.composite
					.use(value.func, value.message)
					.then(result => {
						this.send(
							{
								func: value.func,
								id: value.id,
								message: result,
								status: 'conform',
							},
							options.topic_res,
						);
					})
					.catch(err => {
						this.logger.logger.error({ ERROR_IN_RESPONSE: err });
						this.send(
							{
								func: value.func,
								id: value.id,
								message: err,
								status: 'error',
							},
							options.topic_res,
						);
					});
			},
		});
	};
}

import { inject, injectable } from 'inversify';
import { TopicsRequest, TopicsResponse } from '../../../common/topics/TOPICS';
import { MICRO_TYPES } from '../containers/TYPES.di';
import { ServiceCollector } from '../service/service.collector';
import { SERVICES_TYPES } from '../../../common/containers/SERVICES_TYPES.di';
import { KafkaService } from '../../../common/services/kafka/kafka.service';
import { LoggerService } from '../../../common/services/logger/logger.service';
import { Producer } from 'kafkajs';
// prettier-ignore
import { KafkaError, KafkaResponse } from '../../../common/services/kafka/kafka.types';

export type KafkaLoadingOptions = {
	topic_req: TopicsRequest;
	topic_res: TopicsResponse;
	groupId: string;
};

@injectable()
export class KafkaLoader {
	constructor(
		@inject(MICRO_TYPES.app.baseServiceCollector)
		private readonly composite: ServiceCollector,
		@inject(SERVICES_TYPES.kafka)
		private readonly kafkaService: KafkaService,
		@inject(SERVICES_TYPES.logger)
		private readonly logger: LoggerService,
	) {}

	private producer?: Producer;

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

	private loadConsumer = async (options: KafkaLoadingOptions) => {
		const consumer = this.kafkaService.createConsumer(options.groupId);
		await consumer.connect();
		await consumer.subscribe({
			topic: options.topic_req,
			fromBeginning: false,
		});

		return consumer;
	};

	private loadProducer = async () => {
		const producer = this.kafkaService.createProducer();
		await producer.connect();
		this.producer = producer;
	};

	start = async (options: KafkaLoadingOptions) => {
		console.log(`СТАРТ ServerMicroservice`);

		const consumer = await this.loadConsumer(options);
		await this.loadProducer();

		await consumer.run({
			eachMessage: async ({ message }) => {
				const value = JSON.parse(message.value!.toString());
				console.log(value);
				this.composite
					.use(value.func, value.message)

					.then(result => {
						this.send(
							{
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

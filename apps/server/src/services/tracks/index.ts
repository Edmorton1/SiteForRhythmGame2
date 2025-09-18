// import 'reflect-metadata';
// import dotenv from 'dotenv';
// dotenv.config();
// import { ServerExpress } from '../../config/server.express';
// import { TRACKS_TYPES } from './containers/TYPES.di';
// import { tracksContainer } from './containers/container.di';

import { KafkaService } from '../../common/services/kafka/kafka.service';
import { tracksContainer } from './containers/container.di';
import { TRACKS_TYPES } from './containers/TYPES.di';
import dotenv from 'dotenv';
import { TracksService } from './module/service/service';
dotenv.config();

// (() => {
// 	console.log('TRACKS', TRACKS_TYPES.modules.tracks.service);
// 	const server = tracksContainer.get<ServerExpress>(
// 		TRACKS_TYPES.app.ServerExpress,
// 	);

// 	server.start();
// })();

// ЗАПУСКАЕТ КОНСЮМЕР, КОТОРЫЙ выбрасывает ответы

interface Value {
	id: string;
	func: string;
	message: any;
}

(async () => {
	const kafka = tracksContainer.get<KafkaService>(TRACKS_TYPES.services.kafka);
	const consumer = kafka.createConsumer('tracks-group');
	await consumer.connect();
	await consumer.subscribe({ topic: 'request-topic', fromBeginning: false });
	const producer = kafka.createProducer();
	producer.connect();
	await consumer.run({
		eachMessage: async ({ message }) => {
			const value = JSON.parse(message.value!.toString()) as Value;
			console.log(value);

			const tracksService = tracksContainer.get<TracksService>(
				TRACKS_TYPES.modules.tracks.service,
			);

			switch (value.func) {
				case 'getValue':
					producer.send({
						topic: 'response-topic',
						messages: [
							{
								value: JSON.stringify({
									message: tracksService.getValue(),
									id: value.id,
								}),
							},
						],
					});
			}
		},
	});
})();

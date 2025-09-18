import { EventEmitter } from 'events';

export const emitter = new EventEmitter();

emitter.addListener('message', msg => {
	console.log('EVENT MESSAGE', msg);
});

// emitter.emit('message', 'ASasdasfasfa');

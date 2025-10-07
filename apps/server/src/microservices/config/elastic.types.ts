export abstract class ElasticBase {
	abstract collect: () => Promise<void>;
}

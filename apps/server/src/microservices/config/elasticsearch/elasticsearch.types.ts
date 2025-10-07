export abstract class ElasticSearchBase {
	abstract collect: () => Promise<void>;
}

import { calc } from "./function";

describe("[FUNCTION TESTING]", () => {
	it("should be 4", () => {
		const result = calc(2, 2);
		expect(result).toStrictEqual(4);
	});
});

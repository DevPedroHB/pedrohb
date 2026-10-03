import { escapeRegExp } from "./escape-reg-exp.js";

describe("escapeRegExp", () => {
	it("should escape all special regex characters", () => {
		expect(escapeRegExp(`.*+?^\${}()|[]\\`)).toBe(
			"\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\",
		);
	});

	it("should not modify strings without special characters", () => {
		expect(escapeRegExp("abc123")).toBe("abc123");
	});

	it("should produce a pattern that matches the original string literally", () => {
		const value = "a.b*c(d)e[f]g?h|i$j^k+l{m}n\\o";

		expect(new RegExp(escapeRegExp(value)).test(value)).toBe(true);
	});
});

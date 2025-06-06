import { slugify } from "./slugify";

describe("slugify", () => {
	it("should be able to convert a simple string to lowercase slug", () => {
		expect(slugify("Hello World")).toBe("hello-world");
	});

	it("should be able to handle custom separator", () => {
		expect(slugify("Hello World", { separator: "_" })).toBe("hello_world");
	});

	it("should be able to convert to uppercase when case is 'upper'", () => {
		expect(slugify("Hello World", { case: "upper" })).toBe("HELLO-WORLD");
	});

	it("should not be able to decamelize if decamelize option is false", () => {
		expect(slugify("camelCaseText", { decamelize: false })).toBe(
			"camelcasetext",
		);
	});

	it("should be able to decamelize camelCase words when enabled", () => {
		expect(slugify("camelCaseText")).toBe("camel-case-text");
	});

	it("should be able to apply custom replacements before slugifying", () => {
		expect(
			slugify("Hello+World!", {
				customReplacements: [["+", " plus "]],
			}),
		).toBe("hello-plus-world");
	});

	it("should be able to preserve specific characters", () => {
		expect(
			slugify("Hello & World", {
				preserveCharacters: ["&"],
			}),
		).toBe("hello-&-world");
	});

	it("should not be able to include accents or diacritics in output", () => {
		expect(slugify("Olá, São Paulo!")).toBe("ola-sao-paulo");
	});

	it("should be able to collapse multiple separators", () => {
		expect(slugify("Hello---World", { separator: "-" })).toBe("hello-world");
	});

	it("should be able to trim separators from start and end", () => {
		expect(slugify("---Hello World---")).toBe("hello-world");
	});

	it("should be able to return an empty string for empty input", () => {
		expect(slugify("")).toBe("");
	});
});

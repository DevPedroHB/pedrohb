import { Slug } from "./slug";

describe("Slug", () => {
	it("should be able to create a slug from a simple string", () => {
		const slug = Slug.create("Hello World");

		expect(slug.toValue()).toBe("hello-world");
	});

	it("should be able to handle camelCase strings", () => {
		const slug = Slug.create("helloWorld");

		expect(slug.toValue()).toBe("hello-world");
	});

	it("should not be able to decamelize when decamelize option is false", () => {
		const slug = Slug.create("helloWorld", { decamelize: false });

		expect(slug.toValue()).toBe("helloworld");
	});

	it("should be able to apply custom replacements", () => {
		const slug = Slug.create("This is a test", {
			customReplacements: [["test", "slug"]],
		});

		expect(slug.toValue()).toBe("this-is-a-slug");
	});

	it("should be able to preserve specific characters", () => {
		const slug = Slug.create("100% sure!", {
			preserveCharacters: ["%"],
		});

		expect(slug.toValue()).toBe("100%-sure");
	});

	it("should be able to use a custom separator", () => {
		const slug = Slug.create("hello world", {
			separator: "_",
		});

		expect(slug.toValue()).toBe("hello_world");
	});

	it("should be able to convert slug to upper case", () => {
		const slug = Slug.create("hello world", {
			case: "upper",
		});

		expect(slug.toValue()).toBe("HELLO-WORLD");
	});

	it("should not be able to include leading or trailing separators", () => {
		const slug = Slug.create("--hello--world--");

		expect(slug.toValue()).toBe("hello-world");
	});

	it("should be able to collapse duplicate separators", () => {
		const slug = Slug.create("hello    world");

		expect(slug.toValue()).toBe("hello-world");
	});

	it("should be able to remove accents and diacritics", () => {
		const slug = Slug.create("Olá, mundo!");

		expect(slug.toValue()).toBe("ola-mundo");
	});
});

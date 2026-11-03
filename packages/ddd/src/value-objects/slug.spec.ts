import { Slug } from "./slug.js";

describe("Slug", () => {
	it("creates a normalized slug", () => {
		const slug = Slug.create("  Olá, Mundo!  ");

		expect(slug.slug).toBe("ola-mundo");
		expect(slug.toJSON()).toEqual({ slug: "ola-mundo" });
	});

	it("supports custom slugify options", () => {
		expect(
			Slug.slugify("Hello World", { lower: false, replacement: "_" }),
		).toBe("Hello_World");
	});
});

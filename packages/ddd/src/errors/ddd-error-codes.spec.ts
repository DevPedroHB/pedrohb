import {
	DDD_ERROR_CODES,
	DDD_ERROR_TRANSLATIONS,
	type DDDErrorCatalogCode,
	type DDDErrorLocale,
} from "./ddd-error-codes.js";

describe("DDD_ERROR_CODES", () => {
	it("should define a descriptor for each code", () => {
		for (const [key, descriptor] of Object.entries(DDD_ERROR_CODES)) {
			expect(descriptor).toEqual({ code: key, message: expect.any(String) });
		}
	});

	it("should freeze the catalog and its descriptors", () => {
		expect(Object.isFrozen(DDD_ERROR_CODES)).toBe(true);

		for (const descriptor of Object.values(DDD_ERROR_CODES)) {
			expect(Object.isFrozen(descriptor)).toBe(true);
		}
	});
});

describe("DDD_ERROR_TRANSLATIONS", () => {
	it("should translate every code to english keeping the placeholders", () => {
		for (const [key, descriptor] of Object.entries(DDD_ERROR_CODES)) {
			const translated = DDD_ERROR_TRANSLATIONS.en[key as DDDErrorCatalogCode];

			expect(translated).toEqual(expect.any(String));

			for (const placeholder of descriptor.message.match(/\{\w+\}/g) ?? []) {
				expect(translated).toContain(placeholder);
			}
		}
	});

	it("should freeze the translations and each locale", () => {
		expect(Object.isFrozen(DDD_ERROR_TRANSLATIONS)).toBe(true);
		expect(Object.isFrozen(DDD_ERROR_TRANSLATIONS.en)).toBe(true);
	});
});

describe("inferred types", () => {
	it("should infer the catalog codes and the available locales", () => {
		expectTypeOf<DDDErrorCatalogCode>().toEqualTypeOf<
			| "INTERNAL_SERVER_ERROR"
			| "METHOD_NOT_IMPLEMENTED"
			| "INVALID_ENTITY_ID"
			| "INVALID_TIMESTAMPS"
			| "DOMAIN_EVENT_DISPATCH_FAILED"
			| "DOMAIN_EVENTS_DISPATCH_FAILED"
			| "DOMAIN_EVENT_NOT_FOUND"
		>();
		expectTypeOf<DDDErrorLocale>().toEqualTypeOf<"en">();
	});
});

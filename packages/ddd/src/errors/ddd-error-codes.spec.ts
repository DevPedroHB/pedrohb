import {
	DDD_ERROR_CODES,
	DDD_ERROR_TRANSLATIONS,
	type DDDErrorCatalogCode,
	type DDDErrorLocale,
} from "./ddd-error-codes.js";

describe("DDD_ERROR_CODES", () => {
	it("should define a descriptor for each code", () => {
		expect(DDD_ERROR_CODES.INTERNAL_SERVER_ERROR).toEqual({
			code: "INTERNAL_SERVER_ERROR",
			message: "Ocorreu um erro interno no servidor.",
		});
		expect(DDD_ERROR_CODES.METHOD_NOT_IMPLEMENTED).toEqual({
			code: "METHOD_NOT_IMPLEMENTED",
			message: "O método '{method}' não está implementado.",
		});
	});

	it("should freeze the catalog and its descriptors", () => {
		expect(Object.isFrozen(DDD_ERROR_CODES)).toBe(true);
		expect(Object.isFrozen(DDD_ERROR_CODES.INTERNAL_SERVER_ERROR)).toBe(true);
		expect(Object.isFrozen(DDD_ERROR_CODES.METHOD_NOT_IMPLEMENTED)).toBe(true);
	});
});

describe("DDD_ERROR_TRANSLATIONS", () => {
	it("should translate every code to english keeping the placeholders", () => {
		expect(DDD_ERROR_TRANSLATIONS.en.INTERNAL_SERVER_ERROR).toBe(
			"An internal server error has occurred.",
		);
		expect(DDD_ERROR_TRANSLATIONS.en.METHOD_NOT_IMPLEMENTED).toBe(
			"The method '{method}' is not implemented.",
		);
	});

	it("should freeze the translations and each locale", () => {
		expect(Object.isFrozen(DDD_ERROR_TRANSLATIONS)).toBe(true);
		expect(Object.isFrozen(DDD_ERROR_TRANSLATIONS.en)).toBe(true);
	});
});

describe("inferred types", () => {
	it("should infer the catalog codes and the available locales", () => {
		expectTypeOf<DDDErrorCatalogCode>().toEqualTypeOf<
			"INTERNAL_SERVER_ERROR" | "METHOD_NOT_IMPLEMENTED"
		>();
		expectTypeOf<DDDErrorLocale>().toEqualTypeOf<"en">();
	});
});

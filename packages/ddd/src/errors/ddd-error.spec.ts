import { DDDError } from "./ddd-error.js";

describe("DDDError", () => {
	it("should create an error from the catalog descriptor", () => {
		const error = new DDDError("METHOD_NOT_IMPLEMENTED", {
			params: { method: "foo" },
		});

		expect(error.name).toBe("DDDError");
		expect(error.code).toBe("METHOD_NOT_IMPLEMENTED");
		expect(error.message).toBe("O método 'foo' não está implementado.");
		expect(error.params).toEqual({ method: "foo" });
	});

	it("should create an error without options for messages without placeholders", () => {
		const error = new DDDError("INTERNAL_SERVER_ERROR");

		expect(error.code).toBe("INTERNAL_SERVER_ERROR");
		expect(error.message).toBe("Ocorreu um erro interno no servidor.");
		expect(error.params).toBeUndefined();
	});

	it("should translate the message with the catalog translations", () => {
		const withParams = new DDDError("METHOD_NOT_IMPLEMENTED", {
			params: { method: "foo" },
		});
		const withoutParams = new DDDError("INTERNAL_SERVER_ERROR");

		expect(withParams.translate("en")).toBe(
			"The method 'foo' is not implemented.",
		);
		expect(withoutParams.translate("en")).toBe(
			"An internal server error has occurred.",
		);
	});

	it("should identify instances through the static is guard", () => {
		expect(DDDError.is(new DDDError("INTERNAL_SERVER_ERROR"))).toBe(true);
		expect(DDDError.is(new Error("Mensagem do erro."))).toBe(false);
	});
});

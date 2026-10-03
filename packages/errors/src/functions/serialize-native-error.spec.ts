import { serializeNativeError } from "./serialize-native-error.js";

describe("serializeNativeError", () => {
	it("should serialize message and name", () => {
		expect(serializeNativeError(new Error("Mensagem do erro."))).toStrictEqual({
			message: "Mensagem do erro.",
			name: "Error",
		});
	});

	it("should serialize the cause when present", () => {
		const error = new Error("Erro externo.", {
			cause: new Error("Causa do erro."),
		});

		expect(serializeNativeError(error)).toStrictEqual({
			cause: {
				message: "Causa do erro.",
				name: "Error",
			},
			message: "Erro externo.",
			name: "Error",
		});
	});

	it("should serialize the errors of an AggregateError", () => {
		const error = new AggregateError(
			[new Error("Primeiro erro."), new Error("Segundo erro.")],
			"Vários erros.",
		);

		expect(serializeNativeError(error)).toStrictEqual({
			errors: [
				{
					message: "Primeiro erro.",
					name: "Error",
				},
				{
					message: "Segundo erro.",
					name: "Error",
				},
			],
			message: "Vários erros.",
			name: "AggregateError",
		});
	});

	it("should include the stack only when requested", () => {
		const error = new Error("Mensagem do erro.");

		expect(serializeNativeError(error).stack).toBeUndefined();
		expect(serializeNativeError(error, true).stack).toBe(error.stack);
	});
});

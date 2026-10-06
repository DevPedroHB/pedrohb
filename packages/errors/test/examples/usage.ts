import { BaseError } from "#/index.js";
import { ExampleError, TranslatedExampleError } from "./base-error.js";
import { CustomDelimiterError } from "./custom-delimiters.js";

export const methodError = new ExampleError("METHOD_NOT_IMPLEMENTED", {
	params: { method: "deleteUser" },
});

export const userNotFoundError = new ExampleError("USER_NOT_FOUND", {
	params: { userId: "user-42" },
	cause: new Error("Registro ausente no banco de dados"),
});

export const internalServerError = new ExampleError("INTERNAL_SERVER_ERROR");

export const validationError = new ExampleError("VALIDATION_FAILED", {
	params: { field: "email", value: "não é um e-mail" },
	cause: { source: "request-body", attempt: 2 },
});

// O compilador exige os placeholders e códigos corretos:
// new ExampleError("METHOD_NOT_IMPLEMENTED", { params: {} }); // falta method
// new ExampleError("METHOD_NOT_IMPLEMENTED", {
//   params: { method: "save", unknownParam: true }, // unknownParam inválido
// });
// new ExampleError("UNKNOWN_ERROR"); // código inexistente

export const translatedEnglishMessage = new TranslatedExampleError(
	"METHOD_NOT_IMPLEMENTED",
	{ params: { method: "deleteUser" } },
).translate("en");

// Apenas os idiomas declarados nas traduções são aceitos:
// methodError.translate("fr"); // erro de tipo: idioma não declarado

export const customDelimiterError = new CustomDelimiterError(
	"RESOURCE_NOT_FOUND",
	{ params: { resource: "invoice-8", tenant: "acme" } },
);
export const customDelimiterEnglishMessage =
	customDelimiterError.translate("en");

export function inspectUnknownError(value: unknown) {
	if (BaseError.is(value)) {
		return {
			code: value.code,
			message: value.message,
			serialized: value.serialize(),
		};
	}

	if (ExampleError.is(value)) {
		return value.code;
	}

	return undefined;
}

export const serializedError = userNotFoundError.serialize();
export const serializedErrorWithStack = userNotFoundError.serialize(true);
export const jsonError = JSON.stringify(userNotFoundError);
export const serializedCause = BaseError.serializeCauseError(
	new Error("Falha original"),
);

// translate() não altera a mensagem original nem a serialização do erro.
export const messageBeforeTranslation = userNotFoundError.message;
export const messageInEnglish = new TranslatedExampleError("USER_NOT_FOUND", {
	params: { userId: "user-42" },
}).translate("en");

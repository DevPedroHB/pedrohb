import { type CatalogCode, defineErrorCatalog } from "#/index.js";

/** Mensagens do catálogo são o idioma padrão (neste exemplo, português). */
export const EXAMPLE_ERROR_CODES = defineErrorCatalog({
	INTERNAL_SERVER_ERROR: "Ocorreu um erro interno no servidor.",
	METHOD_NOT_IMPLEMENTED: "O método '{method}' não está implementado.",
	USER_NOT_FOUND: "Usuário '{userId}' não foi encontrado.",
	VALIDATION_FAILED: "O campo '{field}' recebeu o valor '{value}'.",
});

export type ExampleErrorCodes = typeof EXAMPLE_ERROR_CODES;
export type ExampleErrorCatalogCode = CatalogCode<ExampleErrorCodes>;

export const exampleDescriptor = EXAMPLE_ERROR_CODES.USER_NOT_FOUND;
export const exampleDescriptorCode = exampleDescriptor.code;
export const exampleDescriptorMessage = exampleDescriptor.message;

// Imutável em TypeScript e em runtime (Object.freeze):
// EXAMPLE_ERROR_CODES.USER_NOT_FOUND = EXAMPLE_ERROR_CODES.METHOD_NOT_IMPLEMENTED;
// EXAMPLE_ERROR_CODES.USER_NOT_FOUND.message = "Outra mensagem";

/** Validação em runtime útil para definições vindas de JSON ou `any`. */
export function catalogFromUntrustedDefinitions(
	definitions: Record<string, string>,
) {
	return defineErrorCatalog(definitions as never);
}

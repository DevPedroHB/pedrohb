import {
	type CatalogCode,
	defineErrorCatalog,
	defineErrorTranslations,
	type ErrorTranslationLocale,
} from "@pedrohb/errors";

export const DDD_ERROR_CODES = defineErrorCatalog({
	INTERNAL_SERVER_ERROR: "Ocorreu um erro interno no servidor.",
	METHOD_NOT_IMPLEMENTED: "O método '{method}' não está implementado.",
	INVALID_ENTITY_ID: "O identificador '{id}' é inválido.",
	INVALID_TIMESTAMPS:
		"Timestamps inválidos: createdAt '{createdAt}' e updatedAt '{updatedAt}'. Ambos devem ser datas válidas, e updatedAt não pode ser anterior a createdAt.",
	DOMAIN_EVENT_DISPATCH_FAILED:
		"Falha ao despachar o evento '{event}' em {count} handler(s).",
	DOMAIN_EVENTS_DISPATCH_FAILED: "Falha ao despachar {count} evento(s).",
	DOMAIN_EVENT_NOT_FOUND: "O evento '{event}' não foi encontrado.",
	HANDLER_DISPOSED:
		"O handler '{handler}' foi descartado e não pode ser reinscrito.",
	ITEM_ALREADY_EXISTS: "Já existe um item com {field} '{value}'.",
	ITEM_NOT_FOUND: "Nenhum item encontrado com {field} '{value}'.",
	INVALID_TTL:
		"O TTL '{ttl}' é inválido. Deve ser um número positivo de segundos.",
});

export type DDDErrorCodes = typeof DDD_ERROR_CODES;

export type DDDErrorCatalogCode = CatalogCode<DDDErrorCodes>;

export const DDD_ERROR_TRANSLATIONS = defineErrorTranslations(DDD_ERROR_CODES, {
	en: {
		INTERNAL_SERVER_ERROR: "An internal server error has occurred.",
		METHOD_NOT_IMPLEMENTED: "The method '{method}' is not implemented.",
		INVALID_ENTITY_ID: "The identifier '{id}' is invalid.",
		INVALID_TIMESTAMPS:
			"Invalid timestamps: createdAt '{createdAt}' and updatedAt '{updatedAt}'. Both must be valid dates, and updatedAt cannot be earlier than createdAt.",
		DOMAIN_EVENT_DISPATCH_FAILED:
			"Failed to dispatch the event '{event}' to {count} handler(s).",
		DOMAIN_EVENTS_DISPATCH_FAILED: "Failed to dispatch {count} event(s).",
		DOMAIN_EVENT_NOT_FOUND: "The event '{event}' was not found.",
		HANDLER_DISPOSED:
			"The handler '{handler}' has been dropped and cannot be re-registered.",
		ITEM_ALREADY_EXISTS: "An item with {field} '{value}' already exists.",
		ITEM_NOT_FOUND: "No item found with {field} '{value}'.",
		INVALID_TTL:
			"The TTL '{ttl}' is invalid. It must be a positive number of seconds.",
	},
});

export type DDDErrorTranslations = typeof DDD_ERROR_TRANSLATIONS;

export type DDDErrorLocale = ErrorTranslationLocale<DDDErrorTranslations>;

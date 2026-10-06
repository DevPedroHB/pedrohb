import {
	DEFAULT_PARAM_DELIMITERS,
	type DefaultParamDelimiters,
} from "./functions/create-param-placeholder.js";
import { BASE_ERROR_BRAND, isBaseError } from "./functions/is-base-error.js";
import { serializeBaseError } from "./functions/serialize-base-error.js";
import { serializeCauseError } from "./functions/serialize-cause-error.js";
import {
	type ErrorMessageArgs,
	interpolateErrorMessage,
} from "./interpolate-error-message.js";
import type { CatalogCode } from "./types/catalog-code.js";
import type { CatalogDescriptor } from "./types/catalog-descriptor.js";
import type { ErrorCatalog } from "./types/error-catalog.js";
import type { ErrorParamDelimiters } from "./types/error-param-delimiters.js";
import type { ErrorParams } from "./types/error-params.js";
import type { ErrorTranslations } from "./types/error-translations.js";

/**
 * Opções aceitas pelo construtor de {@link BaseError}.
 *
 * Estende `ErrorOptions` (que fornece `cause`) e acrescenta:
 * - `delimiters`: delimitadores dos placeholders da mensagem sempre opcional;
 * - `params`: valores dos placeholders **exigido apenas** quando a mensagem
 *   do código possui placeholders (ver {@link ErrorParams}). Se a mensagem não
 *   tiver placeholders a propriedade `params` não existe no tipo.
 *
 * @template Catalog - Catálogo de erros ao qual o código pertence. Por padrão,
 * `ErrorCatalog`.
 * @template Code - Código do erro dentro do catálogo. Por padrão, todos os
 * códigos do catálogo.
 * @template Delimiters - Tipo dos delimitadores dos placeholders. Por padrão,
 * {@link DefaultParamDelimiters}.
 *
 * @example
 * ```ts
 * // Mensagem sem placeholders: apenas `cause` e `delimiters` são aceitos
 * type A = BaseErrorOptions<typeof ERROR_CODES, "INVALID_TOKEN">;
 * // ErrorOptions & { delimiters?: DefaultParamDelimiters }
 *
 * // Mensagem com placeholders: `params` é obrigatório
 * type B = BaseErrorOptions<typeof ERROR_CODES, "USER_NOT_FOUND">;
 * // ErrorOptions & { params: Readonly<{ id: ErrorParamValue }>; delimiters?: ... }
 * ```
 */
export type BaseErrorOptions<
	Catalog extends ErrorCatalog = ErrorCatalog,
	Code extends CatalogCode<Catalog> = CatalogCode<Catalog>,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
> = [ErrorParams<Catalog, Code, Delimiters>] extends [never]
	? ErrorOptions & {
			delimiters?: Delimiters;
		}
	: ErrorOptions & {
			params: ErrorParams<Catalog, Code, Delimiters>;
			delimiters?: Delimiters;
		};

/**
 * Deriva em tempo de compilação a lista de argumentos de opções do
 * construtor de {@link BaseError}.
 *
 * - Se a mensagem **não** tiver placeholders `options` é opcional.
 * - Se tiver placeholders `options` é obrigatório (pois deve conter `params`).
 *
 * É pensado para ser usado como tipo de parâmetro rest (`...args`).
 *
 * @template Catalog - Catálogo de erros ao qual o código pertence. Por padrão,
 * `ErrorCatalog`.
 * @template Code - Código do erro dentro do catálogo. Por padrão, todos os
 * códigos do catálogo.
 * @template Delimiters - Tipo dos delimitadores dos placeholders. Por padrão,
 * {@link DefaultParamDelimiters}.
 *
 * @example
 * ```ts
 * type A = BaseErrorOptionsArgs<typeof ERROR_CODES, "INVALID_TOKEN">;
 * // [options?: BaseErrorOptions<...>]
 *
 * type B = BaseErrorOptionsArgs<typeof ERROR_CODES, "USER_NOT_FOUND">;
 * // [options: BaseErrorOptions<...>]
 * ```
 */
export type BaseErrorOptionsArgs<
	Catalog extends ErrorCatalog = ErrorCatalog,
	Code extends CatalogCode<Catalog> = CatalogCode<Catalog>,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
> = [ErrorParams<Catalog, Code, Delimiters>] extends [never]
	? [options?: BaseErrorOptions<Catalog, Code, Delimiters>]
	: [options: BaseErrorOptions<Catalog, Code, Delimiters>];

/**
 * Classe base abstrata para erros tipados a partir de um catálogo de erros.
 *
 * Cada erro é criado a partir de um descritor do catálogo (código e mensagem).
 * A mensagem é interpolada com os `params` informados e o tipo dos `params` é
 * derivado dos placeholders da mensagem, de modo que o compilador exige
 * exatamente os parâmetros necessários.
 *
 * O construtor é `protected`: a classe não pode ser instanciada diretamente e
 * deve ser estendida por classes que escolhem o descritor e repassam as
 * opções.
 *
 * Além de `message`, `cause`, `stack` e `name` herdados de `Error`, a
 * instância expõe:
 * - `code`: o código do erro, com tipo literal;
 * - `params`: os parâmetros usados na interpolação (ou `undefined`);
 * - {@link BaseError.serialize} e {@link BaseError.toJSON} para serialização;
 * - uma marca interna ({@link BASE_ERROR_BRAND}) que permite reconhecer o
 *   erro com {@link isBaseError} mesmo com múltiplas cópias do pacote.
 *
 * O `name` do erro é o nome da classe concreta (`new.target.name`) e o
 * protótipo é ajustado explicitamente para que `instanceof` funcione em
 * subclasses mesmo em alvos de compilação antigos.
 *
 * @template Catalog - Catálogo de erros ao qual o código pertence. Por padrão,
 * `ErrorCatalog`.
 * @template Code - Código do erro dentro do catálogo. Por padrão, todos os
 * códigos do catálogo.
 * @template Delimiters - Tipo dos delimitadores dos placeholders. Por padrão,
 * {@link DefaultParamDelimiters}.
 * @template Locale - União dos idiomas aceitos por {@link BaseError.translate}
 * (ex.: `"en" | "es"`). Deve acompanhar o getter `translations` da subclasse
 * e pode ser obtida com `ErrorTranslationLocale`. Por padrão, `never`: sem
 * traduções, nenhum idioma é aceito.
 *
 * @example
 * ```ts
 * const TEST_ERROR_CODES = defineErrorCatalog({
 *   USER_NOT_FOUND: "Usuário {id} não encontrado",
 *   INVALID_TOKEN: "Token inválido",
 * });
 *
 * type TestErrorCodes = typeof TEST_ERROR_CODES;
 *
 * class UserNotFoundError extends BaseError<TestErrorCodes, "USER_NOT_FOUND"> {
 *   public constructor(id: number, options?: ErrorOptions) {
 *     super(TEST_ERROR_CODES.USER_NOT_FOUND, { params: { id }, ...options });
 *   }
 * }
 *
 * class InvalidTokenError extends BaseError<TestErrorCodes, "INVALID_TOKEN"> {
 *   public constructor(options?: ErrorOptions) {
 *     super(TEST_ERROR_CODES.INVALID_TOKEN, options);
 *   }
 * }
 *
 * const erro = new UserNotFoundError(42);
 * erro.message; // "Usuário 42 não encontrado"
 * erro.code;    // "USER_NOT_FOUND"
 * erro.params;  // { id: 42 }
 * erro.name;    // "UserNotFoundError"
 *
 * BaseError.is(erro);                // true
 * JSON.stringify(erro);              // usa toJSON(), sem stack trace
 * erro.serialize(true);              // inclui o stack trace
 * ```
 *
 * @example
 * Com traduções (veja {@link BaseError.translate}):
 * ```ts
 * const TEST_ERROR_TRANSLATIONS = defineErrorTranslations(TEST_ERROR_CODES, {
 *   en: {
 *     USER_NOT_FOUND: "User {id} not found",
 *     INVALID_TOKEN: "Invalid token",
 *   },
 * });
 *
 * class TestError<Code extends CatalogCode<TestErrorCodes>> extends BaseError<
 *   TestErrorCodes,
 *   Code,
 *   DefaultParamDelimiters,
 *   ErrorTranslationLocale<typeof TEST_ERROR_TRANSLATIONS>
 * > {
 *   protected override get translations() {
 *     return TEST_ERROR_TRANSLATIONS;
 *   }
 *   // ...
 * }
 *
 * erro.message;         // "Usuário 42 não encontrado" (idioma do catálogo)
 * erro.translate("en"); // "User 42 not found"
 * ```
 */
export abstract class BaseError<
	Catalog extends ErrorCatalog = ErrorCatalog,
	Code extends CatalogCode<Catalog> = CatalogCode<Catalog>,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
	Locale extends string = never,
> extends Error {
	/** Código do erro conforme o catálogo (ex.: `"USER_NOT_FOUND"`). */
	public readonly code: Code;
	/**
	 * Parâmetros usados para interpolar a mensagem. É `undefined` quando a
	 * mensagem não possui placeholders (ou quando nenhum `params` foi informado).
	 */
	public readonly params?: ErrorParams<Catalog, Code, Delimiters>;
	/**
	 * Delimitadores usados na interpolação da mensagem, guardados para que
	 * {@link BaseError.translate} interpole a tradução da mesma forma. É um
	 * campo privado: não aparece em serializações nem em `Object.keys`.
	 */
	readonly #delimiters: Delimiters;

	/**
	 * Cria um erro a partir de um descritor do catálogo.
	 *
	 * A mensagem do descritor é interpolada com `options.params` usando os
	 * delimitadores de `options.delimiters` (por padrão,
	 * {@link DEFAULT_PARAM_DELIMITERS}). Os delimitadores são guardados em um
	 * campo privado, usado apenas para interpolar traduções em
	 * {@link BaseError.translate}, e não são expostos na instância. O objeto
	 * `options` também é repassado ao construtor de `Error`, que utiliza
	 * `cause`.
	 *
	 * É `protected` então só pode ser chamado por subclasses.
	 *
	 * @param descriptor - Descritor do erro no catálogo com `code` e `message`.
	 * @param args - Opções do erro ({@link BaseErrorOptions}). São obrigatórias
	 * se a mensagem tiver placeholders (por conter `params`) e opcionais caso
	 * contrário.
	 * @throws {InvalidParamDelimitersError} Se algum dos delimitadores for uma
	 * string vazia (lançado durante a interpolação).
	 */
	protected constructor(
		descriptor: CatalogDescriptor<Catalog, Code>,
		...args: BaseErrorOptionsArgs<Catalog, Code, Delimiters>
	) {
		const options = args[0];
		const delimiters = (options?.delimiters ??
			DEFAULT_PARAM_DELIMITERS) as Delimiters;
		const params = options && "params" in options ? options.params : undefined;
		const interpolationArgs = (
			params === undefined ? [] : [params]
		) as ErrorMessageArgs<
			CatalogDescriptor<Catalog, Code>["message"],
			Delimiters
		>;

		super(
			interpolateErrorMessage(descriptor, delimiters, ...interpolationArgs),
			options,
		);

		this.name = new.target.name;
		this.code = descriptor.code;
		this.params = params;
		this.#delimiters = delimiters;

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, new.target);
		}
	}

	/**
	 * Traduções disponíveis para {@link BaseError.translate} criadas com
	 * `defineErrorTranslations`.
	 *
	 * Por padrão é `undefined` (sem traduções). Subclasses que oferecem
	 * traduções sobrescrevem este getter e o parâmetro de tipo `Locale` com
	 * os mesmos idiomas:
	 *
	 * ```ts
	 * protected override get translations() {
	 *   return TEST_ERROR_TRANSLATIONS;
	 * }
	 * ```
	 *
	 * É um getter (definido no protótipo) e não um campo para que as
	 * traduções não se tornem uma propriedade própria de cada instância, o que
	 * poluiria `Object.keys`, `console.log` e comparações de igualdade.
	 */
	protected get translations(): ErrorTranslations<Catalog, Locale> | undefined {
		return undefined;
	}

	/**
	 * Marca interna que identifica a instância como um `BaseError`.
	 *
	 * Sempre retorna `true` e é lida por {@link isBaseError}. Por ser um
	 * getter definido no protótipo, não é uma propriedade própria da instância
	 * e portanto, não aparece em serializações nem em `Object.keys`.
	 */
	public get [BASE_ERROR_BRAND]() {
		return true;
	}

	/**
	 * Retorna a mensagem do erro no idioma informado.
	 *
	 * Busca o texto do `code` do erro nas traduções da classe (getter
	 * `translations`) e o interpola com os mesmos `params` e delimitadores
	 * usados na criação do erro. O erro em si não muda: `message`, `serialize`
	 * e `toJSON` continuam no idioma do catálogo.
	 *
	 * Se não houver tradução para o idioma (ex.: classe sem `translations` ou
	 * idioma passado sem checagem de tipos), retorna `message`, a mensagem no
	 * idioma do catálogo, em vez de lançar.
	 *
	 * O idioma é restrito em tempo de compilação aos definidos em `Locale`.
	 *
	 * @param locale - Idioma desejado, entre os definidos em `translations`.
	 * @returns A mensagem traduzida e interpolada, ou `message` como fallback.
	 *
	 * @example
	 * ```ts
	 * const erro = TestError.create("USER_NOT_FOUND", { params: { id: 42 } });
	 *
	 * erro.translate("en"); // "User 42 not found"
	 * erro.translate("fr"); // erro de tipo: "fr" não está em `translations`
	 * ```
	 */
	public translate(locale: Locale) {
		const template: string | undefined =
			this.translations?.[locale]?.[this.code];

		if (typeof template !== "string") {
			return this.message;
		}

		const params = this.params;

		return interpolateErrorMessage(
			{ code: this.code, message: template },
			this.#delimiters,
			...((params === undefined ? [] : [params]) as ErrorMessageArgs<
				string,
				Delimiters
			>),
		);
	}

	/**
	 * Serializa o erro para um objeto simples apropriado para `JSON.stringify`,
	 * logs ou transmissão. Veja {@link serializeBaseError} para os detalhes do
	 * formato retornado.
	 *
	 * @param includeStack - Se `true` inclui o stack trace no resultado (e na
	 * serialização de causas e parâmetros). Por padrão, `false`.
	 * @returns Representação serializável do erro.
	 */
	public serialize(includeStack = false) {
		return serializeBaseError(this as Readonly<BaseError>, includeStack);
	}

	/**
	 * Chamado automaticamente por `JSON.stringify`. Equivale a
	 * {@link BaseError.serialize} sem stack trace.
	 *
	 * @returns Representação serializável do erro sem stack trace.
	 */
	public toJSON() {
		return this.serialize();
	}

	/**
	 * Verifica se um valor é uma instância de `BaseError` (type guard).
	 *
	 * Atalho para {@link isBaseError}: usa a marca interna em vez de
	 * `instanceof` funcionando mesmo com múltiplas cópias do pacote.
	 *
	 * @param error - Valor a ser verificado.
	 * @returns `true` se `error` for um `BaseError`; caso contrário, `false`.
	 */
	public static is(error: unknown): error is BaseError {
		return isBaseError(error);
	}

	/**
	 * Serializa de forma segura qualquer valor usado como causa de um erro.
	 *
	 * Atalho para {@link serializeCauseError}: trata erros, datas, arrays,
	 * objetos, funções, `bigint`, `symbol` e referências circulares.
	 *
	 * @param cause - Valor a ser serializado.
	 * @param includeStack - Se `true` inclui o stack trace ao serializar
	 * erros. Por padrão, `false`.
	 * @returns Representação serializável do valor.
	 */
	public static serializeCauseError(cause: unknown, includeStack = false) {
		return serializeCauseError(cause, includeStack);
	}
}

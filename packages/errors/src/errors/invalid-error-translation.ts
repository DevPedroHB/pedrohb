/**
 * Motivo pelo qual uma tradução é considerada inválida:
 * - `"missing"`: o idioma não traduz um código existente no catálogo;
 * - `"unknown"`: o idioma traduz um código que não existe no catálogo;
 * - `"placeholders"`: a tradução usa placeholders diferentes dos da mensagem
 *   original do catálogo.
 */
export type InvalidErrorTranslationReason =
	| "missing"
	| "unknown"
	| "placeholders";

/**
 * Monta a mensagem de {@link InvalidErrorTranslation} a partir do motivo.
 *
 * @param locale - Idioma em que o problema foi encontrado.
 * @param code - Código de erro relacionado ao problema.
 * @param reason - Motivo da invalidez.
 * @returns Mensagem descritiva em português.
 */
export function invalidErrorTranslationMessage(
	locale: string,
	code: string,
	reason: InvalidErrorTranslationReason,
) {
	switch (reason) {
		case "missing":
			return `Tradução ausente para o código "${code}" no idioma "${locale}".`;
		case "unknown":
			return `O código "${code}" do idioma "${locale}" não existe no catálogo de erros.`;
		case "placeholders":
			return `Os placeholders da tradução do código "${code}" no idioma "${locale}" devem ser os mesmos da mensagem original.`;
	}
}

/**
 * Erro lançado por `defineErrorTranslations` quando as traduções não
 * correspondem ao catálogo de erros.
 *
 * É a proteção em tempo de execução para o que o compilador já checa em
 * tempo de compilação (códigos ausentes, códigos desconhecidos e
 * placeholders divergentes), cobrindo definições que escapem da checagem de
 * tipos (ex.: objetos tipados como `any` ou `Record<string, ...>`).
 *
 * Estende `TypeError` pois indica um valor de formato inadequado. O `name` do
 * erro é o nome da classe concreta (`new.target.name`) e o protótipo é
 * ajustado explicitamente para que `instanceof` funcione mesmo em subclasses
 * e em alvos de compilação antigos.
 *
 * @example
 * ```ts
 * try {
 *   defineErrorTranslations(ERROR_CODES, {
 *     en: { INVALID_TOKEN: "Invalid token" }, // falta USER_NOT_FOUND
 *   });
 * } catch (error) {
 *   if (error instanceof InvalidErrorTranslation) {
 *     error.locale; // "en"
 *     error.code; // "USER_NOT_FOUND"
 *     error.reason; // "missing"
 *   }
 * }
 * ```
 */
export class InvalidErrorTranslation extends TypeError {
	/** Idioma em que o problema foi encontrado (ex.: `"en"`). */
	public readonly locale: string;
	/** Código de erro relacionado ao problema. */
	public readonly code: string;
	/** Motivo pelo qual a tradução é inválida. */
	public readonly reason: InvalidErrorTranslationReason;

	/**
	 * Cria o erro de tradução inválida.
	 *
	 * @param locale - Idioma em que o problema foi encontrado.
	 * @param code - Código de erro relacionado ao problema.
	 * @param reason - Motivo da invalidez.
	 * @param options - Opções padrão de `Error` como `cause`.
	 */
	public constructor(
		locale: string,
		code: string,
		reason: InvalidErrorTranslationReason,
		options?: ErrorOptions,
	) {
		super(invalidErrorTranslationMessage(locale, code, reason), options);

		this.name = new.target.name;
		this.locale = locale;
		this.code = code;
		this.reason = reason;

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, new.target);
		}
	}
}

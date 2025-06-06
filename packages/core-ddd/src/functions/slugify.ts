/**
 * Opções para customizar a criação de slugs.
 */
export interface SlugOptions {
	/**
	 * Caractere separador utilizado entre as palavras.
	 * @default "-"
	 */
	separator?: string;
	/**
	 * Define se o resultado será em letras minúsculas ou maiúsculas.
	 * @default "lower"
	 */
	case?: "lower" | "upper";
	/**
	 * Se `true`, separa palavras em camelCase com o separador.
	 * @default true
	 */
	decamelize?: boolean;
	/**
	 * Substituições personalizadas que ocorrem antes do processamento.
	 * Cada par `[from, to]` será aplicado à string original.
	 */
	customReplacements?: ReadonlyArray<[string, string]>;
	/**
	 * Caracteres que devem ser preservados e não substituídos por separadores.
	 */
	preserveCharacters?: string[];
}

/**
 * Gera um slug (string formatada) a partir de um texto, aplicando regras de substituição,
 * remoção de acentos, formatação de case e outros ajustes.
 * @param input - Texto de entrada a ser convertido em slug.
 * @param options - Opções para customizar o slug.
 * @returns O slug formatado de acordo com as opções.
 * @example
 * ```ts
 * slugify("Olá Mundo!"); // "ola-mundo"
 * slugify("campoDeTexto", { decamelize: true }); // "campo-de-texto"
 * slugify("Olá!", { preserveCharacters: ["!"] }); // "ola!"
 * ```
 */
export function slugify(input: string, options: SlugOptions = {}) {
	const {
		separator = "-",
		case: letterCase = "lower",
		decamelize = true,
		customReplacements = [],
		preserveCharacters = [],
	} = options;

	let str = input;

	// 1. Decamelize: separa camelCase em palavras
	if (decamelize) {
		str = str.replace(/([a-z0-9])([A-Z])/g, `$1${separator}$2`);
	}

	// 2. Substituições personalizadas antes de remover acentos
	for (const [from, to] of customReplacements) {
		str = str.split(from).join(to);
	}

	// 3. Normaliza e remove acentos (diacríticos)
	str = str.normalize("NFD").replace(/[̀-ͯ]/g, "");

	// 4. Construir padrão regex para preservação de caracteres
	const preserveEscaped = preserveCharacters.map((ch) => `\\${ch}`).join("");
	const preservePattern = preserveEscaped
		? `A-Za-z0-9${preserveEscaped}`
		: "A-Za-z0-9";

	// 5. Substituir caracteres não permitidos por separador
	const invalidCharsRegex = new RegExp(`[^${preservePattern}]+`, "g");
	str = str.replace(invalidCharsRegex, separator);

	// 6. Aplicar case (minúsculas ou maiúsculas)
	str = letterCase === "lower" ? str.toLowerCase() : str.toUpperCase();

	// 7. Colapsar separadores duplicados
	const duplicateSepRegex = new RegExp(`${separator}{2,}`, "g");
	str = str.replace(duplicateSepRegex, separator);

	// 8. Remover separadores no início e fim
	const trimSepRegex = new RegExp(`^${separator}|${separator}$`, "g");
	str = str.replace(trimSepRegex, "");

	return str;
}

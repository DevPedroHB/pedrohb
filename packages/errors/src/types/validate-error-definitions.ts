/**
 * Letras maiúsculas do alfabeto latino (`A` a `Z`), sem acentos.
 *
 * Usado para validar em tempo de compilação códigos em UPPER_SNAKE_CASE.
 */
export type UpperLetter =
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F"
	| "G"
	| "H"
	| "I"
	| "J"
	| "K"
	| "L"
	| "M"
	| "N"
	| "O"
	| "P"
	| "Q"
	| "R"
	| "S"
	| "T"
	| "U"
	| "V"
	| "W"
	| "X"
	| "Y"
	| "Z";

/**
 * Dígitos decimais (`0` a `9`), representados como string literals.
 */
export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

/**
 * Caractere alfanumérico permitido em um segmento de código: uma letra
 * maiúscula ({@link UpperLetter}) ou um dígito ({@link Digit}).
 */
export type AlphaNumeric = UpperLetter | Digit;

/**
 * Verifica se `T` é um segmento válido: não vazio e composto apenas por
 * caracteres alfanuméricos ({@link AlphaNumeric}), podendo continuar com
 * novos segmentos separados por `_`.
 *
 * Exige que o primeiro caractere seja alfanumérico e delega o restante a
 * {@link Tail}. É um tipo auxiliar de {@link IsUpperSnakeCase}, definido em
 * recursão mútua com `Tail`.
 *
 * @template T - String literal a ser verificada.
 * @returns `true` se for válido; caso contrário, `false`.
 *
 * @example
 * ```ts
 * type A = Segment<"ABC">;  // true
 * type B = Segment<"A_B">;  // true
 * type C = Segment<"_A">;   // false (começa com "_")
 * type D = Segment<"">;     // false (segmento vazio)
 * ```
 */
export type Segment<T extends string> = T extends `${AlphaNumeric}${infer Rest}`
	? Tail<Rest>
	: false;

/**
 * Verifica o restante de um código depois de seu primeiro caractere válido.
 *
 * Percorre a string caractere por caractere:
 * - string vazia: o código é válido (`true`);
 * - `_`: deve ser seguido por um novo segmento válido (via {@link Segment}),
 *   o que impede `_` duplicado ou no final;
 * - caractere alfanumérico: continua a verificação;
 * - qualquer outro caractere: o código é inválido (`false`).
 *
 * É um tipo auxiliar de {@link IsUpperSnakeCase}, definido em recursão mútua
 * com {@link Segment}.
 *
 * @template T - Restante da string literal a ser verificado.
 * @returns `true` se for válido; caso contrário, `false`.
 *
 * @example
 * ```ts
 * type A = Tail<"">;       // true
 * type B = Tail<"BC_D">;   // true
 * type C = Tail<"B__C">;   // false (underscores consecutivos)
 * type D = Tail<"B_">;     // false (termina com "_")
 * type E = Tail<"b">;      // false (letra minúscula)
 * ```
 */
export type Tail<T extends string> = T extends ""
	? true
	: T extends `_${infer Rest}`
		? Segment<Rest>
		: T extends `${AlphaNumeric}${infer Rest}`
			? Tail<Rest>
			: false;

/**
 * Verifica em tempo de compilação, se uma string literal está em
 * UPPER_SNAKE_CASE.
 *
 * Regras:
 * - deve começar com uma letra maiúscula (não pode começar com dígito);
 * - pode conter letras maiúsculas, dígitos e `_`;
 * - `_` só pode aparecer entre dois caracteres alfanuméricos, ou seja, não pode
 *   estar no início nem no fim e não pode ser repetido em sequência.
 *
 * Se `T` for o tipo genérico `string` (não literal), não é possível validar e
 * o resultado é `false`.
 *
 * @template T - String literal a ser verificada.
 * @returns `true` se estiver em UPPER_SNAKE_CASE; caso contrário, `false`.
 *
 * @example
 * ```ts
 * type A = IsUpperSnakeCase<"USER_NOT_FOUND">; // true
 * type B = IsUpperSnakeCase<"ERROR_404">;      // true
 * type C = IsUpperSnakeCase<"userNotFound">;   // false
 * type D = IsUpperSnakeCase<"_USER">;          // false
 * type E = IsUpperSnakeCase<"USER_">;          // false
 * type F = IsUpperSnakeCase<"USER__NOT">;      // false
 * type G = IsUpperSnakeCase<"1ERROR">;         // false
 * type H = IsUpperSnakeCase<string>;           // false
 * ```
 */
export type IsUpperSnakeCase<T extends string> = string extends T
	? false
	: T extends `${UpperLetter}${infer Rest}`
		? Tail<Rest>
		: false;

/**
 * Mensagem de erro em nível de tipos, exibida quando um código de erro não
 * segue o formato UPPER_SNAKE_CASE.
 *
 * Por ser um tipo literal, ela aparece diretamente na mensagem de erro do
 * compilador, indicando qual código é inválido.
 *
 * @template Code - Código de erro inválido a ser incluído na mensagem.
 *
 * @example
 * ```ts
 * type A = InvalidCodeMessage<"userNotFound">;
 * // `Código de erro inválido "userNotFound". Os códigos de erro devem usar UPPER_SNAKE_CASE.`
 * ```
 */
export type InvalidCodeMessage<Code extends string> =
	`Código de erro inválido "${Code}". Os códigos de erro devem usar UPPER_SNAKE_CASE.`;

/**
 * Valida em tempo de compilação, as chaves de um objeto de definições de
 * erros, exigindo que cada código esteja em UPPER_SNAKE_CASE.
 *
 * Para cada chave `K` de `T`:
 * - se for válida (ver {@link IsUpperSnakeCase}), mantém o tipo da mensagem
 *   original, `T[K]`;
 * - se for inválida, o tipo do valor passa a ser {@link InvalidCodeMessage},
 *   o que gera um erro de compilação com a explicação do problema;
 * - chaves que não sejam `string` (ex.: `number` ou `symbol`) resultam em
 *   `never`.
 *
 * Costuma ser combinado com o próprio tipo das definições (`T &
 * ValidateErrorDefinitions<T>`) em funções que criam catálogos de erros.
 *
 * @template T - Objeto que mapeia códigos de erro para suas mensagens. Por
 * padrão, `Record<string, string>`.
 *
 * @example
 * ```ts
 * type A = ValidateErrorDefinitions<{
 *   USER_NOT_FOUND: "Usuário não encontrado";
 *   invalidCode: "Código fora do padrão";
 * }>;
 * // {
 * //   USER_NOT_FOUND: "Usuário não encontrado";
 * //   invalidCode: `Código de erro inválido "invalidCode". Os códigos de erro devem usar UPPER_SNAKE_CASE.`;
 * // }
 * ```
 */
export type ValidateErrorDefinitions<
	T extends Record<string, string> = Record<string, string>,
> = {
	[K in keyof T]: K extends string
		? IsUpperSnakeCase<K> extends true
			? T[K]
			: InvalidCodeMessage<K>
		: never;
};

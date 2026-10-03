import { isBaseError } from "./is-base-error.js";
import { serializeBaseError } from "./serialize-base-error.js";
import { serializeNativeError } from "./serialize-native-error.js";

/**
 * Texto que substitui uma referência circular durante a serialização.
 *
 * É retornado no lugar de um objeto que já está sendo serializado mais acima
 * na mesma cadeia evitando recursão infinita.
 */
export const CIRCULAR_MARKER = "[Circular]";

/**
 * Conjunto de referências em processo de serialização usado para detectar
 * ciclos.
 *
 * Por ser um `WeakSet` não impede que os objetos sejam coletados pelo
 * garbage collector.
 */
export type SeenReferences = WeakSet<object>;

/**
 * Serializa de forma segura, o valor de uma `cause` (causa) de erro para uma
 * estrutura simples e apropriada para `JSON.stringify`, logs ou transmissão.
 *
 * A conversão depende do tipo do valor:
 * - `string`, `number`, `boolean` e `undefined`: retornados sem alteração;
 * - `null`: retorna `null`;
 * - `bigint` e `symbol`: convertidos para texto com `toString()`
 *   (ex.: `10n` vira `"10"`);
 * - função: vira o texto `"[Function: nome]"` ou `"[Function: anonymous]"`
 *   se não tiver nome;
 * - `BaseError`: delegado a {@link serializeBaseError};
 * - `Error` nativo: delegado a {@link serializeNativeError};
 * - `Date`: convertida para string ISO 8601 ou `"Invalid Date"` se a data
 *   for inválida;
 * - array: cada item é serializado recursivamente;
 * - objeto comum: cada propriedade própria enumerável de chave `string` é
 *   serializada recursivamente, resultando em um novo objeto simples.
 *
 * **Referências circulares:** apenas as referências da cadeia atual (os
 * "ancestrais" do valor sendo serializado) são rastreadas. Quando um objeto
 * aparece dentro de si mesmo o ponto de repetição é substituído por
 * {@link CIRCULAR_MARKER}. Como cada objeto é removido do conjunto ao terminar
 * de ser serializado, um mesmo objeto referenciado em dois lugares distintos
 * (sem ciclo) é serializado por completo nas duas ocorrências e não marcado
 * como circular.
 *
 * **Limitações:** protótipos e métodos de objetos comuns são descartados e
 * propriedades com chave `symbol` são ignoradas. Instâncias como `Map` e
 * `Set`, que não possuem propriedades próprias enumeráveis resultam em `{}`.
 *
 * @param cause - Valor a ser serializado normalmente a propriedade `cause`
 * de um erro, mas pode ser qualquer valor.
 * @param includeStack - Se `true`, inclui o stack trace ao serializar erros
 * (`BaseError` e `Error` nativo), repassando a opção aos respectivos
 * serializadores. Por padrão, `false`.
 * @param seen - Conjunto de referências em processo de serialização usado
 * internamente na recursão para detectar ciclos. Em geral não deve ser
 * informado; por padrão, um novo `WeakSet` vazio.
 * @returns Representação serializável do valor cujo formato depende do tipo
 * recebido (ver lista acima).
 *
 * @example
 * ```ts
 * serializeCauseError("falha");      // "falha"
 * serializeCauseError(10n);          // "10"
 * serializeCauseError(Symbol("x"));  // "Symbol(x)"
 * serializeCauseError(function foo() {}); // "[Function: foo]"
 * serializeCauseError(new Date("2026-01-01T00:00:00Z"));
 * // "2026-01-01T00:00:00.000Z"
 * serializeCauseError(new Date("inválida")); // "Invalid Date"
 *
 * // Estruturas aninhadas
 * serializeCauseError({ ids: [1, 2n], origin: null });
 * // { ids: [1, "2"], origin: null }
 *
 * // Referência circular
 * const a: Record<string, unknown> = { name: "a" };
 * a.self = a;
 * serializeCauseError(a);
 * // { name: "a", self: "[Circular]" }
 *
 * // Mesmo objeto em dois lugares (sem ciclo): serializado nas duas vezes
 * const shared = { x: 1 };
 * serializeCauseError({ a: shared, b: shared });
 * // { a: { x: 1 }, b: { x: 1 } }
 *
 * // Erros, com stack trace opcional
 * serializeCauseError(new Error("falhou"), true);
 * ```
 */
export function serializeCauseError(
	cause: unknown,
	includeStack = false,
	seen: SeenReferences = new WeakSet(),
): unknown {
	switch (typeof cause) {
		case "bigint":
		case "symbol":
			return cause.toString();
		case "function":
			return `[Function: ${cause.name || "anonymous"}]`;
		case "object":
			break;
		default:
			return cause;
	}

	if (cause === null) {
		return null;
	}

	if (seen.has(cause)) {
		return CIRCULAR_MARKER;
	}

	if (isBaseError(cause)) {
		return serializeBaseError(cause, includeStack, seen);
	}

	if (cause instanceof Error) {
		return serializeNativeError(cause, includeStack, seen);
	}

	if (cause instanceof Date) {
		return Number.isNaN(cause.getTime()) ? "Invalid Date" : cause.toISOString();
	}

	seen.add(cause);

	try {
		if (Array.isArray(cause)) {
			return cause.map((item) => serializeCauseError(item, includeStack, seen));
		}

		return Object.fromEntries(
			Object.entries(cause).map(([key, value]) => [
				key,
				serializeCauseError(value, includeStack, seen),
			]),
		);
	} finally {
		seen.delete(cause);
	}
}

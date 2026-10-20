/** biome-ignore-all lint/suspicious/noExplicitAny: off */

import { ResultUnwrapError } from "./errors/result-unwrap-error.js";

/**
 * Representa o resultado de uma operação que pode ter sucesso (`Ok`) ou
 * falhar (`Err`), tornando o erro parte explícita do tipo de retorno em vez
 * de depender de exceções.
 *
 * Um `Result<O, E>` é sempre uma instância de {@link Ok} que carrega um
 * valor de sucesso do tipo `O`, ou de {@link Err} que carrega um valor de
 * erro do tipo `E`. Use {@link ok} e {@link err} para criá-los.
 *
 * Os métodos {@link Result.map}, {@link Result.mapErr}, {@link Result.flatMap}
 * e {@link Result.orElse} retornam um novo `Result` e não alteram o original.
 * Para tratar os dois casos use {@link Result.match}, ou os type guards
 * {@link Result.isOk} e {@link Result.isErr}.
 *
 * @template O - Tipo do valor de sucesso.
 * @template E - Tipo do valor de erro.
 *
 * @example
 * ```ts
 * function toDivide(a: number, b: number): Result<number, string> {
 *   return b === 0 ? err("Divisão por zero") : ok(a / b);
 * }
 *
 * const message = toDivide(10, 2)
 *   .map((resultado) => resultado * 3)
 *   .match({
 *     onOk: (valor) => `Resultado: ${valor}`,
 *     onErr: (erro) => `Falha: ${erro}`,
 *   });
 * // "Resultado: 15"
 * ```
 */
export abstract class Result<O = any, E = any> {
	/** Discriminante da variante: `"Ok"` para sucesso e `"Err"` para erro. */
	public abstract readonly tag: "Ok" | "Err";

	/**
	 * Retorna o valor de sucesso.
	 *
	 * @returns O valor contido em `Ok`.
	 * @throws {ResultUnwrapError} Se for um `Err`. A `cause` do erro é o valor
	 * de erro contido.
	 */
	public abstract unwrap(): O;

	/**
	 * Retorna o valor de erro.
	 *
	 * @returns O valor contido em `Err`.
	 * @throws {ResultUnwrapError} Se for um `Ok`. A `cause` do erro é o valor
	 * de sucesso contido.
	 */
	public abstract unwrapErr(): E;

	/**
	 * Verifica se é um `Ok` funcionando como type guard.
	 *
	 * @returns `true` se for `Ok` (restringindo o tipo para {@link Ok});
	 * caso contrário, `false`.
	 */
	public abstract isOk(): this is Ok<O, E>;

	/**
	 * Verifica se é um `Err` funcionando como type guard.
	 *
	 * @returns `true` se for `Err` (restringindo o tipo para {@link Err});
	 * caso contrário, `false`.
	 */
	public abstract isErr(): this is Err<O, E>;

	/**
	 * Transforma o valor de sucesso mantendo o erro intacto.
	 *
	 * Se for `Ok` aplica `fn` ao valor e retorna um novo `Ok` com o resultado.
	 * Se for `Err` `fn` não é chamada e um novo `Err` com o mesmo erro é
	 * retornado. Exceções lançadas por `fn` não são capturadas.
	 *
	 * @template O2 - Tipo do novo valor de sucesso.
	 * @param fn - Função que converte o valor de sucesso.
	 * @returns Um `Result` com o valor transformado ou o erro original.
	 *
	 * @example
	 * ```ts
	 * ok<number, string>(2).map((n) => n * 2).unwrap(); // 4
	 * err<number, string>("falhou").map((n) => n * 2).unwrapErr(); // "falhou"
	 * ```
	 */
	public map<O2>(fn: (value: O) => O2): Result<O2, E> {
		if (this.isOk()) {
			return ok(fn(this.unwrap()));
		}

		return err(this.unwrapErr());
	}

	/**
	 * Transforma o valor de erro mantendo o sucesso intacto.
	 *
	 * Se for `Err` aplica `fn` ao erro e retorna um novo `Err` com o resultado.
	 * Se for `Ok` `fn` não é chamada e um novo `Ok` com o mesmo valor é
	 * retornado. Exceções lançadas por `fn` não são capturadas.
	 *
	 * @template E2 - Tipo do novo valor de erro.
	 * @param fn - Função que converte o valor de erro.
	 * @returns Um `Result` com o erro transformado ou o valor original.
	 *
	 * @example
	 * ```ts
	 * err<number, string>("falhou").mapErr((e) => e.length).unwrapErr(); // 7
	 * ok<number, string>(1).mapErr((e) => e.length).unwrap(); // 1
	 * ```
	 */
	public mapErr<E2>(fn: (value: E) => E2): Result<O, E2> {
		if (this.isErr()) {
			return err(fn(this.unwrapErr()));
		}

		return ok(this.unwrap());
	}

	/**
	 * Encadeia uma operação que também retorna um `Result` usada quando o
	 * próximo passo também pode falhar.
	 *
	 * Se for `Ok`, retorna diretamente o `Result` produzido por `fn` (sem
	 * aninhamento). Se for `Err` `fn` não é chamada e o erro é propagado.
	 * O tipo de erro resultante é a união `E | E2`. Exceções lançadas por `fn`
	 * não são capturadas.
	 *
	 * @template O2 - Tipo do valor de sucesso retornado por `fn`.
	 * @template E2 - Tipo do valor de erro retornado por `fn`.
	 * @param fn - Função que recebe o valor de sucesso e retorna um `Result`.
	 * @returns O `Result` retornado por `fn`, ou o erro original.
	 *
	 * @example
	 * ```ts
	 * const forNumber = (s: string): Result<number, string> => {
	 *   const n = Number(s);
	 *   return Number.isNaN(n) ? err("Não é número") : ok(n);
	 * };
	 *
	 * ok<string, string>("42").flatMap(forNumber).unwrap(); // 42
	 * ok<string, string>("abc").flatMap(forNumber).unwrapErr(); // "Não é número"
	 * ```
	 */
	public flatMap<O2, E2>(fn: (value: O) => Result<O2, E2>): Result<O2, E | E2> {
		if (this.isOk()) {
			return fn(this.unwrap());
		}

		return err(this.unwrapErr());
	}

	/**
	 * Tenta se recuperar de um erro encadeando uma operação alternativa que
	 * também retorna um `Result`. É o oposto de {@link Result.flatMap}.
	 *
	 * Se for `Err` retorna diretamente o `Result` produzido por `fn`. Se for
	 * `Ok` `fn` não é chamada e o valor é mantido. O tipo de sucesso
	 * resultante é a união `O | O2`. Exceções lançadas por `fn` não são
	 * capturadas.
	 *
	 * @template O2 - Tipo do valor de sucesso retornado por `fn`.
	 * @template E2 - Tipo do valor de erro retornado por `fn`.
	 * @param fn - Função que recebe o valor de erro e retorna um `Result`.
	 * @returns O `Result` retornado por `fn`, ou o valor de sucesso original.
	 *
	 * @example
	 * ```ts
	 * err<number, string>("falhou").orElse(() => ok(0)).unwrap(); // 0
	 * ok<number, string>(5).orElse(() => ok(0)).unwrap(); // 5
	 * ```
	 */
	public orElse<O2, E2>(fn: (value: E) => Result<O2, E2>): Result<O | O2, E2> {
		if (this.isErr()) {
			return fn(this.unwrapErr());
		}

		return ok(this.unwrap());
	}

	/**
	 * Trata os dois casos e produz um único valor chamando o handler da
	 * variante correspondente.
	 *
	 * @template R - Tipo do valor retornado pelos handlers.
	 * @param handlers - Objeto com `onOk` chamado com o valor de sucesso e
	 * `onErr` chamado com o valor de erro.
	 * @returns O resultado do handler chamado.
	 *
	 * @example
	 * ```ts
	 * const texto = resultado.match({
	 *   onOk: (valor) => `Sucesso: ${valor}`,
	 *   onErr: (erro) => `Erro: ${erro}`,
	 * });
	 * ```
	 */
	public match<R>(
		handlers: Readonly<{ onOk(value: O): R; onErr(value: E): R }>,
	): R {
		if (this.isOk()) {
			return handlers.onOk(this.unwrap());
		}

		return handlers.onErr(this.unwrapErr());
	}
}

/**
 * Variante de sucesso de {@link Result} que carrega um valor do tipo `O`.
 *
 * @template O - Tipo do valor de sucesso. Por padrão, `never`.
 * @template E - Tipo do valor de erro usado apenas para compatibilidade com
 * {@link Result}. Por padrão, `never`.
 */
export class Ok<O = never, E = never> extends Result<O, E> {
	/** Discriminante da variante sempre `"Ok"`. */
	public readonly tag = "Ok" as const;
	/** Valor de sucesso armazenado. */
	private readonly value: O;

	/**
	 * @param value - Valor de sucesso a ser armazenado.
	 */
	public constructor(value: O) {
		super();

		this.value = value;
	}

	/**
	 * Retorna o valor de sucesso armazenado.
	 *
	 * @returns O valor contido.
	 */
	public unwrap(): O {
		return this.value;
	}

	/**
	 * Sempre lança um erro pois um `Ok` não possui valor de erro.
	 *
	 * @throws {ResultUnwrapError} Sempre. A `cause` é o valor de sucesso contido.
	 */
	public unwrapErr(): E {
		throw new ResultUnwrapError("Chamado unwrapErr() em Ok.", {
			cause: this.value,
		});
	}

	/** @returns Sempre `true`. */
	public isOk(): this is Ok<O, E> {
		return true;
	}

	/** @returns Sempre `false`. */
	public isErr(): this is Err<O, E> {
		return false;
	}

	/**
	 * Cria um `Ok` com o valor informado.
	 *
	 * @template O - Tipo do valor de sucesso. Por padrão, `never`.
	 * @template E - Tipo do valor de erro. Por padrão, `never`.
	 * @param value - Valor de sucesso.
	 * @returns Uma nova instância de `Ok`.
	 */
	public static create<O = never, E = never>(value: O): Ok<O, E> {
		return new Ok(value);
	}
}

/**
 * Variante de erro de {@link Result} que carrega um valor do tipo `E`.
 *
 * @template O - Tipo do valor de sucesso usado apenas para compatibilidade
 * com {@link Result}. Por padrão, `never`.
 * @template E - Tipo do valor de erro. Por padrão, `never`.
 */
export class Err<O = never, E = never> extends Result<O, E> {
	/** Discriminante da variante sempre `"Err"`. */
	public readonly tag = "Err" as const;
	/** Valor de erro armazenado. */
	private readonly value: E;

	/**
	 * @param value - Valor de erro a ser armazenado.
	 */
	public constructor(value: E) {
		super();

		this.value = value;
	}

	/**
	 * Sempre lança um erro pois um `Err` não possui valor de sucesso.
	 *
	 * @throws {ResultUnwrapError} Sempre. A `cause` é o valor de erro contido.
	 */
	public unwrap(): O {
		throw new ResultUnwrapError("Chamado unwrap() em Err.", {
			cause: this.value,
		});
	}

	/**
	 * Retorna o valor de erro armazenado.
	 *
	 * @returns O valor contido.
	 */
	public unwrapErr(): E {
		return this.value;
	}

	/** @returns Sempre `false`. */
	public isOk(): this is Ok<O, E> {
		return false;
	}

	/** @returns Sempre `true`. */
	public isErr(): this is Err<O, E> {
		return true;
	}

	/**
	 * Cria um `Err` com o valor informado.
	 *
	 * @template O - Tipo do valor de sucesso. Por padrão, `never`.
	 * @template E - Tipo do valor de erro. Por padrão, `never`.
	 * @param value - Valor de erro.
	 * @returns Uma nova instância de `Err`.
	 */
	public static create<O = never, E = never>(value: E): Err<O, E> {
		return new Err(value);
	}
}

/**
 * Cria um {@link Result} de sucesso (`Ok`) com o valor informado.
 *
 * O retorno é tipado como `Result<O, E>` e não como `Ok` para que possa ser
 * usado onde se espera qualquer variante. Como `E` não pode ser inferido a
 * partir do argumento, informe-o explicitamente quando necessário.
 *
 * @template O - Tipo do valor de sucesso. Por padrão, `never`.
 * @template E - Tipo do valor de erro. Por padrão, `never`.
 * @param value - Valor de sucesso.
 * @returns Um `Result` que é um `Ok` contendo `value`.
 *
 * @example
 * ```ts
 * const result = ok<number, string>(42);
 * result.isOk();   // true
 * result.unwrap(); // 42
 * ```
 */
export function ok<O = never, E = never>(value: O): Result<O, E> {
	return Ok.create(value);
}

/**
 * Cria um {@link Result} de erro (`Err`) com o valor informado.
 *
 * O retorno é tipado como `Result<O, E>` e não como `Err` para que possa ser
 * usado onde se espera qualquer variante. Como `O` não pode ser inferido a
 * partir do argumento, informe-o explicitamente quando necessário.
 *
 * @template O - Tipo do valor de sucesso. Por padrão, `never`.
 * @template E - Tipo do valor de erro. Por padrão, `never`.
 * @param value - Valor de erro.
 * @returns Um `Result` que é um `Err` contendo `value`.
 *
 * @example
 * ```ts
 * const result = err<number, string>("Algo deu errado");
 * result.isErr();      // true
 * result.unwrapErr();  // "Algo deu errado"
 * ```
 */
export function err<O = never, E = never>(value: E): Result<O, E> {
	return Err.create(value);
}

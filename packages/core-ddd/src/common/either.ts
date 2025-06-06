/**
 * Representa uma operação que falhou, contendo um valor de erro.
 * @template E Tipo do erro.
 * @template S Tipo do sucesso (não utilizado diretamente na instância de erro, mas necessário para compatibilidade com `Either`).
 */
export class Error<E, S> {
	/** O valor do erro. */
	readonly value: E;

	/**
	 * Cria uma nova instância de `Error`.
	 * @param value O valor do erro.
	 */
	constructor(value: E) {
		this.value = value;
	}

	/**
	 * Indica que esta instância representa um erro.
	 * @returns Verdadeiro, pois é um erro.
	 */
	isError(): this is Error<E, S> {
		return true;
	}

	/**
	 * Indica que esta instância representa um sucesso.
	 * @returns Falso, pois é um erro.
	 */
	isSuccess(): this is Success<E, S> {
		return false;
	}
}

/**
 * Representa uma operação bem-sucedida, contendo um valor de sucesso.
 * @template E Tipo do erro (não utilizado diretamente na instância de sucesso, mas necessário para compatibilidade com `Either`).
 * @template S Tipo do sucesso.
 */
export class Success<E, S> {
	/** O valor do sucesso. */
	readonly value: S;

	/**
	 * Cria uma nova instância de `Success`.
	 * @param value O valor do sucesso.
	 */
	constructor(value: S) {
		this.value = value;
	}

	/**
	 * Indica que esta instância representa um erro.
	 * @returns Falso, pois é um sucesso.
	 */
	isError(): this is Error<E, S> {
		return false;
	}

	/**
	 * Indica que esta instância representa um sucesso.
	 * @returns Verdadeiro, pois é um sucesso.
	 */
	isSuccess(): this is Success<E, S> {
		return true;
	}
}

/**
 * Tipo utilitário que representa uma operação que pode falhar (`Error`) ou ter sucesso (`Success`).
 * @template E Tipo do erro.
 * @template S Tipo do sucesso.
 */
export type Either<E, S> = Error<E, S> | Success<E, S>;

/**
 * Cria uma instância de `Error`.
 * @template E Tipo do erro.
 * @template S Tipo do sucesso.
 * @param value O valor do erro.
 * @returns Uma instância de `Either` representando um erro.
 */
export const error = <E, S>(value: E): Either<E, S> => {
	return new Error(value);
};

/**
 * Cria uma instância de `Success`.
 * @template E Tipo do erro.
 * @template S Tipo do sucesso.
 * @param value O valor do sucesso.
 * @returns Uma instância de `Either` representando um sucesso.
 */
export const success = <E, S>(value: S): Either<E, S> => {
	return new Success(value);
};

import { Either, EitherUnwrapError, Err, err, Ok, ok } from "#/index.js";

// ---------------------------------------------------------------------------
// Criação e leitura de resultados
// ---------------------------------------------------------------------------

// O Either sempre carrega os tipos de sucesso e de erro, mesmo que uma das
// variantes ainda não seja conhecida naquele ponto do código.
export const successfulResult = ok<number, string>(42);
export const failedResult = err<number, string>("Algo deu errado");

export const successfulValue = successfulResult.unwrap(); // 42
export const errorValue = failedResult.unwrapErr(); // "Algo deu errado"
export const successTag = successfulResult.tag; // "Ok"
export const errorTag = failedResult.tag; // "Err"

// Os genéricos ausentes podem ser inferidos quando o tipo esperado está
// explícito, como no retorno de uma função.
export function parseCount(input: string): Either<number, string> {
	const value = Number(input);

	return Number.isNaN(value) ? err("Valor não é um número") : ok(value);
}

// Também é possível criar diretamente as variantes, quando se quer manter o
// tipo concreto Ok/Err em vez do tipo união Either.
export const concreteOk = Ok.create<number, string>(7);
export const concreteErr = Err.create<number, string>("indisponível");

// ---------------------------------------------------------------------------
// Tratamento dos dois casos e narrowing com type guards
// ---------------------------------------------------------------------------

export function describeResult(result: Either<number, string>): string {
	if (result.isOk()) {
		// Dentro deste bloco result é Ok<number, string>.
		return `Sucesso: ${result.unwrap()}`;
	}

	// Após o guard, result é Err<number, string>.
	return `Falha: ${result.unwrapErr()}`;
}

export const matchedSuccess = successfulResult.match({
	onOk: (value) => `Resultado: ${value}`,
	onErr: (error) => `Falha: ${error}`,
});

export const matchedFailure = failedResult.match({
	onOk: (value) => `Resultado: ${value}`,
	onErr: (error) => `Falha: ${error}`,
});

// O método isErr() também funciona como type guard.
export function getErrorLength(result: Either<number, string>) {
	if (result.isErr()) {
		return result.unwrapErr().length;
	}

	return result.unwrap();
}

// ---------------------------------------------------------------------------
// map e mapErr
// ---------------------------------------------------------------------------

// map transforma somente o sucesso; em Err, preserva o erro.
export const doubledValue = ok<number, string>(2)
	.map((value) => value * 2)
	.unwrap(); // 4

export const preservedError = err<number, string>("falhou")
	.map((value) => value * 2)
	.unwrapErr(); // "falhou"

// mapErr transforma somente o erro; em Ok, preserva o sucesso.
export const errorLength = err<number, string>("falhou")
	.mapErr((error) => error.length)
	.unwrapErr(); // 7

export const preservedSuccess = ok<number, string>(1)
	.mapErr((error) => error.length)
	.unwrap(); // 1

// ---------------------------------------------------------------------------
// flatMap: encadear operações que podem falhar
// ---------------------------------------------------------------------------

export function toNumber(input: string): Either<number, string> {
	const value = Number(input);

	return Number.isNaN(value) ? err("Não é número") : ok(value);
}

export function requirePositive(value: number): Either<number, string> {
	return value > 0 ? ok(value) : err("O valor deve ser positivo");
}

export const parsedPositiveNumber = ok<string, string>("42")
	.flatMap(toNumber)
	.flatMap(requirePositive)
	.unwrap(); // 42

export const flatMapFailure = ok<string, string>("texto")
	.flatMap(toNumber)
	.flatMap(requirePositive)
	.unwrapErr(); // "Não é número"

// Os tipos de erro dos passos são unidos no resultado.
export type NumberParsingResult = ReturnType<typeof toNumber>;
export type PositiveNumberResult = ReturnType<typeof requirePositive>;

// ---------------------------------------------------------------------------
// orElse: recuperação ou fallback
// ---------------------------------------------------------------------------

export const recoveredResult = err<number, string>("cache miss")
	.orElse(() => ok(0))
	.unwrap(); // 0

export const preservedResult = ok<number, string>(5)
	.orElse(() => ok(0))
	.unwrap(); // 5; callback não é necessária para Ok

export function recoverFromNumberError(
	result: Either<number, string>,
): Either<number, string> {
	return result.orElse((error) =>
		error === "cache miss" ? ok(0) : err(error),
	);
}

// ---------------------------------------------------------------------------
// Composição de operações
// ---------------------------------------------------------------------------

export function divide(a: number, b: number): Either<number, string> {
	return b === 0 ? err("Divisão por zero") : ok(a / b);
}

export const composedSuccess = divide(10, 2)
	.map((value) => value * 3)
	.match({
		onOk: (value) => `Resultado: ${value}`,
		onErr: (error) => `Falha: ${error}`,
	}); // "Resultado: 15"

export const composedFailure = divide(10, 0)
	.map((value) => value * 3)
	.match({
		onOk: (value) => `Resultado: ${value}`,
		onErr: (error) => `Falha: ${error}`,
	}); // "Falha: Divisão por zero"

// ---------------------------------------------------------------------------
// Erros de unwrap e identificação
// ---------------------------------------------------------------------------

// unwrap() na variante Err e unwrapErr() na variante Ok lançam
// EitherUnwrapError. A causa (`cause`) contém o valor guardado no Either.
export function getUnwrapFailureCause(result: Either<number, string>): unknown {
	try {
		return result.unwrap();
	} catch (error) {
		if (error instanceof EitherUnwrapError) {
			return error.cause;
		}

		throw error;
	}
}

export function inspectEither(value: unknown) {
	if (value instanceof Either) {
		return value.match<
			{ tag: "Ok"; value: number } | { tag: "Err"; value: string }
		>({
			onOk: (success) => ({ tag: "Ok" as const, value: success }),
			onErr: (failure) => ({ tag: "Err" as const, value: failure }),
		});
	}

	return undefined;
}

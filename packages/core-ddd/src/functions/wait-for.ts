/**
 * Repetidamente executa uma função de asserção até que ela seja bem-sucedida ou o tempo limite seja atingido.
 * Útil em testes para aguardar efeitos colaterais ou atualizações assíncronas, como mudanças no DOM ou em estados internos.
 * @param assertions - Função que contém as asserções. Pode ser síncrona ou assíncrona. Se lançar erro, será reexecutada.
 * @param options - Configurações opcionais.
 * @param options.timeout - Tempo máximo de espera em milissegundos. Padrão: `1000ms`.
 * @param options.interval - Intervalo entre tentativas em milissegundos. Padrão: `10ms`.
 * @returns Uma Promise que resolve se as asserções forem bem-sucedidas dentro do tempo limite, ou rejeita com o erro da asserção.
 * @example
 * ```ts
 * await waitFor(() => {
 *   expect(screen.getByText("Carregando...")).not.toBeInTheDocument();
 * }, { timeout: 2000 });
 * ```
 */
export async function waitFor(
	assertions: () => void | Promise<void>,
	options: { timeout?: number; interval?: number } = {},
) {
	const { timeout = 1000, interval = 10 } = options;
	const start = performance.now();

	return new Promise<void>((resolve, reject) => {
		const tryAssert = async () => {
			try {
				await assertions();

				resolve();
			} catch (err) {
				const elapsed = performance.now() - start;

				if (elapsed >= timeout) {
					reject(err);
				} else {
					setTimeout(tryAssert, interval);
				}
			}
		};

		tryAssert();
	});
}

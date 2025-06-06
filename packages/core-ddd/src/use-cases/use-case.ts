/**
 * Representa um caso de uso da aplicação, encapsulando a lógica de negócio.
 * @typeParam UseCaseRequest - O tipo da requisição esperada.
 * @typeParam UseCaseResponse - O tipo da resposta retornada.
 */
export abstract class UseCase<UseCaseRequest, UseCaseResponse> {
	/**
	 * Executa o caso de uso com a requisição fornecida.
	 * @param request - Dados de entrada necessários para a execução.
	 * @returns Uma promessa que resolve com a resposta do caso de uso.
	 */
	public abstract execute(request: UseCaseRequest): Promise<UseCaseResponse>;

	/**
	 * Retorna uma representação textual da instância para fins de debug.
	 * @returns Uma string no formato `[UseCase@NomeDaClasse]`.
	 */
	public toHash() {
		return `[${UseCase.name}@${this.constructor.name}]`;
	}
}

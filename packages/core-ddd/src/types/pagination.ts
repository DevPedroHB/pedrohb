/**
 * Representa parâmetros opcionais para paginação de resultados.
 * @property page - O número da página (começando em 1).
 * @property perPage - A quantidade de itens por página.
 */
export type Pagination = Partial<{
	page: number;
	perPage: number;
}>;

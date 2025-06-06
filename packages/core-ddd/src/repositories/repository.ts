import type { Entity } from "@/entities/entity";
import { AlreadyExistsError } from "@/errors/already-exists-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { DomainEvents } from "@/events/domain-events";
import { filterItemsByFields } from "@/functions/filter-items-by-fields";
import { paginateItems } from "@/functions/paginate-items";
import { sortItems } from "@/functions/sort-items";
import type { FetchAllOptions } from "@/types/fetch-all-options";
import type { FindByFields } from "@/types/find-by-fields";

/**
 * Representa um repositório genérico em memória para entidades do domínio.
 * Fornece funcionalidades para criar, atualizar, excluir e buscar entidades,
 * além de aplicar ordenação, paginação e filtros por campos.
 * @typeParam E - A entidade que o repositório irá manipular.
 */
export abstract class Repository<E extends Entity<any>> {
	/**
	 * Armazena as entidades internamente em memória, usando o ID como chave.
	 */
	public items: Map<string, E> = new Map();

	/**
	 * Busca todas as entidades, com suporte a filtros, ordenação e paginação.
	 * @param options - Opções de filtragem, ordenação e paginação.
	 * @returns Uma lista de entidades filtradas e ordenadas.
	 */
	public async fetchAll(options?: FetchAllOptions<E>): Promise<E[]> {
		const { fields, orderBy, pagination } = options || {};

		let results = Array.from(this.items.values());

		if (fields) {
			results = filterItemsByFields(results, fields);
		}

		if (orderBy) {
			results = sortItems(results, orderBy);
		}

		if (pagination) {
			results = paginateItems(results, pagination);
		}

		return results;
	}

	/**
	 * Busca uma entidade com base em campos específicos.
	 * @param fields - Campos e valores a serem buscados.
	 * @returns A entidade encontrada ou `null` se não houver correspondência.
	 */
	public async findByFields(fields: FindByFields<E>): Promise<E | null> {
		const candidates = filterItemsByFields(
			Array.from(this.items.values()),
			fields,
		);

		return candidates.length > 0 ? candidates[0] : null;
	}

	/**
	 * Cria uma nova entidade no repositório.
	 * @param entity - A entidade a ser criada.
	 */
	public async create(entity: E): Promise<void> {
		const key = entity.id.toValue();

		if (this.items.has(key)) {
			throw new AlreadyExistsError();
		}

		this.items.set(key, entity);

		DomainEvents.dispatchEventsForAggregate(entity.id);
	}

	/**
	 * Atualiza uma entidade existente.
	 * @param entity - A entidade com os dados atualizados.
	 */
	public async update(entity: E): Promise<void> {
		const key = entity.id.toValue();

		if (!this.items.has(key)) {
			throw new ResourceNotFoundError();
		}

		this.items.set(key, entity);

		DomainEvents.dispatchEventsForAggregate(entity.id);
	}

	/**
	 * Remove uma entidade do repositório.
	 * @param entity - A entidade a ser removida.
	 */
	public async delete(entity: E): Promise<void> {
		const key = entity.id.toValue();

		if (!this.items.delete(key)) {
			throw new ResourceNotFoundError();
		}

		DomainEvents.dispatchEventsForAggregate(entity.id);
	}

	/**
	 * Retorna uma representação em string do repositório para identificação e debugging.
	 * @returns Uma string de hash com o nome da classe.
	 */
	public toHash() {
		return `[${Repository.name}@${this.constructor.name}]`;
	}
}

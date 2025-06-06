import type { UniqueEntityId } from "@/entities/unique-entity-id";

/**
 * Representa um evento de domínio base, que ocorre dentro de um agregado em um modelo de domínio orientado a eventos.
 * Todos os eventos de domínio devem herdar desta classe e implementar o método `getAggregateId`.
 */
export abstract class DomainEvent {
	/**
	 * Data e hora em que o evento ocorreu.
	 */
	public readonly occurredAt: Date;

	/**
	 * Cria uma nova instância de um evento de domínio.
	 * @param occurredAt Data e hora da ocorrência do evento (padrão: agora).
	 */
	protected constructor(occurredAt = new Date()) {
		this.occurredAt = occurredAt;
	}

	/**
	 * Retorna o identificador único do agregado raiz ao qual o evento pertence.
	 */
	public abstract getAggregateId(): UniqueEntityId;

	/**
	 * Retorna um hash representando este evento.
	 * Útil para logging e rastreamento de eventos.
	 * @returns Uma string no formato `[DomainEvent@NomeDoEvento]:ID`.
	 */
	public toHash() {
		return `[${DomainEvent.name}@${this.constructor.name}]:${this.getAggregateId().toValue()}`;
	}
}

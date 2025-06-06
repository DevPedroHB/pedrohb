import type { DomainEvent } from "./domain-event";
import { DomainEvents, type EventConstructor } from "./domain-events";

/**
 * Classe base para subscribers de eventos de domínio.
 * @template T Tipo de evento de domínio que será manipulado pelo subscriber.
 */
export abstract class EventSubscriber<T extends DomainEvent> {
	private readonly eventClass: EventConstructor<T>;

	/**
	 * Cria uma nova instância do subscriber e registra automaticamente o handler
	 * para o tipo de evento especificado.
	 * @param eventClass A classe do evento que será tratado por este subscriber.
	 */
	protected constructor(eventClass: EventConstructor<T>) {
		this.eventClass = eventClass;

		this.setupSubscription();
	}

	/**
	 * Registra o handler do evento no mecanismo global de `DomainEvents`.
	 */
	private setupSubscription() {
		DomainEvents.registerHandler<T>(
			this.eventClass,
			this.handleEvent.bind(this),
		);
	}

	/**
	 * Método abstrato que deve ser implementado pelas subclasses para tratar o evento.
	 * @param event O evento de domínio a ser manipulado.
	 */
	protected abstract handleEvent(event: T): Promise<void>;
}

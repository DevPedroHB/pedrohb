/** biome-ignore-all lint/suspicious/noExplicitAny: off */

import type { DomainEventHandler } from "./domain-event-handler.js";

export class DomainEventHandlerGroup {
	private readonly handlers = new Set<DomainEventHandler<any>>();

	public constructor(handlers: DomainEventHandler<any>[] = []) {
		for (const handler of handlers) {
			this.add(handler);
		}
	}

	public get size() {
		return this.handlers.size;
	}

	public add<DEH extends DomainEventHandler<any>>(handler: DEH) {
		handler.subscribe();

		this.handlers.add(handler);

		return handler;
	}

	public remove(handler: DomainEventHandler<any>) {
		handler.unsubscribe();

		this.handlers.delete(handler);
	}

	public subscribeAll() {
		for (const handler of this.handlers) {
			if (handler.isDisposed) {
				this.handlers.delete(handler);
				continue;
			}

			handler.subscribe();
		}
	}

	public unsubscribeAll() {
		for (const handler of this.handlers) {
			if (handler.isDisposed) {
				this.handlers.delete(handler);
				continue;
			}

			handler.unsubscribe();
		}
	}

	public disposeAll() {
		for (const handler of this.handlers) {
			if (!handler.isDisposed) {
				handler.dispose();
			}
		}

		this.handlers.clear();
	}
}

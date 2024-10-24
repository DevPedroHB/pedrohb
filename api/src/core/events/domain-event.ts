import { UniqueEntityID } from "../entities/unique-entity-id";

export interface DomainEvent {
	readonly ocurredAt: Date;
	getAggregateId(): UniqueEntityID;
}

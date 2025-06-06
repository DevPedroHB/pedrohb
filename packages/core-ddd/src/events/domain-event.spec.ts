import { UniqueEntityId } from "@/entities/unique-entity-id";
import { MethodNotImplementedError } from "@/errors/method-not-implemented-error";
import { DomainEvent } from "./domain-event";

class FakeId extends UniqueEntityId {
	public static create(id: string) {
		return new FakeId(id);
	}
}

class UserCreatedEvent extends DomainEvent {
	public readonly userId: FakeId;
	constructor(userId: FakeId, occurredAt?: Date) {
		super(occurredAt);

		this.userId = userId;
	}

	public getAggregateId() {
		return this.userId;
	}
}

describe("DomainEvent", () => {
	const id = FakeId.create("user-1");

	it("should be able to return the occurrence date", () => {
		const now = new Date();
		const event = new UserCreatedEvent(id, now);

		expect(event.occurredAt).toBe(now);
	});

	it("should be able to return the aggregate ID", () => {
		const event = new UserCreatedEvent(id);

		expect(event.getAggregateId()).toBe(id);
	});

	it("should be able to return a valid hash", () => {
		const event = new UserCreatedEvent(id);
		const hash = event.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});

	it("should set occurredAt to current date if not provided", () => {
		const before = new Date();
		const event = new UserCreatedEvent(id);
		const after = new Date();

		expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
		expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
	});

	it("should not be able to call static create method on base UniqueEntityId", () => {
		expect(() => UniqueEntityId.create("any")).toThrow(
			MethodNotImplementedError,
		);
	});
});

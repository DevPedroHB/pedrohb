import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotificationFactory } from "test/factories/notification-factory";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { ReadAllNotificationsUseCase } from "./read-all-notifications";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let notificationFactory: NotificationFactory;
let sut: ReadAllNotificationsUseCase;

describe("Read all notifications", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		notificationFactory = new NotificationFactory(
			inMemoryNotificationsRepository,
		);
		sut = new ReadAllNotificationsUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to read all user notifications", async () => {
		const recipientId = new UniqueEntityID();

		for (let i = 0; i < 8; i++) {
			await notificationFactory.makeNotification({ readAt: null, recipientId });
		}

		const result = await sut.execute({
			recipientId: recipientId.id,
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value.notifications).toHaveLength(8);
	});
});

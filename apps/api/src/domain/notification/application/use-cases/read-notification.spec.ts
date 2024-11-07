import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotificationFactory } from "test/factories/notification-factory";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { ReadNotificationUseCase } from "./read-notification";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let notificationFactory: NotificationFactory;
let sut: ReadNotificationUseCase;

describe("Read notification", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		notificationFactory = new NotificationFactory(
			inMemoryUsersRepository,
			inMemoryNotificationsRepository,
		);
		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to mark a notification as read when it exists and belongs to the recipient", async () => {
		const { user, notification } = await notificationFactory.makeNotification();

		const result = await sut.execute({
			notificationId: notification.id.id,
			recipientId: user.id.id,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.notification.readAt).not.toBeNull();
			expect(result.value.notification.readAt).toBeInstanceOf(Date);
		}
	});

	it("should bet able to return ResourceNotFoundError when the notification does not exist", async () => {
		const recipientId = new UniqueEntityID();

		const result = await sut.execute({
			notificationId: "non-existing-id",
			recipientId: recipientId.id,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should be able to return NotAllowedError when the recipientId does not match", async () => {
		const recipientId = new UniqueEntityID();
		const { notification } = await notificationFactory.makeNotification();

		const result = await sut.execute({
			notificationId: notification.id.id,
			recipientId: recipientId.id,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});

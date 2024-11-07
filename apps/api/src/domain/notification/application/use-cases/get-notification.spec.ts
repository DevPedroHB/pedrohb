import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotificationFactory } from "test/factories/notification-factory";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetNotificationUseCase } from "./get-notification";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let notificationFactory: NotificationFactory;
let sut: GetNotificationUseCase;

describe("Get notification", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		notificationFactory = new NotificationFactory(
			inMemoryUsersRepository,
			inMemoryNotificationsRepository,
		);
		sut = new GetNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to return a notification when the notification exists and belongs to the recipient", async () => {
		const { user, notification } = await notificationFactory.makeNotification();

		const result = await sut.execute({
			notificationId: notification.id.id,
			recipientId: user.id.id,
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			notification: expect.objectContaining(notification),
		});
	});

	it("should be able to return ResourceNotFoundError when the notification does not exist", async () => {
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

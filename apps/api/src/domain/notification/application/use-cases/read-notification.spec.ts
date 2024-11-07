import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeNotification } from "test/factories/notification-factory";
import { makeUser } from "test/factories/user-factory";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { ReadNotificationUseCase } from "./read-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe("Read notification", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to mark a notification as read when it exists and belongs to the recipient", async () => {
		const { user, notification } = makeNotification();

		await inMemoryNotificationsRepository.items.push(notification);

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
		const user = makeUser();

		const result = await sut.execute({
			notificationId: "non-existing-id",
			recipientId: user.id.id,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should be able to return NotAllowedError when the recipientId does not match", async () => {
		const { notification } = makeNotification();
		const anotherUser = makeUser();

		await inMemoryNotificationsRepository.items.push(notification);

		const result = await sut.execute({
			notificationId: notification.id.id,
			recipientId: anotherUser.id.id,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});

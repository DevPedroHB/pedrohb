import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeNotification } from "test/factories/make-notification";
import { makeUser } from "test/factories/make-user";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { GetNotificationUseCase } from "./get-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: GetNotificationUseCase;

describe("Get notification", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new GetNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to return a notification when the notification exists and belongs to the recipient", async () => {
		const { user, notification } = makeNotification();

		await inMemoryNotificationsRepository.items.push(notification);

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

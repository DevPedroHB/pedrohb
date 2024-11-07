import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotificationFactory } from "test/factories/notification-factory";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FetchNotificationsUseCase } from "./fetch-notifications";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let notificationFactory: NotificationFactory;
let sut: FetchNotificationsUseCase;

describe("Fetch notifications", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		notificationFactory = new NotificationFactory(
			inMemoryUsersRepository,
			inMemoryNotificationsRepository,
		);
		sut = new FetchNotificationsUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to fetch user notifications", async () => {
		const recipientId = new UniqueEntityID();

		for (let i = 0; i < 8; i++) {
			await notificationFactory.makeNotification({
				user: { id: recipientId },
				notification: { recipientId },
			});
		}

		const firstPageResult = await sut.execute({
			recipientId: recipientId.id,
			page: 1,
			perPage: 5,
		});
		const secondPageResult = await sut.execute({
			recipientId: recipientId.id,
			page: 2,
			perPage: 5,
		});

		expect(firstPageResult.isSuccess() && secondPageResult.isSuccess()).toBe(
			true,
		);
		expect(firstPageResult.value?.notifications).toHaveLength(5);
		expect(secondPageResult.value?.notifications).toHaveLength(3);
	});
});

import { makeNotification } from "test/factories/notification-factory";
import { makeUser } from "test/factories/user-factory";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { FetchNotificationsUseCase } from "./fetch-notifications";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: FetchNotificationsUseCase;

describe("Fetch notifications", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new FetchNotificationsUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to fetch user notifications", async () => {
		const user = makeUser();

		for (let i = 0; i < 8; i++) {
			const { notification } = makeNotification({ recipientId: user.id });

			await inMemoryNotificationsRepository.items.push(notification);
		}

		const firstPageResult = await sut.execute({
			recipientId: user.id.id,
			page: 1,
			perPage: 5,
		});
		const secondPageResult = await sut.execute({
			recipientId: user.id.id,
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

import { makeUser } from "test/factories/make-user";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { CreateNotificationUseCase } from "./create-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: CreateNotificationUseCase;

describe("Create notification", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new CreateNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to create a notification", async () => {
		const user = makeUser();

		const result = await sut.execute({
			title: "An example title",
			content: "An example content",
			recipientId: user.id.id,
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			notification: inMemoryNotificationsRepository.items[0],
		});
	});
});

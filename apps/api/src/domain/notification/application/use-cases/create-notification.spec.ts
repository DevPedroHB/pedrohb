import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error";
import { UserFactory } from "test/factories/user-factory";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { CreateNotificationUseCase } from "./create-notification";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let userFactory: UserFactory;
let sut: CreateNotificationUseCase;

describe("Create notification", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		userFactory = new UserFactory(inMemoryUsersRepository);
		sut = new CreateNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to create a notification", async () => {
		const user = await userFactory.makeUser();

		const content = [
			{
				type: "p",
				children: [
					{
						text: "An example content",
					},
				],
			},
		];

		const result = await sut.execute({
			title: "An example title",
			content: JSON.stringify(content),
			recipientId: user.id.id,
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			notification: inMemoryNotificationsRepository.items[0],
		});
	});

	it("should be able to return an error if content is not valid JSON", async () => {
		const user = await userFactory.makeUser();

		const result = await sut.execute({
			title: "An example title",
			content: "invalid-json",
			recipientId: user.id.id,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidCredentialsError);
	});
});

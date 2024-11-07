import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error";
import { makeUser } from "test/factories/user-factory";
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
		const user = makeUser();

		const result = await sut.execute({
			title: "An example title",
			content: "invalid-json",
			recipientId: user.id.id,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidCredentialsError);
	});
});

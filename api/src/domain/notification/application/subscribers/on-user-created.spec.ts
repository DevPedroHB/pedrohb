import { makeUser } from "test/factories/make-user";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { waitFor } from "test/utils/wait-for";
import { MockInstance } from "vitest";
import { CreateNotificationUseCase } from "../use-cases/create-notification";
import { OnUserCreated } from "./on-user-created";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let createNotification: CreateNotificationUseCase;

let createNotificationExecuteSpy: MockInstance<
	typeof createNotification.execute
>;

describe("On user created", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		createNotification = new CreateNotificationUseCase(
			inMemoryNotificationsRepository,
		);

		createNotificationExecuteSpy = vi.spyOn(createNotification, "execute");

		new OnUserCreated(createNotification);
	});

	it("should be able to send notification when a user is created", async () => {
		const user = makeUser();

		await inMemoryUsersRepository.create(user);

		await waitFor(() => {
			expect(createNotificationExecuteSpy).toHaveBeenCalled();
		});
	});
});

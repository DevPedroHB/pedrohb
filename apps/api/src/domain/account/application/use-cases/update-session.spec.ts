import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeSession } from "test/factories/make-session";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UpdateSessionUseCase } from "./update-session";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let sut: UpdateSessionUseCase;

describe("Update Session", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemorySessionsRepository = new InMemorySessionsRepository(
			inMemoryUsersRepository,
		);
		sut = new UpdateSessionUseCase(inMemorySessionsRepository);
	});

	it("should be able to update an existing session", async () => {
		const { user, session } = makeSession();

		await inMemoryUsersRepository.items.push(user);
		await inMemorySessionsRepository.items.push(session);

		const newExpiresAt = new Date(Date.now() + 3600 * 1000);
		const newUserId = "new-user-id";

		const result = await sut.execute({
			sessionToken: session.sessionToken,
			expiresAt: newExpiresAt,
			userId: newUserId,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.session).toBeDefined();
			expect(result.value.session.expiresAt).toBe(newExpiresAt);
			expect(result.value.session.userId.id).toBe(newUserId);
		}
	});

	it("should be able to return error if session does not exist", async () => {
		const result = await sut.execute({
			sessionToken: "non-existent-session-token",
			expiresAt: new Date(),
			userId: "some-user-id",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});

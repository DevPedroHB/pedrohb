import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeSession } from "test/factories/session-factory";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DeleteSessionUseCase } from "./delete-session";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let sut: DeleteSessionUseCase;

describe("Delete session", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemorySessionsRepository = new InMemorySessionsRepository(
			inMemoryUsersRepository,
		);
		sut = new DeleteSessionUseCase(inMemorySessionsRepository);
	});

	it("should be able to delete an existing session", async () => {
		const { user, session } = makeSession();

		await inMemoryUsersRepository.items.push(user);
		await inMemorySessionsRepository.items.push(session);

		const result = await sut.execute({
			sessionToken: session.sessionToken,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.session).toEqual(session);
		}

		expect(inMemorySessionsRepository.items).not.toContain(session);
	});

	it("should be able to return error if session does not exist", async () => {
		const result = await sut.execute({
			sessionToken: "non-existent-session-token",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});

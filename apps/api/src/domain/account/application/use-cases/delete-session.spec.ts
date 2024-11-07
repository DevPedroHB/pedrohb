import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SessionFactory } from "test/factories/session-factory";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DeleteSessionUseCase } from "./delete-session";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let sessionFactory: SessionFactory;
let sut: DeleteSessionUseCase;

describe("Delete session", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemorySessionsRepository = new InMemorySessionsRepository(
			inMemoryUsersRepository,
		);
		sessionFactory = new SessionFactory(
			inMemoryUsersRepository,
			inMemorySessionsRepository,
		);
		sut = new DeleteSessionUseCase(inMemorySessionsRepository);
	});

	it("should be able to delete an existing session", async () => {
		const { session } = await sessionFactory.makeSession();

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

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SessionFactory } from "test/factories/session-factory";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetSessionUseCase } from "./get-session";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let sessionFactory: SessionFactory;
let sut: GetSessionUseCase;

describe("Get session", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemorySessionsRepository = new InMemorySessionsRepository(
			inMemoryUsersRepository,
		);
		sessionFactory = new SessionFactory(
			inMemoryUsersRepository,
			inMemorySessionsRepository,
		);
		sut = new GetSessionUseCase(inMemorySessionsRepository);
	});

	it("should be able to get an existing session", async () => {
		const { session } = await sessionFactory.makeSession();

		const result = await sut.execute({
			sessionToken: session.sessionToken,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.sessionAndUser).toBeDefined();
			expect(result.value.sessionAndUser.session.sessionToken).toBe(
				session.sessionToken,
			);
		}
	});

	it("should be able to return error if session does not exist", async () => {
		const result = await sut.execute({
			sessionToken: "non-existent-session-token",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});

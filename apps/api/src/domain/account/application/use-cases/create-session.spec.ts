import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { SessionFactory } from "test/factories/session-factory";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { CreateSessionUseCase } from "./create-session";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let sessionFactory: SessionFactory;
let sut: CreateSessionUseCase;

describe("Create session", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemorySessionsRepository = new InMemorySessionsRepository(
			inMemoryUsersRepository,
		);
		sessionFactory = new SessionFactory(inMemorySessionsRepository);
		sut = new CreateSessionUseCase(inMemorySessionsRepository);
	});

	it("should be able to create a new session", async () => {
		const data = {
			sessionToken: "session-token-123",
			expiresAt: new Date(Date.now() + 3600000),
			userId: "user-id-123",
		};

		const result = await sut.execute(data);

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.session).toBeDefined();
			expect(result.value.session.sessionToken).toBe(data.sessionToken);
		}

		expect(inMemorySessionsRepository.items).toHaveLength(1);
		expect(inMemorySessionsRepository.items[0].sessionToken).toBe(
			data.sessionToken,
		);
	});

	it("should be able to return error if session already exists", async () => {
		const session = await sessionFactory.makeSession();

		const result = await sut.execute({
			sessionToken: session.sessionToken,
			expiresAt: session.expiresAt,
			userId: session.userId.id,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(AlreadyExistsError);
		expect(inMemorySessionsRepository.items).toHaveLength(1);
	});
});

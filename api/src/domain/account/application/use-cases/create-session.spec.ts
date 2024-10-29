import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { makeSession } from "test/factories/make-session";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { CreateSessionUseCase } from "./create-session";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let sut: CreateSessionUseCase;

describe("Create session", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemorySessionsRepository = new InMemorySessionsRepository(
			inMemoryUsersRepository,
		);
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
		const { user, session } = makeSession();

		await inMemoryUsersRepository.items.push(user);
		await inMemorySessionsRepository.items.push(session);

		const result = await sut.execute({
			sessionToken: session.sessionToken,
			expiresAt: new Date(Date.now() + 3600000),
			userId: "user-id-123",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(AlreadyExistsError);
		expect(inMemorySessionsRepository.items).toHaveLength(1);
	});
});

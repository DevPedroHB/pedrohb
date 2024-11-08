import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SessionFactory } from "test/factories/session-factory";
import { UserFactory } from "test/factories/user-factory";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetSessionUseCase } from "./get-session";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let userFactory: UserFactory;
let sessionFactory: SessionFactory;
let sut: GetSessionUseCase;

describe("Get session", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemorySessionsRepository = new InMemorySessionsRepository(
			inMemoryUsersRepository,
		);
		userFactory = new UserFactory(inMemoryUsersRepository);
		sessionFactory = new SessionFactory(inMemorySessionsRepository);
		sut = new GetSessionUseCase(inMemorySessionsRepository);
	});

	it("should be able to get an existing session", async () => {
		const user = await userFactory.makeUser();
		const session = await sessionFactory.makeSession({ userId: user.id });

		const result = await sut.execute({
			sessionToken: session.sessionToken,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.sessionAndUser).toBeDefined();
			expect(result.value.sessionAndUser).toEqual({
				_props: expect.objectContaining({
					session: expect.objectContaining({
						sessionToken: session.sessionToken,
					}),
					user: expect.objectContaining({
						id: user.id,
					}),
				}),
			});
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

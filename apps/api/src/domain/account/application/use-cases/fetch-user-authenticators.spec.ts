import { AuthenticatorFactory } from "test/factories/authenticator-factory";
import { InMemoryAuthenticatorsRepository } from "test/repositories/in-memory-authenticators-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FetchUserAuthenticatorsUseCase } from "./fetch-user-authenticators";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAuthenticatorsRepository: InMemoryAuthenticatorsRepository;
let authenticatorFactory: AuthenticatorFactory;
let sut: FetchUserAuthenticatorsUseCase;

describe("Fetch user authenticators", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAuthenticatorsRepository = new InMemoryAuthenticatorsRepository();
		authenticatorFactory = new AuthenticatorFactory(
			inMemoryAuthenticatorsRepository,
		);
		sut = new FetchUserAuthenticatorsUseCase(inMemoryAuthenticatorsRepository);
	});

	it("should be able to fetch authenticators for a user", async () => {
		const authenticator = await authenticatorFactory.makeAuthenticator();

		const result = await sut.execute({
			userId: authenticator.userId.id,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.authenticators).toBeDefined();
			expect(result.value.authenticators.length).toBe(1);
			expect(result.value.authenticators[0].credentialId).toBe(
				authenticator.credentialId,
			);
		}
	});

	it("should be able to return an empty array if no authenticators are found for the user", async () => {
		const result = await sut.execute({
			userId: "non-existent-user-id",
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.authenticators).toBeDefined();
			expect(result.value.authenticators.length).toBe(0);
		}
	});
});

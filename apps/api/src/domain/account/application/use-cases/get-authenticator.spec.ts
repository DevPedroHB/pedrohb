import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AuthenticatorFactory } from "test/factories/authenticator-factory";
import { InMemoryAuthenticatorsRepository } from "test/repositories/in-memory-authenticators-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetAuthenticatorUseCase } from "./get-authenticator";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAuthenticatorsRepository: InMemoryAuthenticatorsRepository;
let authenticatorFactory: AuthenticatorFactory;
let sut: GetAuthenticatorUseCase;

describe("Get authenticator", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAuthenticatorsRepository = new InMemoryAuthenticatorsRepository();
		authenticatorFactory = new AuthenticatorFactory(
			inMemoryAuthenticatorsRepository,
		);
		sut = new GetAuthenticatorUseCase(inMemoryAuthenticatorsRepository);
	});

	it("should be able to get an existing authenticator", async () => {
		const authenticator = await authenticatorFactory.makeAuthenticator();

		const result = await sut.execute({
			credentialId: authenticator.credentialId,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.authenticator).toBeDefined();
			expect(result.value.authenticator.credentialId).toBe(
				authenticator.credentialId,
			);
		}
	});

	it("should be able to return an error if authenticator does not exist", async () => {
		const result = await sut.execute({
			credentialId: "non-existent-credential-id",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});

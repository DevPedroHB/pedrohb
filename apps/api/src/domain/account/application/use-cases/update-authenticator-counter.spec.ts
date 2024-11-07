import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AuthenticatorFactory } from "test/factories/authenticator-factory";
import { InMemoryAuthenticatorsRepository } from "test/repositories/in-memory-authenticators-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UpdateAuthenticatorCounterUseCase } from "./update-authenticator-counter";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAuthenticatorsRepository: InMemoryAuthenticatorsRepository;
let authenticatorFactory: AuthenticatorFactory;
let sut: UpdateAuthenticatorCounterUseCase;

describe("Update authenticator counter", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAuthenticatorsRepository = new InMemoryAuthenticatorsRepository();
		authenticatorFactory = new AuthenticatorFactory(
			inMemoryUsersRepository,
			inMemoryAuthenticatorsRepository,
		);
		sut = new UpdateAuthenticatorCounterUseCase(
			inMemoryAuthenticatorsRepository,
		);
	});

	it("should be able to update the counter of an existing authenticator", async () => {
		const { authenticator } = await authenticatorFactory.makeAuthenticator();

		const newCounter = authenticator.counter + 1;

		const result = await sut.execute({
			credentialId: authenticator.credentialId,
			counter: newCounter,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.authenticator.counter).toBe(newCounter);
		}
	});

	it("should be able to return an error if the authenticator does not exist", async () => {
		const result = await sut.execute({
			credentialId: "non-existent-credential-id",
			counter: 1,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeAuthenticator } from "test/factories/authenticator-factory";
import { InMemoryAuthenticatorsRepository } from "test/repositories/in-memory-authenticators-repository";
import { GetAuthenticatorUseCase } from "./get-authenticator";

let inMemoryAuthenticatorsRepository: InMemoryAuthenticatorsRepository;
let sut: GetAuthenticatorUseCase;

describe("Get authenticator", () => {
	beforeEach(() => {
		inMemoryAuthenticatorsRepository = new InMemoryAuthenticatorsRepository();
		sut = new GetAuthenticatorUseCase(inMemoryAuthenticatorsRepository);
	});

	it("should be able to get an existing authenticator", async () => {
		const { authenticator } = makeAuthenticator();

		await inMemoryAuthenticatorsRepository.items.push(authenticator);

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

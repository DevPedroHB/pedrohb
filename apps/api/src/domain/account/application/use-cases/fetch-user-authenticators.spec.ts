import { makeAuthenticator } from "test/factories/authenticator-factory";
import { InMemoryAuthenticatorsRepository } from "test/repositories/in-memory-authenticators-repository";
import { FetchUserAuthenticatorsUseCase } from "./fetch-user-authenticators";

let inMemoryAuthenticatorsRepository: InMemoryAuthenticatorsRepository;
let sut: FetchUserAuthenticatorsUseCase;

describe("Fetch user authenticators", () => {
	beforeEach(() => {
		inMemoryAuthenticatorsRepository = new InMemoryAuthenticatorsRepository();
		sut = new FetchUserAuthenticatorsUseCase(inMemoryAuthenticatorsRepository);
	});

	it("should be able to fetch authenticators for a user", async () => {
		const { authenticator } = makeAuthenticator();

		await inMemoryAuthenticatorsRepository.items.push(authenticator);

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

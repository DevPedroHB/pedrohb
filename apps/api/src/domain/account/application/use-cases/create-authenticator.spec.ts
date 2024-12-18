import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import {
	AuthenticatorFactory,
	makeAuthenticator,
} from "test/factories/authenticator-factory";
import { InMemoryAuthenticatorsRepository } from "test/repositories/in-memory-authenticators-repository";
import { CreateAuthenticatorUseCase } from "./create-authenticator";

let inMemoryAuthenticatorsRepository: InMemoryAuthenticatorsRepository;
let authenticatorFactory: AuthenticatorFactory;
let sut: CreateAuthenticatorUseCase;

describe("Create authenticator", () => {
	beforeEach(() => {
		inMemoryAuthenticatorsRepository = new InMemoryAuthenticatorsRepository();
		authenticatorFactory = new AuthenticatorFactory(
			inMemoryAuthenticatorsRepository,
		);
		sut = new CreateAuthenticatorUseCase(inMemoryAuthenticatorsRepository);
	});

	it("should be able to create a new authenticator", async () => {
		const authenticator = makeAuthenticator();

		const result = await sut.execute({
			credentialId: authenticator.credentialId,
			providerAccountId: authenticator.providerAccountId,
			credentialPublicKey: authenticator.credentialPublicKey,
			counter: authenticator.counter,
			credentialDeviceType: authenticator.credentialDeviceType,
			credentialBackedUp: authenticator.credentialBackedUp,
			transports: authenticator.transports,
			userId: authenticator.userId.id,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.authenticator).toBeDefined();
			expect(result.value.authenticator.credentialId).toBe(
				authenticator.credentialId,
			);
		}
	});

	it("should be able to return an error if authenticator already exists", async () => {
		const authenticator = await authenticatorFactory.makeAuthenticator();

		const result = await sut.execute({
			credentialId: authenticator.credentialId,
			providerAccountId: authenticator.providerAccountId,
			credentialPublicKey: authenticator.credentialPublicKey,
			counter: authenticator.counter,
			credentialDeviceType: authenticator.credentialDeviceType,
			credentialBackedUp: authenticator.credentialBackedUp,
			transports: authenticator.transports,
			userId: authenticator.userId.id,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(AlreadyExistsError);
	});
});

import { CreateAuthenticatorUseCase } from "@/domain/account/application/use-cases/create-authenticator";
import { Public } from "@/infra/auth/public";
import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
	CreateAuthenticatorBodyDto,
	CreateAuthenticatorParamDto,
} from "../../dtos/account/create-authenticator.dto";
import { ErrorHandler } from "../../error-handler";
import { AuthenticatorPresenter } from "../../presenters/authenticator-presenter";

@ApiTags("authenticators")
@Public()
@Controller({ path: "/authenticators/:userId", version: "v1" })
export class CreateAuthenticatorController {
	constructor(private createAuthenticator: CreateAuthenticatorUseCase) {}

	@Post()
	async handle(
		@Param() { userId }: CreateAuthenticatorParamDto,
		@Body() {
			credentialId,
			providerAccountId,
			credentialPublicKey,
			counter,
			credentialDeviceType,
			credentialBackedUp,
			transports,
		}: CreateAuthenticatorBodyDto,
	) {
		const result = await this.createAuthenticator.execute({
			credentialId,
			providerAccountId,
			credentialPublicKey,
			counter,
			credentialDeviceType,
			credentialBackedUp,
			transports,
			userId,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			authenticator: AuthenticatorPresenter.toHTTP(result.value.authenticator),
		};
	}
}

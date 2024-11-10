import { GetAuthenticatorUseCase } from "@/domain/account/application/use-cases/get-authenticator";
import { Public } from "@/infra/auth/public";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetAuthenticatorParamDto } from "../../dtos/account/get-authenticator.dto";
import { ErrorHandler } from "../../error-handler";
import { AuthenticatorPresenter } from "../../presenters/authenticator-presenter";

@ApiTags("authenticators")
@Public()
@Controller({
	path: "/authenticators/credential-id/:credentialId",
	version: "v1",
})
export class GetAuthenticatorController {
	constructor(private getAuthenticator: GetAuthenticatorUseCase) {}

	@Get()
	async handle(@Param() { credentialId }: GetAuthenticatorParamDto) {
		const result = await this.getAuthenticator.execute({ credentialId });

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			authenticator: AuthenticatorPresenter.toHTTP(result.value.authenticator),
		};
	}
}

import { UpdateAuthenticatorCounterUseCase } from "@/domain/account/application/use-cases/update-authenticator-counter";
import { Public } from "@/infra/auth/public";
import { Body, Controller, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
	UpdateAuthenticatorCounterBodyDto,
	UpdateAuthenticatorCounterParamDto,
} from "../../dtos/account/update-authenticator-counter.dto";
import { ErrorHandler } from "../../error-handler";
import { AuthenticatorPresenter } from "../../presenters/authenticator-presenter";

@ApiTags("authenticators")
@Public()
@Controller({ path: "/authenticators/:credentialId", version: "v1" })
export class UpdateAuthenticatorCounterController {
	constructor(
		private updateAuthenticatorCounter: UpdateAuthenticatorCounterUseCase,
	) {}

	@Patch()
	async handle(
		@Param() { credentialId }: UpdateAuthenticatorCounterParamDto,
		@Body() { counter }: UpdateAuthenticatorCounterBodyDto,
	) {
		const result = await this.updateAuthenticatorCounter.execute({
			credentialId,
			counter,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			authenticator: AuthenticatorPresenter.toHTTP(result.value.authenticator),
		};
	}
}

import { FetchUserAuthenticatorsUseCase } from "@/domain/account/application/use-cases/fetch-user-authenticators";
import { Public } from "@/infra/auth/public";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FetchUserAuthenticatorsParamDto } from "../../dtos/account/fetch-user-authenticators.dto";
import { ErrorHandler } from "../../error-handler";
import { AuthenticatorPresenter } from "../../presenters/authenticator-presenter";

@ApiTags("Authenticators")
@Public()
@Controller({ path: "/authenticators/user-id/:userId", version: "v1" })
export class FetchUserAuthenticatorsController {
	constructor(
		private fetchUserAuthenticators: FetchUserAuthenticatorsUseCase,
	) {}

	@ApiOperation({
		summary: "Deve ser possível buscar todos os autenticadores de um usuário",
	})
	@Get()
	async handle(@Param() { userId }: FetchUserAuthenticatorsParamDto) {
		const result = await this.fetchUserAuthenticators.execute({ userId });

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			authenticators: result.value.authenticators.map(
				AuthenticatorPresenter.toHTTP,
			),
		};
	}
}

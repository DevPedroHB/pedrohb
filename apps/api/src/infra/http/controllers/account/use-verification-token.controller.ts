import { UseVerificationTokenUseCase } from "@/domain/account/application/use-cases/use-verification-token";
import { Public } from "@/infra/auth/public";
import { Controller, Param, Patch } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UseVerificationTokenDto } from "../../dtos/account/use-verification-token.dto";
import { ErrorHandler } from "../../error-handler";
import { VerificationTokenPresenter } from "../../presenters/verification-token-presenter";

@ApiTags("Verification tokens")
@Public()
@Controller({ path: "/verification-tokens/:identifier/:token", version: "v1" })
export class UseVerificationTokenController {
	constructor(private useVerificationToken: UseVerificationTokenUseCase) {}

	@ApiOperation({ summary: "Deve ser possível usar o token de verificação" })
	@Patch()
	async handle(@Param() { identifier, token }: UseVerificationTokenDto) {
		const result = await this.useVerificationToken.execute({
			identifier,
			token,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			verificationToken: VerificationTokenPresenter.toHTTP(
				result.value.verificationToken,
			),
		};
	}
}

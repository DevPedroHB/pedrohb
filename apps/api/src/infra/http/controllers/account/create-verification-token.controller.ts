import { CreateVerificationTokenUseCase } from "@/domain/account/application/use-cases/create-verification-token";
import { Public } from "@/infra/auth/public";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateVerificationTokenBodyDto } from "../../dtos/account/create-verification-token.dto";
import { ErrorHandler } from "../../error-handler";
import { VerificationTokenPresenter } from "../../presenters/verification-token-presenter";

@ApiTags("Verification tokens")
@Public()
@Controller({ path: "/verification-tokens", version: "v1" })
export class CreateVerificationTokenController {
	constructor(
		private createVerificationToken: CreateVerificationTokenUseCase,
	) {}

	@ApiOperation({ summary: "Deve ser possível criar um token de verificação" })
	@Post()
	async handle(
		@Body() { identifier, token, expiresAt }: CreateVerificationTokenBodyDto,
	) {
		const result = await this.createVerificationToken.execute({
			identifier,
			token,
			expiresAt,
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

import { CreateVerificationTokenUseCase } from "@/domain/account/application/use-cases/create-verification-token";
import { Public } from "@/infra/auth/public";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateVerificationTokenBodyDto } from "../../dtos/account/create-verification-token.dto";
import { ErrorHandler } from "../../error-handler";
import { VerificationTokenPresenter } from "../../presenters/verification-token-presenter";

@ApiTags("verification-tokens")
@Public()
@Controller({ path: "/verification-tokens", version: "v1" })
export class CreateVerificationTokenController {
	constructor(
		private createVerificationToken: CreateVerificationTokenUseCase,
	) {}

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

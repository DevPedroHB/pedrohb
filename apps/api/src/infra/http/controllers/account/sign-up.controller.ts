import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { Public } from "@/infra/auth/public";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SignUpBodyDto } from "../../dtos/account/sign-up.dto";
import { ErrorHandler } from "../../error-handler";
import { UserPresenter } from "./../../presenters/user-presenter";

@ApiTags("Users")
@Public()
@Controller({ path: "/users/sign-up", version: "v1" })
export class SignUpController {
	constructor(private signUp: SignUpUseCase) {}

	@ApiOperation({ summary: "Deve ser possível criar um usuário" })
	@Post()
	async handle(
		@Body() {
			name,
			email,
			password,
			avatarUrl,
			birthdate,
			emailVerifiedAt,
		}: SignUpBodyDto,
	) {
		const result = await this.signUp.execute({
			name,
			email,
			password,
			avatarUrl,
			birthdate,
			emailVerifiedAt,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			user: UserPresenter.toHTTP(result.value.user),
			token: result.value.token,
		};
	}
}

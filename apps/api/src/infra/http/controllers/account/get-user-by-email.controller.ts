import { GetUserByEmailUseCase } from "@/domain/account/application/use-cases/get-user-by-email";
import { Public } from "@/infra/auth/public";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetUserByEmailParamDto } from "../../dtos/account/get-user-by-email.dto";
import { ErrorHandler } from "../../error-handler";
import { UserPresenter } from "../../presenters/user-presenter";

@ApiTags("users")
@Public()
@Controller({ path: "/users/email/:email", version: "v1" })
export class GetUserByEmailController {
	constructor(private getUserByEmail: GetUserByEmailUseCase) {}

	@ApiOperation({ summary: "Get user by email" })
	@Get()
	async handle(@Param() { email }: GetUserByEmailParamDto) {
		const result = await this.getUserByEmail.execute({ email });

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			user: UserPresenter.toHTTP(result.value.user),
		};
	}
}

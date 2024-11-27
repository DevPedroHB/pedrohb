import { GetUserByIdUseCase } from "@/domain/account/application/use-cases/get-user-by-id";
import { Public } from "@/infra/auth/public";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetUserByIdParamDto } from "../../dtos/account/get-user-by-id.dto";
import { ErrorHandler } from "../../error-handler";
import { UserPresenter } from "../../presenters/user-presenter";

@ApiTags("Users")
@Public()
@Controller({ path: "/users/:userId", version: "v1" })
export class GetUserByIdController {
	constructor(private getUserById: GetUserByIdUseCase) {}

	@ApiOperation({ summary: "Deve ser possível obter o usuário pelo ID" })
	@Get()
	async handle(@Param() { userId }: GetUserByIdParamDto) {
		const result = await this.getUserById.execute({ userId });

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			user: UserPresenter.toHTTP(result.value.user),
		};
	}
}

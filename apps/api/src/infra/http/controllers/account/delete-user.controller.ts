import { DeleteUserUseCase } from "@/domain/account/application/use-cases/delete-user";
import { Public } from "@/infra/auth/public";
import { Controller, Delete, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { DeleteUserParamDto } from "../../dtos/account/delete-user.dto";
import { ErrorHandler } from "../../error-handler";
import { UserPresenter } from "../../presenters/user-presenter";

@ApiTags("Users")
@Public()
@Controller({ path: "/users/:userId", version: "v1" })
export class DeleteUserController {
	constructor(private deleteUser: DeleteUserUseCase) {}

	@ApiOperation({ summary: "Deve ser possível excluir um usuário" })
	@Delete()
	async handle(@Param() { userId }: DeleteUserParamDto) {
		const result = await this.deleteUser.execute({ userId });

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			user: UserPresenter.toHTTP(result.value.user),
		};
	}
}

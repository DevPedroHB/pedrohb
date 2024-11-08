import { DeleteUserUseCase } from "@/domain/account/application/use-cases/delete-user";
import { Public } from "@/infra/auth/public";
import { Controller, Delete, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteUserParamDto } from "../../dtos/account/delete-user.dto";
import { ErrorHandler } from "../../error-handler";
import { UserPresenter } from "../../presenters/user-presenter";

@ApiTags("users")
@Public()
@Controller({ path: "/users/:userId", version: "v1" })
export class DeleteUserController {
	constructor(private deleteUser: DeleteUserUseCase) {}

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

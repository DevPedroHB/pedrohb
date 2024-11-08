import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeleteUserUseCase } from "@/domain/account/application/use-cases/delete-user";
import { Public } from "@/infra/auth/public";
import {
	BadRequestException,
	Controller,
	Delete,
	NotFoundException,
	Param,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteUserParamDto } from "../../dtos/account/delete-user.dto";
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
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			user: UserPresenter.toHTTP(result.value.user),
		};
	}
}

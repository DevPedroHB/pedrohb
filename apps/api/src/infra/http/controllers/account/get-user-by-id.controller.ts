import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetUserByIdUseCase } from "@/domain/account/application/use-cases/get-user-by-id";
import { Public } from "@/infra/auth/public";
import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Param,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { GetUserByIdParamDto } from "../../dtos/account/get-user-by-id.dto";
import { UserPresenter } from "../../presenters/user-presenter";

@ApiTags("users")
@Public()
@Controller({ path: "/users/:userId", version: "v1" })
export class GetUserByIdController {
	constructor(private getUserById: GetUserByIdUseCase) {}

	@Get()
	async handle(@Param() body: GetUserByIdParamDto) {
		const { userId } = body;

		const result = await this.getUserById.execute({ userId });

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

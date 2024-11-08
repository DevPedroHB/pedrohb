import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetUserByEmailUseCase } from "@/domain/account/application/use-cases/get-user-by-email";
import { Public } from "@/infra/auth/public";
import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Param,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUserByEmailParamDto } from "../../dtos/account/get-user-by-email.dto";
import { UserPresenter } from "../../presenters/user-presenter";

@ApiTags("users")
@Public()
@Controller({ path: "/users/email/:email", version: "v1" })
export class GetUserByEmailController {
	constructor(private getUserByEmail: GetUserByEmailUseCase) {}

	@Get()
	async handle(@Param() { email }: GetUserByEmailParamDto) {
		const result = await this.getUserByEmail.execute({ email });

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

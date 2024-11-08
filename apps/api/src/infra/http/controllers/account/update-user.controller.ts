import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UpdateUserUseCase } from "@/domain/account/application/use-cases/update-user";
import { Public } from "@/infra/auth/public";
import {
	BadRequestException,
	Body,
	Controller,
	NotFoundException,
	Param,
	Put,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
	UpdateUserBodyDto,
	UpdateUserParamDto,
} from "../../dtos/account/update-user.dto";
import { UserPresenter } from "../../presenters/user-presenter";

@ApiTags("users")
@Public()
@Controller({ path: "/users/:userId", version: "v1" })
export class UpdateUserController {
	constructor(private updateUser: UpdateUserUseCase) {}

	@Put()
	async handle(
		@Param() { userId }: UpdateUserParamDto,
		@Body() {
			name,
			email,
			password,
			avatarUrl,
			birthdate,
			role,
			emailVerifiedAt,
		}: UpdateUserBodyDto,
	) {
		const result = await this.updateUser.execute({
			userId,
			name,
			email,
			password,
			avatarUrl,
			birthdate,
			role,
			emailVerifiedAt,
		});

		if (result.isError()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				case NotAllowedError:
					throw new UnauthorizedException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			user: UserPresenter.toHTTP(result.value.user),
		};
	}
}

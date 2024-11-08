import { UpdateUserUseCase } from "@/domain/account/application/use-cases/update-user";
import { Public } from "@/infra/auth/public";
import { Body, Controller, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
	UpdateUserBodyDto,
	UpdateUserParamDto,
} from "../../dtos/account/update-user.dto";
import { ErrorHandler } from "../../error-handler";
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
			ErrorHandler.handle(result.value);
		}

		return {
			user: UserPresenter.toHTTP(result.value.user),
		};
	}
}

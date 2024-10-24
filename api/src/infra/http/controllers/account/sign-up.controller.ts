import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { Public } from "@/infra/auth/public";
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SignUpBodyDto } from "../../dtos/account/sign-up.dto";
import { UserPresenter } from "./../../presenters/user-presenter";

@ApiTags("users")
@Public()
@Controller({ path: "/users/sign-up", version: "v1" })
export class SignUpController {
	constructor(private signUp: SignUpUseCase) {}

	@Post()
	async handle(@Body() body: SignUpBodyDto) {
		const { name, email, password, avatarUrl, birthdate, emailVerifiedAt } =
			body;

		const result = await this.signUp.execute({
			name,
			email,
			password,
			avatarUrl,
			birthdate,
			emailVerifiedAt,
		});

		if (result.isError()) {
			const error = result.value;

			switch (error.constructor) {
				case AlreadyExistsError:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			user: UserPresenter.toHTTP(result.value.user),
			token: result.value.token,
		};
	}
}

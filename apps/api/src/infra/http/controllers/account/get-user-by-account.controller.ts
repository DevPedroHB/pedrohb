import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetUserByAccountUseCase } from "@/domain/account/application/use-cases/get-user-by-account";
import { Public } from "@/infra/auth/public";
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUserByAccountParamDto } from "../../dtos/account/get-user-by-account.dto";
import { AccountAndUserPresenter } from "../../presenters/account-and-user-presenter";

@ApiTags("accounts")
@Public()
@Controller({
	path: "/accounts/user/:provider/:providerAccountId",
	version: "v1",
})
export class GetUserByAccountController {
	constructor(private getUserByAccount: GetUserByAccountUseCase) {}

	@Get()
	async handle(
		@Param() { provider, providerAccountId }: GetUserByAccountParamDto,
	) {
		const result = await this.getUserByAccount.execute({
			provider,
			providerAccountId,
		});

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
			account: AccountAndUserPresenter.toHTTP(result.value.accountAndUser),
		};
	}
}

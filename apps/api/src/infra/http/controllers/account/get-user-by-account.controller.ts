import { GetUserByAccountUseCase } from "@/domain/account/application/use-cases/get-user-by-account";
import { Public } from "@/infra/auth/public";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetUserByAccountParamDto } from "../../dtos/account/get-user-by-account.dto";
import { ErrorHandler } from "../../error-handler";
import { AccountAndUserPresenter } from "../../presenters/account-and-user-presenter";

@ApiTags("accounts")
@Public()
@Controller({
	path: "/accounts/user/:provider/:providerAccountId",
	version: "v1",
})
export class GetUserByAccountController {
	constructor(private getUserByAccount: GetUserByAccountUseCase) {}

	@ApiOperation({ summary: "Get user by account" })
	@Get()
	async handle(
		@Param() { provider, providerAccountId }: GetUserByAccountParamDto,
	) {
		const result = await this.getUserByAccount.execute({
			provider,
			providerAccountId,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			account: AccountAndUserPresenter.toHTTP(result.value.accountAndUser),
		};
	}
}

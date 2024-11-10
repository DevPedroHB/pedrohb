import { GetAccountUseCase } from "@/domain/account/application/use-cases/get-account";
import { Public } from "@/infra/auth/public";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetAccountParamDto } from "../../dtos/account/get-account.dto";
import { ErrorHandler } from "../../error-handler";
import { AccountPresenter } from "../../presenters/account-presenter";

@ApiTags("accounts")
@Public()
@Controller({ path: "/accounts/:provider/:providerAccountId", version: "v1" })
export class GetAccountController {
	constructor(private getAccount: GetAccountUseCase) {}

	@ApiOperation({ summary: "Get account" })
	@Get()
	async handle(@Param() { provider, providerAccountId }: GetAccountParamDto) {
		const result = await this.getAccount.execute({
			provider,
			providerAccountId,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			account: AccountPresenter.toHTTP(result.value.account),
		};
	}
}

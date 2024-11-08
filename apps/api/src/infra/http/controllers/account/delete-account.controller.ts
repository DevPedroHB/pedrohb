import { DeleteAccountUseCase } from "@/domain/account/application/use-cases/delete-account";
import { Public } from "@/infra/auth/public";
import { Controller, Delete, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteAccountParamDto } from "../../dtos/account/delete-account.dto";
import { ErrorHandler } from "../../error-handler";
import { AccountPresenter } from "../../presenters/account-presenter";

@ApiTags("accounts")
@Public()
@Controller({ path: "/accounts/:provider/:providerAccountId", version: "v1" })
export class DeleteAccountController {
	constructor(private deleteAccount: DeleteAccountUseCase) {}

	@Delete()
	async handle(
		@Param() { provider, providerAccountId }: DeleteAccountParamDto,
	) {
		const result = await this.deleteAccount.execute({
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

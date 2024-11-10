import { CreateAccountUseCase } from "@/domain/account/application/use-cases/create-account";
import { Public } from "@/infra/auth/public";
import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	CreateAccountBodyDto,
	CreateAccountParamDto,
} from "../../dtos/account/create-account.dto";
import { ErrorHandler } from "../../error-handler";
import { AccountPresenter } from "../../presenters/account-presenter";

@ApiTags("accounts")
@Public()
@Controller({ path: "/accounts/:userId", version: "v1" })
export class CreateAccountController {
	constructor(private createAccount: CreateAccountUseCase) {}

	@ApiOperation({ summary: "Create account" })
	@Post()
	async handle(
		@Param() { userId }: CreateAccountParamDto,
		@Body() {
			provider,
			providerAccountId,
			type,
			refreshToken,
			accessToken,
			expiresAt,
			tokenType,
			scope,
			tokenId,
		}: CreateAccountBodyDto,
	) {
		const result = await this.createAccount.execute({
			provider,
			providerAccountId,
			type,
			refreshToken,
			accessToken,
			expiresAt,
			tokenType,
			scope,
			tokenId,
			userId,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			account: AccountPresenter.toHTTP(result.value.account),
		};
	}
}

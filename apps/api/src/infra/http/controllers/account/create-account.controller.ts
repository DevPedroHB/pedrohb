import { CreateAccountUseCase } from "@/domain/account/application/use-cases/create-account";
import { Public } from "@/infra/auth/public";
import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
	CreateAccountBodyDto,
	CreateAccountParamDto,
} from "../../dtos/account/create-account.dto";
import { AccountPresenter } from "../../presenters/account-presenter";

@ApiTags("accounts")
@Public()
@Controller({ path: "/accounts/user/:userId", version: "v1" })
export class CreateAccountController {
	constructor(private createAccount: CreateAccountUseCase) {}

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
			throw new BadRequestException();
		}

		return {
			account: AccountPresenter.toHTTP(result.value.account),
		};
	}
}

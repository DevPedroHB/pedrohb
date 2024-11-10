import { GetSessionUseCase } from "@/domain/account/application/use-cases/get-session";
import { Public } from "@/infra/auth/public";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetSessionParamDto } from "../../dtos/account/get-session.dto";
import { ErrorHandler } from "../../error-handler";
import { SessionAndUserPresenter } from "../../presenters/session-and-user-presenter";

@ApiTags("sessions")
@Public()
@Controller({ path: "/sessions/:sessionToken", version: "v1" })
export class GetSessionController {
	constructor(private getSession: GetSessionUseCase) {}

	@Get()
	async handle(@Param() { sessionToken }: GetSessionParamDto) {
		const result = await this.getSession.execute({ sessionToken });

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			session: SessionAndUserPresenter.toHTTP(result.value.sessionAndUser),
		};
	}
}

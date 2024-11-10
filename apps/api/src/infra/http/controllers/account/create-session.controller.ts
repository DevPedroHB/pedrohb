import { CreateSessionUseCase } from "@/domain/account/application/use-cases/create-session";
import { Public } from "@/infra/auth/public";
import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
	CreateSessionBodyDto,
	CreateSessionParamDto,
} from "../../dtos/account/create-session.dto";
import { ErrorHandler } from "../../error-handler";
import { SessionPresenter } from "../../presenters/session-presenter";

@ApiTags("sessions")
@Public()
@Controller({ path: "/sessions/:userId", version: "v1" })
export class CreateSessionController {
	constructor(private createSession: CreateSessionUseCase) {}

	@Post()
	async handle(
		@Param() { userId }: CreateSessionParamDto,
		@Body() { sessionToken, expiresAt }: CreateSessionBodyDto,
	) {
		const result = await this.createSession.execute({
			sessionToken,
			expiresAt,
			userId,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			session: SessionPresenter.toHTTP(result.value.session),
		};
	}
}

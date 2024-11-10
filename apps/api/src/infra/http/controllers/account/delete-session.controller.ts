import { DeleteSessionUseCase } from "@/domain/account/application/use-cases/delete-session";
import { Public } from "@/infra/auth/public";
import { Controller, Delete, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteSessionParamDto } from "../../dtos/account/delete-session.dto";
import { ErrorHandler } from "../../error-handler";
import { SessionPresenter } from "../../presenters/session-presenter";

@ApiTags("sessions")
@Public()
@Controller({ path: "/sessions/:sessionToken", version: "v1" })
export class DeleteSessionController {
	constructor(private deleteSession: DeleteSessionUseCase) {}

	@Delete()
	async handle(@Param() { sessionToken }: DeleteSessionParamDto) {
		const result = await this.deleteSession.execute({ sessionToken });

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			session: SessionPresenter.toHTTP(result.value.session),
		};
	}
}

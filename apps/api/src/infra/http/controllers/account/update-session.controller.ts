import { UpdateSessionUseCase } from "@/domain/account/application/use-cases/update-session";
import { Public } from "@/infra/auth/public";
import { Body, Controller, Param, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	UpdateSessionBodyDto,
	UpdateSessionParamDto,
} from "../../dtos/account/update-session.dto";
import { ErrorHandler } from "../../error-handler";
import { SessionPresenter } from "../../presenters/session-presenter";

@ApiTags("Sessions")
@Public()
@Controller({ path: "/sessions/:sessionToken", version: "v1" })
export class UpdateSessionController {
	constructor(private updateSession: UpdateSessionUseCase) {}

	@ApiOperation({ summary: "Deve ser possível atualizar uma sessão" })
	@Put()
	async handle(
		@Param() { sessionToken }: UpdateSessionParamDto,
		@Body() { expiresAt, userId }: UpdateSessionBodyDto,
	) {
		const result = await this.updateSession.execute({
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

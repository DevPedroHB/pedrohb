import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common/exceptions";

export class ErrorHandler {
	private static readonly errorMap = new Map([
		[AlreadyExistsError, ConflictException],
		[InvalidCredentialsError, UnauthorizedException],
		[NotAllowedError, ForbiddenException],
		[ResourceNotFoundError, NotFoundException],
	]);

	static handle(error: Error | null): never {
		if (error === null) {
			throw new BadRequestException();
		}

		const ExceptionClass =
			ErrorHandler.errorMap.get(error.constructor as any) ||
			BadRequestException;

		throw new ExceptionClass(error.message);
	}
}

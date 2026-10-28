import type { Result } from "@pedrohb/errors";

export abstract class UseCase<
	Request extends object = object,
	Response extends Result = Result,
> {
	public abstract execute(request: Request): Promise<Response>;
}
